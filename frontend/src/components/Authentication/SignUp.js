import React, { useState } from 'react';
import { VStack } from '@chakra-ui/layout';
import { Input, InputGroup, InputRightElement, FormControl, FormLabel, Button, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [mobile, setMobile] = useState()
    const [profilePic, setProfilePic] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory();
    const toast = useToast()

    const handleClick = () => {
        setShow(!show)
    }

    const postDetails = (profilePic) => {
        setLoading(true);
        if (profilePic === undefined) {
            toast({
                title: 'Please Select an image',
                description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        if (profilePic.type === 'image/jpeg' || profilePic.type === 'image/png' || profilePic.type === 'image/jpg') {
            const data = new FormData();
            data.append('file', profilePic);
            data.append('upload_preset', "Chatter_App_With_MERN");
            data.append('cloud_name', 'dchku0azw');
            fetch("https://api.cloudinary.com/v1_1/dchku0azw/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json()).then((data) => {
                setProfilePic(data.url.toString());
                setLoading(false)
            }).catch((err) => {
                console.log(err);;
                setLoading(false)
            })
        } else {
            toast({
                title: 'Please Select an image',
                description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false)
        }
    }

    const submitHandler = async () => {
        setLoading(true)

        if (!name || !email || !mobile || !profilePic || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            toast({
                title: 'Password and Confirm Password are not matched',
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
            const { data } = await axios.post("/api/user/singup", { name, email, mobile, profilePic, password }, config);
            toast({
                title: 'User Sign Up Successfully',
                description: "We've created your account for you.",
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            localStorage.setItem('userinfo', JSON.stringify(data));
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
            <FormControl id='mobile' isRequired>
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
            <Button colorScheme='blue' onClick={submitHandler} width={'100%'} isLoading={loading}>Sign Up</Button>
        </VStack>
    )

}

export default SignUp