// backend/src/sockets/socketHandler.js
const db = require('../config/database');
const crypto = require('crypto');
const { verifyToken } = require('../utils/jwtUtils');

const onlineUsers = new Map();

function initializeSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    
    try {
      const decoded = verifyToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`⚡ Socket connected: ${userId}`);

    onlineUsers.set(userId, socket.id);
    
    io.emit('user_status_change', {
      userId: userId,
      isOnline: true,
      last_seen: null
    });

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on('send_message', (data, callback) => {
      const { conversation_id, body } = data;
      const sender_id = socket.user.id;

      try {
        const messageId = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        db.prepare(`
          INSERT INTO messages (id, conversation_id, sender_id, body, status, created_at)
          VALUES (?, ?, ?, ?, 'sent', ?)
        `).run(messageId, conversation_id, sender_id, body, createdAt);

        const sender = db.prepare('SELECT id, display_name, avatar_url FROM users WHERE id = ?').get(sender_id);

        const messageData = {
          id: messageId,
          conversation_id,
          sender_id,
          body,
          status: 'sent',
          created_at: createdAt,
          sender_name: sender.display_name,
          sender_avatar: sender.avatar_url,
          reactions: [] // Initialize empty reactions array
        };

        socket.to(conversation_id).emit('receive_message', messageData);

        if (callback) callback({ status: 'ok', message: messageData });

      } catch (error) {
        console.error('Send message error:', error);
        if (callback) callback({ status: 'error', message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data) => {
      const { conversation_id, isTyping } = data;
      socket.to(conversation_id).emit('typing', {
        conversation_id,
        user_id: socket.user.id,
        isTyping
      });
    });

    socket.on('message_delivered', (data) => {
      const { message_id, conversation_id } = data;
      try {
        db.prepare('UPDATE messages SET status = ? WHERE id = ? AND status != ?')
          .run('delivered', message_id, 'read');

        socket.to(conversation_id).emit('message_status_update', {
          message_id,
          conversation_id,
          status: 'delivered'
        });
      } catch (error) {
        console.error('Message delivered error:', error);
      }
    });

    socket.on('message_read', (data) => {
      const { message_id, conversation_id } = data;
      try {
        db.prepare('UPDATE messages SET status = ? WHERE id = ? AND status != ?')
          .run('read', message_id, 'read');

        socket.to(conversation_id).emit('message_status_update', {
          message_id,
          conversation_id,
          status: 'read'
        });
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // NEW: Handle Message Reactions
    socket.on('react_to_message', (data) => {
      const { message_id, conversation_id, emoji } = data;
      const user_id = socket.user.id;

      try {
        // Check if user already reacted to this message
        const existing = db.prepare('SELECT emoji FROM message_reactions WHERE message_id = ? AND user_id = ?').get(message_id, user_id);
        
        if (existing) {
          if (existing.emoji === emoji) {
            // Clicking the same emoji removes the reaction
            db.prepare('DELETE FROM message_reactions WHERE message_id = ? AND user_id = ?').run(message_id, user_id);
          } else {
            // Clicking a different emoji updates the reaction
            db.prepare('UPDATE message_reactions SET emoji = ? WHERE message_id = ? AND user_id = ?').run(emoji, message_id, user_id);
          }
        } else {
          // No existing reaction, insert new one
          db.prepare('INSERT INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)').run(message_id, user_id, emoji);
        }

        // Fetch all reactions for this message to broadcast the final state
        const reactions = db.prepare(`
          SELECT r.message_id, r.user_id, r.emoji, u.display_name as user_name
          FROM message_reactions r
          JOIN users u ON r.user_id = u.id
          WHERE r.message_id = ?
        `).all(message_id);

        // Broadcast to EVERYONE in the room (including sender for UI sync)
        io.to(conversation_id).emit('message_reaction_update', {
          message_id,
          conversation_id,
          reactions
        });

      } catch (error) {
        console.error('Reaction error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`⚡ Socket disconnected: ${userId}`);
      onlineUsers.delete(userId);
      
      const lastSeen = new Date().toISOString();
      db.prepare('UPDATE users SET last_seen = ? WHERE id = ?').run(lastSeen, userId);

      io.emit('user_status_change', {
        userId: userId,
        isOnline: false,
        last_seen: lastSeen
      });
    });
  });
}

module.exports = initializeSocket;