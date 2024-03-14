import React from 'react'
import { Box, } from "@chakra-ui/layout";

const ChatBox = () => {
    return (
        <Box display={"flex"} flexDirection={"column"}
            alignItems={"center"}
            padding={"3px"}
            bg={"white"}
            width={{ base: "100%", md: "100%" }}
            borderRadius={"lg"}
            marginLeft={"3px"}
            borderWidth={"1px"}>
            <div>Chat Box</div>
        </Box>
    )
}

export default ChatBox