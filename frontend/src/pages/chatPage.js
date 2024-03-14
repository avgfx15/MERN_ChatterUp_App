import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider.js';
import SideDrawer from '../components/miscellaneous/SideDrawer.js';
import MyChats from '../components/miscellaneous/MyChats.js';
import ChatBox from '../components/miscellaneous/ChatBox.js';

const ChatPage = () => {

    const { user } = ChatState()


    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display={"flex"} padding={"0.5rem"} justifyContent={'space-around'} width={"100%"} height={"91.5vh"} >
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div >
    )
}

export default ChatPage