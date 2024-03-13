import asyncHandler from "express-async-handler";
import ChatModel from "../models/chatModel.js";
import UserModel from "../models/userModel.js"

// @ Get All chats
export const getAllChatsController = asyncHandler(async (req, res) => {
    const loggedInUser = req.user._id;
    try {
        const chatOfLoggedInUser = await ChatModel.find({ users: loggedInUser }).populate('users', "-password").populate('latestChat').sort({ updatedAt: -1 });
        res.status(200).json({ chatOfLoggedInUser })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

// + Access Chats
export const ceateChatController = asyncHandler(async (req, res) => {



    //// Get Logged User
    const loggedInUser = req.user._id;

    //// Check if user is already in chat 
    const { userId } = req.body;

    //// Find if user is already in chat with loggedInUser
    let isAlreadyInChat;
    isAlreadyInChat = await ChatModel.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: loggedInUser } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate('users', "-password").populate('latestChat');

    isAlreadyInChat = await UserModel.populate(isAlreadyInChat, {
        path: "latestChat.sender",
        select: "name emial mobile profilePic"
    })

    //// If not in chat, create a new chat
    if (!isAlreadyInChat) {
        isAlreadyInChat = await ChatModel.create({
            chatName: "personal-chat",
            isGroupChat: false,
            users: [loggedInUser, userId],
        });
        try {
            const createdChat = await isAlreadyInChat.save();
            const findChat = await ChatModel.findOne({ _id: createdChat._id }).populate('users', "-password");

            res.status(200).json({ findChat })
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
    } else {
        res.json(isAlreadyInChat);
    }
})


// + Create Chat Group
export const createChatGroupController = asyncHandler(async (req, res) => {
    try {

    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})

// * Rename Group Name

export const renameGroupNameController = asyncHandler(async (req, res) => {

})

// * Remove From Group

export const removeMemberFromGroupController = asyncHandler(async (req, res) => {

})

// * Add To Group

export const addMemberToGroupController = asyncHandler(async (req, res) => {

})