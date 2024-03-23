import React from 'react';
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import { Tooltip, Avatar } from '@chakra-ui/react'

const ScrollableChats = ({ messages }) => {


    const { user } = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((message, index) => (
                <div key={message._id} style={{ display: "flex", marginBottom: "0.5rem" }} >
                    {
                        (isSameSender(messages, message, index, user._id) || isLastMessage(messages, index)) && (
                            <Tooltip
                                label={message.sender.name} placement={"bottom-start"} hasArrow>
                                <Avatar
                                    mr={2}
                                    size="sm"
                                    cursor="pointer"
                                    name={message.sender.name}
                                    src={message.sender.profilePic}
                                />
                            </Tooltip>
                        )
                    }

                    <span style={{
                        backgroundColor: `${message.sender._id === user._id ? "#bee3f8" : "#b9f5d0"}`,
                        borderRadius: '1rem',
                        padding: "0.5rem 0.8rem",
                        maxWidth: "75%",
                        marginLeft: isSameSenderMargin(messages, message, index, user._id),
                        marginTop: isSameUser(messages, message, index, user._id) ? 3 : 10
                    }}>
                        {message.content}
                    </span>
                </div>))
            }
        </ScrollableFeed >
    )
}

export default ScrollableChats