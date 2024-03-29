import React, { useState } from 'react';
import { Box } from '@chakra-ui/react'

import { ChatState } from '../Context/ChatProvider.js';
import SideDrawer from '../components/miscellaneous/SideDrawer.js';
import MyChats from '../components/MyChats.js';
import ChatBox from '../components/ChatBox.js';

const ChatPage = () => {

    const { user } = ChatState()
    const [refreshUserList, setRefreshUserList] = useState([])

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display={"flex"} padding={"0.5rem"} justifyContent={'space-around'} width={"100%"} height={"91.5vh"} >
                {user && <MyChats refreshUserList={refreshUserList} />}
                {user && <ChatBox refreshUserList={refreshUserList} setRefreshUserList={setRefreshUserList} />}
            </Box>
        </div >
    )
}

export default ChatPage