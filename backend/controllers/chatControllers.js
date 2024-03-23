import asyncHandler from "express-async-handler";
import ChatModel from "../models/chatModel.js";
import UserModel from "../models/userModel.js"

// @ Get All chats
export const getAllChatsForLoggedInUserController = asyncHandler(async (req, res) => {

    // $ Get LoggedInUser Data
    const loggedInUser = req.user._id;
    try {

        // $ Get all Chats of loggedInUser with Others
        const allChats = await ChatModel.find({ users: { $in: req.user._id } }).populate('users', "-password").populate('groupAdmin', "-password");

        res.status(200).send(allChats);

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
    isAlreadyInChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: loggedInUser } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate('users', "-password").populate('latestChat');
    console.log(isAlreadyInChat);
    // $ Populate sender Data for latestChat
    isAlreadyInChat = await UserModel.populate(isAlreadyInChat, {
        path: "latestChat.sender",
        select: "name emial mobile profilePic"
    })

    if (isAlreadyInChat.length > 0) {
        res.send(isAlreadyInChat[0])
    } else {

        // +  If not in chat, create a new chat
        try {
            var chatData = {
                chatName: "personal-chat",
                isGroupChat: false,
                users: [loggedInUser, userId],
                groupAdmin: loggedInUser
            };
            const createdChat = await ChatModel.create(chatData)
            const findChat = await ChatModel.findOne({ _id: createdChat._id }).populate('users', "-password").populate('groupAdmin', "-password");

            res.status(200).json(findChat)
        } catch (error) {
            res.status(400);
            throw new Error(error.message)
        }
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
        console.log(getGroupData);

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
            return res.status(200).json(updateChatGroupName)
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
        const findChat = await ChatModel.findById({ _id: chatId });
        if (!findChat) {
            res.status(404);
            throw new Error("Chat Group Not Found")
        } else {
            // $ Check loggedUser is groupAdmin or not
            const isGroupAdmin = findChat.groupAdmin._id.equals(loggedInUser);
            if (!isGroupAdmin) {
                res.status(409)
                throw new Error('You are not authorized to add new user')
            } else {
                // $ Check User is in group chat or not
                const userAlreadyExists = await findChat.users.includes(userId);

                if (!userAlreadyExists) {
                    res.status(409)
                    throw new Error('User not exists in this chat')
                } else {
                    if (loggedInUser === userId) {
                        await ChatModel.findByIdAndDelete({ _id: chatId });
                        return res.status(201).json({ message: "Group admin remove group" })
                    } else {
                        const removeUserInChatGroup = await ChatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
                        return res.status(200).json(removeUserInChatGroup)
                    }
                }
            }
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
        const findChat = await ChatModel.findById({ _id: chatId });
        if (!findChat) {
            res.status(404);
            throw new Error("Chat Group Not Found")
        } else {
            // $ Check loggedUser is groupAdmin or not
            const isGroupAdmin = findChat.groupAdmin._id.equals(loggedInUser);
            if (!isGroupAdmin) {
                res.status(409)
                throw new Error('You are not authorized to add new user')
            } else {
                // $ Check User is in group chat or not
                const userAlreadyExists = await findChat.users.includes(userId);

                if (userAlreadyExists) {
                    res.status(409)
                    throw new Error('User already exists in this chat')
                } else {
                    const addUserInChatGroup = await ChatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
                    return res.status(200).json(addUserInChatGroup)
                }
            }
        }
    } catch (error) {
        console.error(`Error in creating chat room : ${error}`);
        return res.status(500).json({ error: error });
    }
})