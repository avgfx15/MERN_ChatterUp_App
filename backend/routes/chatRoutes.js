import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { ceateChatController, getAllChatsController, createChatGroupController, renameGroupNameController, removeMemberFromGroupController, addMemberToGroupController } from '../controllers/chatControllers.js';

const chatRoutes = express.Router();

// + Access Chat
chatRoutes.post('/', authMiddleware, ceateChatController)

// @ Get All Chats
chatRoutes.get('/', authMiddleware, getAllChatsController)

// + Create Chat Group
chatRoutes.post('/group', authMiddleware, createChatGroupController)

// * Rename Group Name
chatRoutes.put('/rename', authMiddleware, renameGroupNameController)

// * Remove Member From Group
chatRoutes.put('/removemember', authMiddleware, removeMemberFromGroupController)

// * Add Member ToGroup
chatRoutes.put('/addmember', authMiddleware, addMemberToGroupController)


export default chatRoutes;