import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import {
    Box,
    Tooltip,
    Button,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Input,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useToast,
    Spinner
} from '@chakra-ui/react';

import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks'
import { ChatState } from '../../Context/ChatProvider.js';
import ProfileModal from './ProfileModal.js';
import axios from "axios";
import ChatLoading from '../ChatLoading.js';
import UserListItem from '../UserAvatar/UserListItem.js';


//// Main Function For the Page SideDrawer Start
const SideDrawer = () => {


    // $ All State Define
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()


    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef()

    const history = useHistory()

    const { user, setSelectedChat, chats, setChats } = ChatState();

    const logOutHandler = async () => {
        localStorage.removeItem('userInfo');
        history.push('/')
    }

    // $ Search Users By Search
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please fill all fields',
                description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
            return;
        }
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?searchText=${search}`, config)

            setLoading(false);
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

    const getAllChats = async (userId) => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.post(`/api/chat`, { userId }, config)

            if (!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats])

            setSelectedChat(data)
            setLoading(false);
            onClose()
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

    return (
        <>
            <Box display={"flex"} padding={"0.5rem 0.8rem 0.5rem 0.8rem"} justifyContent={'space-between'} alignItems={"center"} width={"100%"} borderWidth={"5px"} bg={"white"}>
                <Tooltip hasArrow
                    label='Search user to chat' bg='gray.300' color='black' placement='bottom-end'>
                    <Button variant={"ghost"} ref={btnRef} colorScheme='teal' onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} padding={"0px 0.6rem"}>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"work sans"}>Staco-Chat</Text>
                <div>
                    <Menu>
                        <MenuButton padding={"2px"}>
                            <BellIcon fontSize={"2xl"} margin={"3px"} />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.profilePic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={"2px"}>Search User</DrawerHeader>

                    <DrawerBody>
                        <Box display={"flex"} paddingBottom={"3px"}>
                            <Input placeholder='Type here...' value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => getAllChats(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml={'auto'} display={"flex"} />}
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer >
        </>
    )
}

export default SideDrawer