import asyncHandler from "express-async-handler";
import ChatModel from "../models/chatModel.js";
import UserModel from "../models/userModel.js"

// @ Get All chats
export const getAllChatsController = asyncHandler(async (req, res) => {
    // $ Get LoggedInUser Data
    const loggedInUser = req.user._id;
    try {

        // $ Get all Chats of loggedInUser with Others
        const chatOfLoggedInUser = await ChatModel.find({ users: loggedInUser }).populate('users', "-password").populate('latestChat').sort({ updatedAt: -1 });
        return res.status(200).json({ chatOfLoggedInUser })
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
    // $ Populate sender Data for latestChat
    isAlreadyInChat = await UserModel.populate(isAlreadyInChat, {
        path: "latestChat.sender",
        select: "name emial mobile profilePic"
    })

    // +  If not in chat, create a new chat
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
        // $ Already in chatModel just send
        res.json(isAlreadyInChat);
    }
})


// + Create Chat Group
export const createChatGroupController = asyncHandler(async (req, res) => {
    try {
        //// Get Logged User
        const loggedInUser = req.user._id;

        const { chatName } = req.body
        // # Check for Incomplete Data
        if (!chatName || !req.body.users) {
            return res.status(400).send("incomplete data")
        }

        // # Check Groupname is already Exists or not
        let existingChat = await ChatModel.findOne({ chatName })
        if (existingChat) {
            return res.status(400).json({ message: 'This group name has already been used.' })
        }
        // $ From Client side we are getting data as stringify so parse to store in Database
        var users = JSON.parse(req.body.users);
        // $ Atleast 2 Members require to Create Group
        if (users.length < 2) {
            return res.status(400).json({ message: 'More then 2 members require to Create New Group.' })
        }

        users.push(loggedInUser);  // $ add the logged user to the list of members

        // + Create new Group 
        const newGroupChat = await ChatModel.create({
            chatName,
            isGroupChat: true,
            users,
            groupAdmin: loggedInUser,
            messages: [],
        });

        const getGroupData = await ChatModel.findOne({ _id: newGroupChat._id }).populate('users', "-password").populate('groupAdmin', "-password")

        // $ send response with the newly created chat info
        return res.status(201).json(getGroupData)

    } catch (err) {
        console.error(`Error in creating chat room : ${err}`);
        return res.status(500).json({ error: err });
    }
});


// * Rename Group Name

export const renameGroupNameController = asyncHandler(async (req, res) => {
    try {
        const { newName, chatId } = req.body;
        const updateChatGroupName = await ChatModel.findByIdAndUpdate(chatId, { chatName: newName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
        if (!updateChatGroupName) {
            res.status(404);
            throw new Error("Chat Group Not Found")
        } else {
            return res.status(200).json({ updateChatGroupName })
        }
    } catch (error) {
        console.error(`Error in creating chat room : ${error}`);
        return res.status(500).json({ error: error });
    }
})

// * Remove From Group

export const removeMemberFromGroupController = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const { userId, chatId } = req.body;

        // # Only GroupAdmin can Add User

        const groupCreatedByLoggedInUser = await ChatModel.findOne({ groupAdmin: loggedInUser })
        if (!groupCreatedByLoggedInUser) {
            return res.status(400).json({ message: "Only Group can add or remove User from Group" })
        }

        // # Check User is already in the group

        let isAlreadyInGroup;
        isAlreadyInGroup = await ChatModel.findOne({
            isGroupChat: true,
            $and: [
                { users: { $elemMatch: { $eq: loggedInUser } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        if (!isAlreadyInGroup) {
            return res.status(401).json({ message: "User is not in the Group" })
        }

        const addUserInChatGroup = await ChatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
        if (!addUserInChatGroup) {
            res.status(404);
            throw new Error("Chat Group Not Found")
        } else {
            return res.status(200).json({ addUserInChatGroup })
        }
    } catch (error) {
        console.error(`Error in creating chat room : ${error}`);
        return res.status(500).json({ error: error });
    }
})

// * Add To Group

export const addMemberToGroupController = asyncHandler(async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const { userId, chatId } = req.body;

        // # Only GroupAdmin can Add User

        const groupCreatedByLoggedInUser = await ChatModel.findOne({ groupAdmin: loggedInUser })
        if (!groupCreatedByLoggedInUser) {
            return res.status(400).json({ message: "Only Group can add or remove User from Group" })
        }

        // # Check User is already in the group

        let isAlreadyInGroup;
        isAlreadyInGroup = await ChatModel.findOne({
            isGroupChat: true,
            $and: [
                { users: { $elemMatch: { $eq: loggedInUser } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
        if (isAlreadyInGroup) {
            return res.status(401).json({ message: "User already in the Group" })
        }

        const addUserInChatGroup = await ChatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
        if (!addUserInChatGroup) {
            res.status(404);
            throw new Error("Chat Group Not Found")
        } else {
            return res.status(200).json({ addUserInChatGroup })
        }
    } catch (error) {
        console.error(`Error in creating chat room : ${error}`);
        return res.status(500).json({ error: error });
    }
})