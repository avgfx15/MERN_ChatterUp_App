import React, { useEffect, useState } from 'react'
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { getSender } from "./config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ refreshUserList }) => {

    const [loggedUser, setLoggedUser] = useState()

    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast();


    //// Fetch Chats

    const getAllChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get('/api/chat', config)

            setChats(data)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            // setLoading(false)
        }
    }

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        getAllChats()
    }, [])

    return (
        <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDirection={"column"}
            alignItems={"center"}
            padding={"3px"}
            bg={"white"}
            width={{ base: "100%", md: "31%" }}
            borderRadius={"lg"}
            marginLeft={"3px"}
            borderWidth={"1px"}>
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily={"Work sans"}
                display={"flex"}
                width={"100%"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        // display={"flex"}
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display={"flex"}
                flexDirection={"column"}
                padding={"3px"}
                bg={"#F8F8F8"}
                width={"100%"}
                height={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                {chats ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box >
    )
}

export default MyChats