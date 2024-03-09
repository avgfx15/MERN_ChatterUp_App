import React from 'react';
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import SignIn from '../components/Authentication/SignIn';
import SignUp from '../components/Authentication/SignUp'

const HomePage = () => {
    return (
        <Container maxW={"40%"} centerContent>
            <Box display={"flex"} bg={'white'} padding={"0.5rem"} justifyContent={'center'} width={"100%"} margin={"3rem 0rem 1rem 0rem"} borderRadius={"0.5rem"} borderWidth={"1px"}>
                <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"} fontWeight={"500"}> Staco-Chat</Text>
            </Box >
            <Box display={"flex"} bg={'white'} padding={"0.5rem"} justifyContent={'center'} width={"100%"} margin={"1rem 0rem 1rem 0rem"} borderRadius={"0.5rem"} borderWidth={"1px"}>
                <Tabs variant='enclosed' width={"100%"} >
                    <TabList mb={"1em"}>
                        <Tab width="50%" _selected={{ color: 'white', bg: 'blue.500' }}>Sign In</Tab>

                        <Tab width="50%" _selected={{ color: 'white', bg: 'blue.500' }}>Sign Up</Tab>

                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <SignIn />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box >
        </Container >
    )
}

export default HomePage