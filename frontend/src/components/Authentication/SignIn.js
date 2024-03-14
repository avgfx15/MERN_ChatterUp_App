import React, { useState } from 'react';
import axios from 'axios'
import { VStack } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement, FormControl, FormLabel, Button, useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom'

const SignIn = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const history = useHistory()

    const handleClick = () => {
        setShow(!show)
    }

    const submitHandler = async () => {
        setLoading(true)

        if (!email || !password) {
            toast({
                title: 'Please fill all fields',
                description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false)
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }
            const { data } = await axios.post("/api/user/singin", { email, password }, config);
            toast({
                title: 'User Sign Up Successfully',
                description: "We've created your account for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            history.push('/chats')
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
        <VStack spacing={"0.3rem"}>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} />
                {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='Enter Your Name' onChange={(e) => setPassword(e.target.value)} value={password} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {/* <FormHelperText>We'll never share your Password.</FormHelperText> */}
            </FormControl>

            <Button colorScheme='blue' onClick={submitHandler} width={'100%'}>Sign In</Button>
            <Button colorScheme='orange' width={'100%'} isLoading={loading}
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword('aaaaaa')
                }}>Get Guest User Credentials</Button>
        </VStack>
    )

}

export default SignIn