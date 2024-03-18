import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel';

const SingleChat = ({ refreshUserList, setRefreshUserList }) => {
    // $ Pre define ChatState
    const { user, selectedChat, setSelectedChat } = ChatState()

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
                        {/* {Message Here } */}
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