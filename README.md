Secure Messaging Platform (Signal Clone)

A functional clone of the Signal messaging application built as a full-stack assignment. It replicates Signal's clean, privacy-focused UI/UX and core messaging workflows, including real-time one-on-one and group messaging.

Note: Real phone verification and end-to-end cryptographic key exchange are mocked/simulated as per the assignment requirements.
Tech Stack

Frontend:

    React.js (Vite)
    Tailwind CSS (Custom Signal theme)
    React Router DOM
    Socket.io Client
    Axios
    Lucide React (Icons)

Backend:

    Node.js
    Express.js
    Socket.io
    better-sqlite3 (SQLite driver)
    JSON Web Tokens (JWT) for authentication
    bcryptjs for password hashing

Features

    Authentication: Mocked OTP login/registration flow (123456). Profile setup with display name and avatar.
    Real-time Messaging: Instant message sending and receiving via WebSockets.
    Message Statuses: Visual indicators for sending (clock), sent (single tick), delivered (double tick), and read (blue double tick).
    Typing Indicators: Real-time "typing..." UI feedback.
    Contacts & Search: Search for users by name or phone number to start new chats. Auto-adds users to contacts upon 1-on-1 chat creation.
    Group Messaging: Create groups, view group info, and manage members (Admin controls: add/remove members).
    Responsive Design: Two-pane layout on desktop, single-pane navigation on mobile.
    Settings UI: Placeholders for privacy, notifications, appearance, and linked devices.

Architecture Overview

The application follows a Client-Server architecture with persistent WebSocket connections for real-time event routing.

    Client (React): Manages UI state and user sessions. Uses SocketContext to maintain a single WebSocket connection globally, and ChatContext to manage conversation lists, active messages, and typing indicators. Optimistic UI updates are used for message sending.
    Server (Node/Express): Exposes REST APIs for authentication, user search, contact management, and fetching conversation histories.
    Real-time Layer (Socket.io): Authenticates connections via JWT. Handles join_conversation, send_message, typing, and message_status_update events. Messages are persisted to SQLite before being broadcast to the appropriate room.
    Database (SQLite): A lightweight, file-based relational database storing users, contacts, conversations, participants, messages, and receipts.

Database Schema

The SQLite database consists of the following tables:

    users: id (UUID, PK), phone_number (Unique), display_name, avatar_url, password_hash, about, last_seen, created_at
    contacts: user_id (FK), contact_id (FK) -> Composite PK
    conversations: id (UUID, PK), type ('direct' | 'group'), name, avatar_url, created_by (FK), created_at
    participants: conversation_id (FK), user_id (FK), role ('admin' | 'member'), joined_at -> Composite PK
    messages: id (UUID, PK), conversation_id (FK), sender_id (FK), body (Text), type ('text'), status ('sending' | 'sent' | 'delivered' | 'read'), created_at
    message_receipts: message_id (FK), user_id (FK), status ('delivered' | 'read'), timestamp -> Composite PK

API Overview
REST Endpoints

Auth (/api/auth)

    POST /request-otp: Request an OTP (mocked).
    POST /verify-otp: Verify OTP. Returns JWT if user exists, or prompts registration.
    POST /register: Create a new user and return JWT.
    GET /me: Get current authenticated user details.

Users (/api/users)

    GET /search?query=: Search users by phone number or name.
    GET /contacts: Get current user's contact list.
    POST /contacts: Add a user to contacts.
    PUT /profile: Update display name, avatar, and about status.

Conversations (/api/conversations)

    GET /: Get all conversations for the current user with last message previews.
    POST /direct: Create or fetch a 1-on-1 conversation.
    POST /group: Create a new group conversation.
    GET /:id/messages: Get all messages for a specific conversation.
    GET /:id/participants: Get all members of a conversation.
    POST /:id/participants: Add a member to a group (Admin only).
    DELETE /:id/participants/:userId: Remove a member from a group (Admin only).

Socket Events

    join_conversation: Join a specific chat room.
    leave_conversation: Leave a chat room.
    send_message: Broadcast a new message to a room.
    receive_message: Listen for incoming messages.
    typing / stop_typing: Broadcast typing status.
    message_delivered: Update message status to delivered.
    message_read: Update message status to read.
    message_status_update: Listen for status changes on sent messages.

Setup and Installation
Prerequisites

    Node.js (LTS version v20.x or v22.x recommended)
    npm

1. Clone the repository

git clone <your-repo-link>cd signal-clone

2. Backend Setup
bash
 
  
 
 
cd backend
npm install

# Create a .env file in the backend folder with the following:
# PORT=5000
# JWT_SECRET=super_secret_signal_clone_jwt_key_12345
# CLIENT_URL=http://localhost:5173

# Seed the database with sample users (Alice, Bob, Charlie, David) and chats
node src/utils/seeder.js

# Start the backend server
npm run dev
 
 

The backend will be running on http://localhost:5000.
3. Frontend Setup

Open a new terminal window:
bash
 
  
 
 
cd frontend
npm install

# Start the frontend development server
npm run dev
 
 

The frontend will be running on http://localhost:5173.
4. Test the Application

    Open http://localhost:5173 in your browser.
    Log in using one of the seeded phone numbers (e.g., 1111111111 for Alice).
    Enter OTP: 123456.
    Open a second browser (or incognito window) and log in as Bob (2222222222, OTP 123456) to test real-time messaging.

Assumptions Made

     OTP: A fixed OTP (123456) is used for all phone numbers to simulate verification.
     Encryption: End-to-end encryption is visually mocked (e.g., lock icons in the UI) but not cryptographically implemented.
     Contacts: When a user starts a new 1-on-1 chat with someone, they are automatically added to each other's contacts list to streamline the group creation process.
     Message Receipts: Delivery and read receipts are updated in real-time via socket events. If a user is offline, messages are saved to the database with a 'sent' status and updated when they reconnect and open the chat.