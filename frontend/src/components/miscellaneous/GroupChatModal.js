import React, { useState } from 'react';
import axios from 'axios'
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    FormControl,
    FormLabel,
    Input,
    Spinner
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks'
import { ChatState } from '../../Context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

// # Main Function
const GroupChatModal = ({ children }) => {

    //  $ All State
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    // $ Pre define State
    const { user, chats, setChats } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure()

    // $ Toast From Chakra-ui
    const toast = useToast();

    // # Handle Search For User Set user in SetSearcResult
    const handleSearch = async (query) => {
        setSearch(query)

        try {
            if (!query) {
                return;
            }
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?searchText=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        }
    }

    // # After Search Users and To add setSearchResult To Submit To Database

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Please fill all field or Select members.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    chatName: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats])
            onClose()
            toast({
                title: `Group Chat Created Successfully`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        }
    }

    const handleGroupMember = async (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User already  added.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDeleteMember = async (deleteUser) => {
        setSelectedUsers(selectedUsers.filter(selUser => selUser._id !== deleteUser._id));
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={"flex"} fontFamily={"work sans"} justifyContent={"center"} fontSize={"2rem"}>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
                        <FormControl id='email' isRequired>
                            <FormLabel>Group Name</FormLabel>
                            <Input type='text' placeholder='Enter Group Chat Name' onChange={(e) => setGroupChatName(e.target.value)} />
                            {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
                        </FormControl>
                        <FormControl id='email' isRequired marginBottom={"5px"}>
                            <FormLabel>Add Members</FormLabel>
                            <Input type='text' placeholder='Enter Group Chat Name' onChange={(e) => handleSearch(e.target.value)} />
                            {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
                        </FormControl>

                        {selectedUsers.map((user) => (<UserBadgeItem key={user._id} user={user} handleFunction={() => handleDeleteMember(user)} />))}
                        {loading ? <Spinner /> : (
                            searchResult?.map((user) => (<UserListItem key={user._id} user={user} handleFunction={() => handleGroupMember(user)} />))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='orange' onClick={handleSubmit}>
                            Create Chat Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal