import { Box, Button, FormControl, Input, Text, VStack, FormErrorMessage, Center, Image, forwardRef, AspectRatio, Container, Heading, Stack, Flex, useToast } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { motion, useAnimation } from "framer-motion";
import userApi from "../../../apis/userApi";

const registerSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('⚠ Full name invalid')
    .min(6, '⚠ Full name must be at least 6 characters')
    .max(20, '⚠ Full name must be at most 20 charaters'),
  email: yup
    .string()
    .required('⚠ Email invalid')
    .email('⚠ Email must be a valid email'),
  password: yup
    .string()
    .required('⚠ Password invalid')
    .min(6, '⚠ Password must be at least 6 characters')
    .max(17, '⚠ Password must be at most 17 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "⚠ Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  confirmPassword: yup.string()
    .required('⚠ Confirm password invalid')
    .oneOf([yup.ref('password'), null], '⚠ Passwords must match'),

});

const first = {
  rest: {
    rotate: "-15deg",
    scale: 0.95,
    x: "-50%",
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    x: "-70%",
    scale: 1.1,
    rotate: "-20deg",
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

const second = {
  rest: {
    rotate: "15deg",
    scale: 0.95,
    x: "50%",
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    x: "70%",
    scale: 1.1,
    rotate: "20deg",
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

const third = {
  rest: {
    scale: 1.1,
    filter: "grayscale(80%)",
    transition: {
      duration: 0.5,
      type: "tween",
      ease: "easeIn"
    }
  },
  hover: {
    scale: 1.3,
    filter: "grayscale(0%)",
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut"
    }
  }
};

const PreviewImage = forwardRef((props, ref) => {
  return (
    <Box
      bg="white"
      top="0"
      height="100%"
      width="100%"
      position="absolute"
      borderWidth="1px"
      borderStyle="solid"
      rounded="sm"
      borderColor="gray.400"
      as={motion.div}
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      backgroundImage={`url("https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg")`}
      {...props}
      ref={ref}
    />
  );
});

function RegisterPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState()
  const [uploadFile, setUploadFile] = useState()
  const [preview, setPreview] = useState()
  const controls = useAnimation();
  const toast = useToast();
  const startAnimation = () => controls.start("hover");
  const stopAnimation = () => controls.stop();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'all',
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const goToLogin = () => { navigate('/login') }

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  const _onSubmit = async (data) => {
    const formdata = new FormData();
    formdata.append('file', selectedFile);
    formdata.append('upload_preset', 'chat-app-basic');
    formdata.append('cloud_name', 'thangduong');
    let urlImg = ''
    console.log(data)

    try {
      const image = await fetch('https://api.cloudinary.com/v1_1/thangduong/image/upload', {
        method: 'post',
        body: formdata,
      }) //data.url.toString();

      const params = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        image: image.url.toString(),
        role: 'USER',
      }
      const response = await userApi.register(params);
      toast({
        title: 'Success',
        description: 'Check your email to confirm',
        status: 'success',
        duration: 3000,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
      })
    } catch (error) {
      console.log(error.response.data.message);
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

  return (
    <Box mb={7}>
      <Text fontSize="xl" fontWeight="bold" lineHeight='3em'>Create a new account</Text>
      <VStack gap={3} >
        <form onSubmit={handleSubmit(_onSubmit)}>
          <Center ml='4'>
            {
              !selectedFile ? (<Container my="5" ><AspectRatio width="64" ratio={1}>
                <Box
                  borderColor="gray.300"
                  borderStyle="dashed"
                  borderWidth="2px"
                  rounded="md"
                  shadow="sm"
                  role="group"
                  transition="all 150ms ease-in-out"
                  _hover={{
                    shadow: "md"
                  }}
                  as={motion.div}
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  cursor='pointer'
                >
                  <Box position="relative" height="100%" width="100%">
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height="100%"
                      width="100%"
                      display="flex"
                      flexDirection="column"
                    >
                      <Stack
                        height="100%"
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justify="center"
                        spacing="4"
                      >
                        <Box height="16" width="12" position="relative">
                          <PreviewImage
                            variants={first}
                            backgroundImage="url('https://image.shutterstock.com/image-photo/paella-traditional-classic-spanish-seafood-600w-1662253543.jpg')"
                          />
                          <PreviewImage
                            variants={second}
                            backgroundImage="url('https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2628&q=80')"
                          />
                          <PreviewImage
                            variants={third}
                            backgroundImage={`url("https://images.unsplash.com/photo-1563612116625-3012372fccce?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2480&q=80")`}
                          />
                        </Box>
                        <Stack p="8" textAlign="center" spacing="1">
                          <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                            Drop images here
                          </Heading>
                          <Text fontWeight="light">or click to upload</Text>
                        </Stack>
                      </Stack>
                    </Box>
                    <Input
                      type="file"
                      height="100%"
                      width="100%"
                      position="absolute"
                      top="0"
                      left="0"
                      opacity="0"
                      aria-hidden="true"
                      accept="image/*"
                      onDragEnter={startAnimation}
                      onDragLeave={stopAnimation}
                      onChange={onSelectFile}
                    />
                  </Box>
                </Box>
              </AspectRatio>
              </Container>) : (
                <Flex direction='column' mb='3'>
                  <Image mb='5' boxSize='200px' src={preview} alt='image' />
                  <Text cursor='pointer' onClick={() => { setSelectedFile(undefined); setPreview(undefined) }}>Clear image</Text>
                </Flex>
              )
            }
          </Center>

          <FormControl mb="5" isRequired isInvalid={!!errors?.fullName?.message} errortext={errors?.fullName?.message}>
            <Input {...register('fullName')} type='text' variant='flushed' borderColor='rgb(111, 111, 111)' focusBorderColor='rgb(176, 80, 255)' placeholder='Full name' w='333px' />
            <Center>
              <FormErrorMessage>
                {errors?.fullName?.message}
              </FormErrorMessage>
            </Center>
          </FormControl>

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

          <FormControl mb="5" isRequired isInvalid={!!errors?.confirmPassword?.message} errortext={errors?.confirmPassword?.message}>
            <Input {...register('confirmPassword')} type='text' variant='flushed' borderColor='rgb(111, 111, 111)' focusBorderColor='rgb(176, 80, 255)' placeholder='Confirm password' w='333px' />
            <Center>
              <FormErrorMessage>
                {errors?.confirmPassword?.message}
              </FormErrorMessage>
            </Center>
          </FormControl>

          <Text fontSize='sm' color='lightgray' mb='5'>
            By proceeding you agree to our <span>Terms of Service</span> & <br /><span>Privacy Policy</span>
          </Text>
          <Button disabled={!preview} type='submit' w='333px' h='47px' variant='outline' borderColor='rgb(111, 111, 111)' _hover="transparent" color='gray'>Sign up</Button>
        </form>

        <Text fontSize='sm' color='whitesmoke'>Already Registered? <span onClick={goToLogin}>Login</span></Text>
      </VStack>
    </Box>
  );
}

export default RegisterPage;
