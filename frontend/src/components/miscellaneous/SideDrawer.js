import React, { useState } from 'react';
import {
    Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider.js';
import ProfileModal from './ProfileModal.js';

const SideDrawer = () => {

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { user } = ChatState()

    return (
        <>
            <Box display={"flex"} padding={"0.5rem 0.8rem 0.5rem 0.8rem"} justifyContent={'space-between'} alignItems={"center"} width={"100%"} borderWidth={"5px"} bg={"white"}>
                <Tooltip hasArrow
                    label='Search user to chat' bg='gray.300' color='black' placement='bottom-end'>
                    <Button variant={"ghost"}>
                        <i class="fa-solid fa-magnifying-glass"></i>
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
                            <MenuItem>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >
        </>
    )
}

export default SideDrawer