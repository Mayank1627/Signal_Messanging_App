// backend/src/utils/seeder.js
const db = require('../config/database');
const crypto = require('crypto');

function seedDatabase() {
  // Check if users already exist to avoid duplicate seeding
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    console.log('Database already has users. Skipping seeding.');
    return;
  }

  console.log('Seeding database with sample data...');

  // 1. Create Users
  const users = [
    { id: crypto.randomUUID(), phone: '1111111111', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: crypto.randomUUID(), phone: '2222222222', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    { id: crypto.randomUUID(), phone: '3333333333', name: 'Charlie', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
    { id: crypto.randomUUID(), phone: '4444444444', name: 'David', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
  ];

  const insertUser = db.prepare('INSERT INTO users (id, phone_number, display_name, avatar_url) VALUES (?, ?, ?, ?)');
  users.forEach(u => insertUser.run(u.id, u.phone, u.name, u.avatar));

    // 2. Create Contacts (Everyone is contacts with Everyone)
  const insertContact = db.prepare('INSERT INTO contacts (user_id, contact_id) VALUES (?, ?)');
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (i !== j) {
        insertContact.run(users[i].id, users[j].id);
      }
    }
  }

  // 3. Create a 1-on-1 Conversation (Alice and Bob)
  const conv1Id = crypto.randomUUID();
  db.prepare('INSERT INTO conversations (id, type, created_by) VALUES (?, ?, ?)').run(conv1Id, 'direct', users[0].id);
  
  const insertParticipant = db.prepare('INSERT INTO participants (conversation_id, user_id, role) VALUES (?, ?, ?)');
  insertParticipant.run(conv1Id, users[0].id, 'admin');
  insertParticipant.run(conv1Id, users[1].id, 'member');

  // 4. Add Messages to 1-on-1 Conversation
  const insertMessage = db.prepare('INSERT INTO messages (id, conversation_id, sender_id, body, status) VALUES (?, ?, ?, ?, ?)');
  const msg1Id = crypto.randomUUID();
  const msg2Id = crypto.randomUUID();
  
  insertMessage.run(msg1Id, conv1Id, users[1].id, 'Hey Alice! How are you?', 'read');
  insertMessage.run(msg2Id, conv1Id, users[0].id, 'I am good Bob! Just working on an assignment.', 'read');

  // 5. Create a Group Conversation (Alice, Charlie, David)
  const groupConvId = crypto.randomUUID();
  db.prepare('INSERT INTO conversations (id, type, name, avatar_url, created_by) VALUES (?, ?, ?, ?, ?)')
    .run(groupConvId, 'group', 'Project Team', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Project', users[0].id);
    
  insertParticipant.run(groupConvId, users[0].id, 'admin');
  insertParticipant.run(groupConvId, users[2].id, 'member');
  insertParticipant.run(groupConvId, users[3].id, 'member');

  // 6. Add Messages to Group Conversation
  insertMessage.run(crypto.randomUUID(), groupConvId, users[0].id, 'Welcome to the group guys!', 'read');
  insertMessage.run(crypto.randomUUID(), groupConvId, users[2].id, 'Thanks Alice!', 'read');
  insertMessage.run(crypto.randomUUID(), groupConvId, users[3].id, 'Ready to start coding.', 'read');

  console.log('✅ Database seeded successfully!');
}

// Run the seeder
seedDatabase();

module.exports = seedDatabase;