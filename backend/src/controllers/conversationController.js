// backend/src/controllers/conversationController.js
const db = require('../config/database');
const crypto = require('crypto');

exports.getConversations = (req, res) => {
  const currentUserId = req.user.id;

  try {
    const conversations = db.prepare(`
      SELECT c.id, c.type, c.name, c.avatar_url, c.created_at
      FROM conversations c
      JOIN participants p ON c.id = p.conversation_id
      WHERE p.user_id = ?
    `).all(currentUserId);

    const formattedConversations = conversations.map(conv => {
      const lastMessage = db.prepare(`
        SELECT m.body, m.created_at, m.sender_id, u.display_name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at DESC
        LIMIT 1
      `).get(conv.id);

      const unreadCount = db.prepare(`
        SELECT COUNT(*) as count 
        FROM messages 
        WHERE conversation_id = ? AND sender_id != ? AND status != 'read'
      `).get(conv.id, currentUserId).count;

      let displayName = conv.name;
      let displayAvatar = conv.avatar_url;

      if (conv.type === 'direct') {
        const otherUser = db.prepare(`
          SELECT u.id, u.display_name, u.avatar_url, u.phone_number, u.last_seen
          FROM participants p
          JOIN users u ON p.user_id = u.id
          WHERE p.conversation_id = ? AND p.user_id != ?
        `).get(conv.id, currentUserId);
        
        if (otherUser) {
          displayName = otherUser.display_name;
          displayAvatar = otherUser.avatar_url;
          conv.other_user = otherUser; 
        }
      }

      return {
        ...conv,
        name: displayName,
        avatar_url: displayAvatar,
        last_message: lastMessage ? lastMessage.body : null,
        last_message_time: lastMessage ? lastMessage.created_at : conv.created_at,
        last_message_sender: lastMessage ? lastMessage.sender_name : null,
        unread_count: unreadCount || 0
      };
    });

    formattedConversations.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));

    res.status(200).json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Internal server error while fetching conversations' });
  }
};

exports.createDirectConversation = (req, res) => {
  const { other_user_id } = req.body;
  const currentUserId = req.user.id;

  if (!other_user_id) {
    return res.status(400).json({ message: 'Other user ID is required' });
  }

  try {
    const checkContact = db.prepare('SELECT * FROM contacts WHERE user_id = ? AND contact_id = ?');
    const insertContact = db.prepare('INSERT INTO contacts (user_id, contact_id) VALUES (?, ?)');

    if (!checkContact.get(currentUserId, other_user_id)) {
      insertContact.run(currentUserId, other_user_id);
    }
    if (!checkContact.get(other_user_id, currentUserId)) {
      insertContact.run(other_user_id, currentUserId);
    }

    const existingConv = db.prepare(`
      SELECT c.id FROM conversations c
      JOIN participants p1 ON c.id = p1.conversation_id AND p1.user_id = ?
      JOIN participants p2 ON c.id = p2.conversation_id AND p2.user_id = ?
      WHERE c.type = 'direct'
    `).get(currentUserId, other_user_id);

    if (existingConv) {
      return res.status(200).json({ 
        message: 'Conversation already exists',
        conversation_id: existingConv.id
      });
    }

    const newConvId = crypto.randomUUID();
    db.prepare('INSERT INTO conversations (id, type, created_by) VALUES (?, ?, ?)')
      .run(newConvId, 'direct', currentUserId);

    const insertParticipant = db.prepare('INSERT INTO participants (conversation_id, user_id, role) VALUES (?, ?, ?)');
    insertParticipant.run(newConvId, currentUserId, 'admin');
    insertParticipant.run(newConvId, other_user_id, 'member');

    res.status(201).json({ 
      message: 'Direct conversation created',
      conversation_id: newConvId
    });
  } catch (error) {
    console.error('Create direct conversation error:', error);
    res.status(500).json({ message: 'Internal server error while creating conversation' });
  }
};

