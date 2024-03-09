import React, { useState } from 'react';
import { VStack } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, FormHelperText, Button } from '@chakra-ui/react'

const SignIn = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()


    const handleClick = () => {
        setShow(!show)
    }

    const submitHandler = () => {

    }
    return (
        <VStack spacing={"0.3rem"}>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
                {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
            </FormControl>

            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='Enter Your Name' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {/* <FormHelperText>We'll never share your Password.</FormHelperText> */}
            </FormControl>

            <Button colorScheme='blue' onClick={submitHandler} width={'100%'}>Sign In</Button>
            <Button colorScheme='orange' width={'100%'}
                onClick={() => {
                    setEmail("guest@gmail.com");
                    setPassword('aaaaaa')
                }}>Get Guest User Credentials</Button>
        </VStack>
    )

}

export default SignIn