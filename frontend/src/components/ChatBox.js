import React from 'react'
import { Box, } from "@chakra-ui/layout";
import { ChatState } from '../Context/ChatProvider';
import SingleChat from "./SingleChat"

const ChatBox = ({ refreshUserList, setRefreshUserList }) => {

    // $ Predefine State
    const { selectedChat } = ChatState()

    return (
        <Box display={{ base: selectedChat ? "flex" : "none", md: "flex" }} flexDirection={"column"}
            alignItems={"center"}
            height={"100%"}
            padding={"3px"}
            bg={"white"}
            width={{ base: "100%", md: "68%" }}
            borderRadius={"lg"}
            marginLeft={"3px"}
            borderWidth={"1px"}>
            <SingleChat refreshUserList={refreshUserList} setRefreshUserList={setRefreshUserList} />
        </Box>
    )
}

export default ChatBox