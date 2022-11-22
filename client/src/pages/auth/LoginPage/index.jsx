/* eslint-disable no-undef */
import { Box, Button, Flex, HStack, Input, Text, VStack, FormControl, Center, FormErrorMessage, useToast, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { DiApple } from "react-icons/di";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import userApi from "../../../apis/userApi";
import Cookies from 'universal-cookie';
import { useDispatch } from 'react-redux'
import { login } from "../../../app/userSlice";
import { loginstatus } from "../../../app/statusLoginSlice";
import { handleError } from "../../../utils";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('⚠ Email invalid')
    .email('⚠ Email must be a valid email'),
  password: yup
    .string()
    .required('⚠ Password invalid'),
});

const cookies = new Cookies();
const current = new Date();
const nextYear = new Date();
nextYear.setFullYear(current.getFullYear() + 1);

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    mode: 'all',
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  let faceioInstance = null

  useEffect(() => {
    const faceIoScript = document.createElement('script')
    faceIoScript.src = '//cdn.faceio.net/fio.js'
    faceIoScript.async = true
    faceIoScript.onload = () => faceIoScriptLoaded()
    document.body.appendChild(faceIoScript)

    return () => {
      document.body.removeChild(faceIoScript)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const faceIoScriptLoaded = () => {
    console.log(faceIO)
    if (faceIO && !faceioInstance) {
      faceioInstance = new faceIO('fioa73ec')
    }
  }

  useEffect(() => {
    // console.log(searchParams.get('alert'))
    if (searchParams.get('alert')) {
      toast({
        title: 'Success',
        description: searchParams.get('alert'),
        status: 'success',
        duration: 3000,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
      })
    }
  }, [searchParams])

  const _onSubmit = async (data) => {
    try {
      const response = await userApi.login(data);
      console.log(response)
      dispatch(login({ accessToken: response.data.data.accessToken, refreshToken: response.data.data.refreshToken }))
      dispatch(loginstatus());
      cookies.set("accessToken", response.data.data.accessToken, {
        path: '/',
        expires: nextYear,
      });
      cookies.set("role", response.data.data.role, {
        path: '/',
        expires: nextYear,
      });
      localStorage.setItem('refreshToken', response.data.data.refreshToken)
      localStorage.setItem('email', response.data.data.email)
      localStorage.setItem('fullname', response.data.data.fullName)
      localStorage.setItem('image', response.data.data.image)
      localStorage.setItem('id', response.data.data._id)
      navigate('/home')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        status: 'error',
        duration: 3000,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
      })
    }
  }

  const goToSignup = () => { navigate('/register') }

  const faceLogin = async () => {
    try {
      console.log(faceioInstance)
      const userData = await faceioInstance.authenticate({
        locale: "auto",
      })
      console.log('Unique Facial ID: ', userData.facialId)
      console.log('PayLoad: ', userData.payload)
      const response = await userApi.refreshToken({ token: userData.payload.refreshToken })
      console.log('response: ', response);
      dispatch(login({ accessToken: response.data.accessToken, refreshToken: userData.payload.refreshToken }))
      dispatch(loginstatus());
      cookies.set("accessToken", response.data.accessToken, {
        path: '/',
        expires: nextYear,
      });
      cookies.set("role", userData.payload.role, {
        path: '/',
        expires: nextYear,
      });
      localStorage.setItem('refreshToken', userData.payload.refreshToken)
      localStorage.setItem('email', userData.payload.email)
      localStorage.setItem('fullname', userData.payload.fullname)
      localStorage.setItem('image', userData.payload.image)
      localStorage.setItem('id', userData.payload.id)
      navigate('/home')
    } catch (errorCode) {
      console.log(errorCode)
      handleError(errorCode)
    }
  }

  return (
    <Box mb={7}>
      <Text fontSize="xl" fontWeight="bold" lineHeight='3em'>Login to Lumiere </Text>
      <Text lineHeight="1.2em" color='gray'>Login to continue enjoying uninterrupted video and <br /> personalised experience</Text>
      <VStack gap={7} mt={7} mb={4}>
        <HStack gap={4}>
          <Flex h='44px' w='44px' borderRadius='50%' bg='whitesmoke' align='center' justify='center' cursor='pointer'>
            <DiApple style={{ color: 'black', fontSize: '1.7rem' }} />
          </Flex>
          <Flex h='44px' w='44px' borderRadius='50%' bg='whitesmoke' align='center' justify='center' cursor='pointer'>
            <FcGoogle style={{ fontSize: '1.4rem' }} />
          </Flex>
          <Flex h='44px' w='44px' borderRadius='50%' bg='dodgerblue' align='center' justify='center' cursor='pointer'>
            <FaFacebookF style={{ fontSize: '1.4rem' }} />
          </Flex>
          <Flex h='44px' w='44px' borderRadius='50%' bg='blue.500' align='center' justify='center' cursor='pointer'>
            <FaTwitter style={{ fontSize: '1.2rem' }} />
          </Flex>
        </HStack>
        <Button bg='rgb(69, 9, 71)' _hover='rgb(69, 9, 71)' borderRadius={100} h='44px' w='44px' fontWeight='bold' pb={1}>or</Button>
      </VStack>
      <VStack gap={4}>
        <Tabs isFitted variant='enclosed'>
          <TabList mb='1em'>
            <Tab>Login Normal</Tab>
            <Tab>Login Face</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={handleSubmit(_onSubmit)} >
                <VStack gap={4}>
                  <FormControl mb="5" isRequired isInvalid={!!errors?.email?.message} errortext={errors?.email?.message}>
                    <Input {...register('email')} type='email' variant='flushed' borderColor='rgb(111, 111, 111)' focusBorderColor='rgb(176, 80, 255)' placeholder='E-mail' w='333px' />
                    <Center>
                      <FormErrorMessage>
                        {errors?.email?.message}
                      </FormErrorMessage>
                    </Center>
                  </FormControl>

                  <FormControl mb="5" isRequired isInvalid={!!errors?.password?.message} errortext={errors?.password?.message}>
                    <Input {...register('password')} type='text' variant='flushed' borderColor='rgb(111, 111, 111)' focusBorderColor='rgb(176, 80, 255)' placeholder='Password' w='333px' />
                    <Center>
                      <FormErrorMessage>
                        {errors?.password?.message}
                      </FormErrorMessage>
                    </Center>
                  </FormControl>
                  <Text fontSize='sm' color='rgb(176, 80, 255)' cursor='pointer' onClick={() => { navigate('/forgot-password') }}>Forgot Password?</Text>
                  <Button type='submit' w='333px' h='47px' variant='outline' borderColor='rgb(111, 111, 111)' _hover="transparent" color='gray'>Login</Button>
                  <Text fontSize='sm' color='lightgray'>New to Lumiere? <span onClick={goToSignup}>Register</span></Text>
                </VStack>
              </form>
            </TabPanel>
            <TabPanel>
              <VStack gap={4} w='full'>
                <Button onClick={faceLogin} type='button' w='333px' h='47px' variant='outline' borderColor='rgb(111, 111, 111)' _hover="transparent" color='gray'>
                  Login with Face
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box >
  );
}

export default Login;