exports.createGroupConversation = (req, res) => {
  const { name, member_ids } = req.body;
  const currentUserId = req.user.id;

  if (!name || !member_ids || !Array.isArray(member_ids) || member_ids.length === 0) {
    return res.status(400).json({ message: 'Group name and at least one member ID are required' });
  }

  try {
    const newConvId = crypto.randomUUID();
    const groupAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    db.prepare('INSERT INTO conversations (id, type, name, avatar_url, created_by) VALUES (?, ?, ?, ?, ?)')
      .run(newConvId, 'group', name, groupAvatar, currentUserId);

    const insertParticipant = db.prepare('INSERT INTO participants (conversation_id, user_id, role) VALUES (?, ?, ?)');
    insertParticipant.run(newConvId, currentUserId, 'admin');

    member_ids.forEach(memberId => {
      if (memberId !== currentUserId) {
        insertParticipant.run(newConvId, memberId, 'member');
      }
    });

    res.status(201).json({ 
      message: 'Group conversation created',
      conversation_id: newConvId
    });
  } catch (error) {
    console.error('Create group conversation error:', error);
    res.status(500).json({ message: 'Internal server error while creating group' });
  }
};

exports.getMessages = (req, res) => {
  const { conversation_id } = req.params;
  const currentUserId = req.user.id;

  try {
    const isParticipant = db.prepare('SELECT * FROM participants WHERE conversation_id = ? AND user_id = ?').get(conversation_id, currentUserId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    let messages = db.prepare(`
      SELECT m.*, u.display_name as sender_name, u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `).all(conversation_id);

    // Fetch all reactions for these messages
    const reactions = db.prepare(`
      SELECT r.message_id, r.user_id, r.emoji, u.display_name as user_name
      FROM message_reactions r
      JOIN users u ON r.user_id = u.id
      WHERE r.message_id IN (SELECT id FROM messages WHERE conversation_id = ?)
    `).all(conversation_id);

    // Group reactions by message_id
    const reactionsByMessage = {};
    reactions.forEach(r => {
      if (!reactionsByMessage[r.message_id]) reactionsByMessage[r.message_id] = [];
      reactionsByMessage[r.message_id].push(r);
    });

    // Attach reactions to messages
    messages = messages.map(msg => ({
      ...msg,
      reactions: reactionsByMessage[msg.id] || []
    }));

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error while fetching messages' });
  }
};

exports.getParticipants = (req, res) => {
  const { conversation_id } = req.params;
  const currentUserId = req.user.id;

  try {
    const isParticipant = db.prepare('SELECT * FROM participants WHERE conversation_id = ? AND user_id = ?').get(conversation_id, currentUserId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const participants = db.prepare(`
      SELECT u.id, u.display_name, u.avatar_url, u.phone_number, p.role
      FROM participants p
      JOIN users u ON p.user_id = u.id
      WHERE p.conversation_id = ?
    `).all(conversation_id);

    res.status(200).json({ participants });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Internal server error while fetching participants' });
  }
};

exports.addGroupMember = (req, res) => {
  const { conversation_id } = req.params;
  const { user_id } = req.body;
  const currentUserId = req.user.id;

  try {
    const requester = db.prepare('SELECT role FROM participants WHERE conversation_id = ? AND user_id = ?').get(conversation_id, currentUserId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only group admins can add members' });
    }

    const conv = db.prepare('SELECT type FROM conversations WHERE id = ?').get(conversation_id);
    if (!conv || conv.type !== 'group') {
      return res.status(400).json({ message: 'Can only add members to groups' });
    }

    const existing = db.prepare('SELECT * FROM participants WHERE conversation_id = ? AND user_id = ?').get(conversation_id, user_id);
    if (existing) {
      return res.status(400).json({ message: 'User is already in this group' });
    }

    db.prepare('INSERT INTO participants (conversation_id, user_id, role) VALUES (?, ?, ?)').run(conversation_id, user_id, 'member');
    
    const newMember = db.prepare('SELECT id, display_name, avatar_url, phone_number FROM users WHERE id = ?').get(user_id);
    
    res.status(201).json({ message: 'Member added successfully', participant: newMember });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Internal server error while adding member' });
  }
};

exports.removeGroupMember = (req, res) => {
  const { conversation_id, user_id } = req.params;
  const currentUserId = req.user.id;

  try {
    const requester = db.prepare('SELECT role FROM participants WHERE conversation_id = ? AND user_id = ?').get(conversation_id, currentUserId);
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only group admins can remove members' });
    }

    if (user_id === currentUserId) {
      return res.status(400).json({ message: 'You cannot remove yourself from the group' });
    }

    db.prepare('DELETE FROM participants WHERE conversation_id = ? AND user_id = ?').run(conversation_id, user_id);
    
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Internal server error while removing member' });
  }
};