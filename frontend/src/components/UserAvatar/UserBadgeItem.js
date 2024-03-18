import React from 'react'
import { Box } from "@chakra-ui/layout";
import { CloseButton } from '@chakra-ui/react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            padding={"2px 10px"}
            margin={"2px"}
            borderRadius={"lg"}
            marginLeft={"3px"}
            borderWidth={"1px"}
            variant={"solid"}
            cursor={"pointer"}
            backgroundColor={"purple"}
            color={"white"}
            fontSize={"1rem"}
            onClick={handleFunction}>
            {user.name}
            <CloseButton />
        </Box>
    )
}

export default UserBadgeItem