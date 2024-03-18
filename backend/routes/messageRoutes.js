import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAllMessagesController, sendMessageController } from "../controllers/mesageControllers.js";

const messageRoutes = express.Router();


// + Post Chat
messageRoutes.post("/", authMiddleware, sendMessageController)

// @ GET Messages By chatId
messageRoutes.get("/:chatId", authMiddleware, getAllMessagesController)



export default messageRoutes;