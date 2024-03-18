import React, { useState } from 'react'
import axios from 'axios'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    FormLabel
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

// # Main Function 

const UpdateGroupChatModel = ({ refreshUserList, setRefreshUserList }) => {

    // % State Define

    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)


    // $ Chakra-ui Module
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    // $ Pre define State

    const { user, selectedChat, setSelectedChat } = ChatState();

    // # Handle Remove User 
    const handleLeaveGroup = async () => {

    }

    const handleRename = async () => {
        if (!groupChatName) {
            return
        }
        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put("/api/chat/rename",
                { chatId: selectedChat._id, newName: groupChatName },
                config);
            setSelectedChat(data);
            setRefreshUserList(!refreshUserList)
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setRenameLoading(false)
        }
        setGroupChatName('')
    }

    const handleSearch = async () => {

    }

    return (
        <>
            <IconButton
                display={"flex"}
                icon={<ViewIcon />}
                onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            display={"flex"} flexWrap={"wrap"} width={"100%"} padding={"0.3rem"}>
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem key={user._id}
                                    user={user}
                                    handleFunction={() => handleLeaveGroup(user)}
                                />
                            ))}
                        </Box>
                        <FormControl id='name' isRequired marginBottom={"0.3rem"}>
                            <FormLabel>Change Group Name</FormLabel>
                            <Input type='text' placeholder='Chat Name' onChange={(e) => setGroupChatName(e.target.value)} />
                            {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
                        </FormControl>
                        <Button variant={"solid"} colorScheme={"teal"} isLoading={renameLoading} onClick={handleRename}>
                            Update
                        </Button>
                        <FormControl id='name' isRequired marginTop={"0.3rem"}>
                            <FormLabel>Add New Menmber</FormLabel>
                            <Input type='text' placeholder='Add New User' onChange={(e) => handleSearch(e.target.value)} />
                            {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleLeaveGroup(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModel