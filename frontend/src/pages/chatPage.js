import React, { useEffect, useState } from 'react';
import axios from 'axios'

const ChatPage = () => {

    const [chats, setChats] = useState([]);

    const fetchChatsData = async () => {
        try {
            const { data } = await axios.get('/chats')
            setChats(data);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchChatsData()
    }, []);


    return (
        <div>
            {chats.map((chat) => (
                <p key={chat._id}>{chat.chatName}</p>
            ))}
        </div>
    )
}

export default ChatPage