import React from 'react';
import { useDisclosure } from '@chakra-ui/hooks'
import {
    Text,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, IconButton
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? <span onClick={onOpen}>{children} </span> : (<IconButton display={'flex'} icon={<ViewIcon />} onClick={onOpen}></IconButton>)}

            <Modal isOpen={isOpen} onClose={onClose} size={"lg"} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize={"2rem"} display={"flex"} justifyContent={'center'} fontFamily={'work sans'}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDirection={"column"} justifyContent={'space-between'} alignItems={"center"}>
                        <Image src={user.profilePic} alt={user.name} boxSize={'150px'} borderRadius={"full"} />
                        <Text fontSize={{ base: "2rem", md: "2.5rem" }} fontFamily={"work sans"}>{user.email}</Text>
                        <Text fontSize={{ base: "1.5rem", md: "2rem" }} fontFamily={"work sans"}>{user.mobile}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal