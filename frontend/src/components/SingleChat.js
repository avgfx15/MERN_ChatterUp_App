import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider'
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, Input, FormControl, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';

import ScrollableChats from "./ScrollableChats.js"
import io from "socket.io-client"


// ? Import custom Styling Css
import './messagesStyle.css'

const ENDPOINT = "http://localhost:5200";
var socket, selectedChatCompare;

// #  Main Function Class

const SingleChat = ({ refreshUserList, setRefreshUserList }) => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    // $ Pre define ChatState
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const toast = useToast();

    // $ Fetch All Messages with chatId

    const getAllChatWithChatId = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data);
            setLoading(false)

            socket.emit('joinChat : - ', selectedChat._id)
        } catch (error) {
            toast({
                title: 'Error To Fetch Messages For This Chat!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        }

    }

    // $  Send Message 
    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {

            socket.emit('stopTyping', selectedChat._id)

            try {
                setNewMessage(" ")
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post("api/message", {
                    content: newMessage,
                    chatId: selectedChat
                }, config);

                socket.emit("newMessage", data)
                setMessages([...messages, data])

            } catch (error) {
                toast({
                    title: 'Error Sending Message!',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom'
                });
                setLoading(false)
            }
        }
    }



    // # Socket Connection
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on('connected', () => {
            setSocketConnected(true)
        })
        socket.on("typing", async () => setIsTyping(true));
        socket.on("stopTyping", async () => setIsTyping(false));

    }, [])


    // $ Loading All Message By ChatId With User

    useEffect(() => {
        getAllChatWithChatId();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    console.log(notification);

    // $ Received New Message

    useEffect(() => {
        socket.on('messageReceived', async (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                /// $ Give Notification
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setRefreshUserList(!refreshUserList);
                }
            } else {
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    // $ Typing Handler Function
    const typingHandler = async (e) => {
        setNewMessage(e.target.value);

        // % Typing Indicator

        if (!socketConnected) {
            return;
        }

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var currentTime = new Date().getTime();
            var timeDifference = currentTime - lastTypingTime;

            if (timeDifference >= timerLength && typing) {
                socket.emit('stopTyping', selectedChat._id)
                setTyping(false)
            }
        }, timerLength);
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        display={"flex"}
                        justifyContent={{ base: "space-between" }}
                        width={"100%"}
                        alignItems={"center"} fontFamily={"work sans"} fontSize={"1.1rem"} margin={"0.3rem"} padding={"0.2rem"} >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")} />
                        {!selectedChat.isGroupChat ?
                            (<>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModel
                                        getAllChatWithChatId={getAllChatWithChatId}
                                        refreshUserList={refreshUserList}
                                        setRefreshUserList={setRefreshUserList} />
                                </>
                            )}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"flex-end"}
                        bg={"#e8e8e8"}
                        width={"100%"}
                        height={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                        padding={"0.3rem"}
                    >
                        {loading ? (
                            <Spinner
                                size={"xl"}
                                width={"3rem"}
                                height={"3rem"}
                                alignSelf={"center"}
                                margin={"auto"} />
                        ) : (
                            <div className='messages'>
                                <ScrollableChats messages={messages} />
                            </div>
                        )}
                        <FormControl id='message' isRequired onKeyDown={sendMessage}>
                            {/* <FormLabel>Email</FormLabel> */}

                            {isTyping ? (<div>Loading...</div>) : (<></>)}
                            <Input
                                type='text' placeholder='Enter Your Message Text' onChange={typingHandler} variant={"filled"} bg={"#e0e0e0"} value={newMessage} />
                            {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
                        </FormControl>
                    </Box>
                </>) : (
                <Box height={"100%"} display={"flex"} justifyContent={"center"} alignContent={"center"}>
                    <Text fontSize={"1.5rem"} fontFamily={"work sans"} color={"purple"}>
                        Click on a User to Start Chat
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat