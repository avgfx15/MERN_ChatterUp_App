import React, { useState } from 'react';
import { VStack } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, FormHelperText, Button } from '@chakra-ui/react'

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [mobile, setMobile] = useState()
    const [profilePic, setProfilePic] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const handleClick = () => {
        setShow(!show)
    }

    const postDetails = (profilePic) => {

    }

    const submitHandler = () => {

    }
    return (
        <VStack spacing={"0.3rem"}>
            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input type='text' placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
                {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input type='email' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
                {/* <FormHelperText>We'll never share your Name.</FormHelperText> */}
            </FormControl>
            <FormControl id='first_name' isRequired>
                <FormLabel>Mobile</FormLabel>
                <Input type='text' placeholder='Enter Your Name' onChange={(e) => setMobile(e.target.value)} />
                {/* <FormHelperText>We'll never share your Moblie.</FormHelperText> */}
            </FormControl>
            <FormControl id='profilePic' isRequired>
                <FormLabel>Profile Pic</FormLabel>
                <Input type='file' placeholder='Enter Your Name' accept='Image/*' onChange={(e) => postDetails(e.target.files[0])} />
                {/* <FormHelperText>We'll never share your ProfilePic.</FormHelperText> */}
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
            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} placeholder='Enter Your Name' onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
                {/* <FormHelperText>We'll never share your Confirm Password.</FormHelperText> */}
            </FormControl>
            <Button colorScheme='blue' onClick={submitHandler} width={'100%'}>Sign Up</Button>
        </VStack>
    )

}

export default SignUp