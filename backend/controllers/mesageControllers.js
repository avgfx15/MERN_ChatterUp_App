import asyncHandler from "express-async-handler";
import MessageModel from '../models/messageModel.js'
import UserModel from "../models/userModel.js";
import ChatModel from "../models/chatModel.js";

export const sendMessageController = asyncHandler(async (req, res) => {

    const loggedUser = req.user._id;
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        res.status(400)
        throw new Error("Please fill required data")
    }

    const newMessage = {
        sender: loggedUser,
        content: content,
        chat: chatId
    }

    try {
        let newChat = await MessageModel.create(newMessage);
        newChat = await newChat.populate("sender", "-password")
        newChat = await newChat.populate("chat")
        newChat = await UserModel.populate(newChat, {
            path: "chat.users",
            select: "-password",
        })

        await ChatModel.findByIdAndUpdate(chatId, {
            latestChat: newChat
        }, { new: true });
        res.status(201).json(newChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})


export const getAllMessagesController = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        const findChat = await MessageModel.find({ chat: chatId }).populate("sender", "-password").populate("chat");
        res.status(201).json(findChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
}