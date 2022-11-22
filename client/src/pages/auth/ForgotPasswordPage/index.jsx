import { Box, Button, Center, FormErrorMessage, Input, Text, VStack, FormControl, useToast } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { DiApple } from "react-icons/di";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import userApi from "../../../apis/userApi";

const forgotSchema = yup.object().shape({
  email: yup
    .string()
    .required('⚠ Email invalid')
    .email('⚠ Email must be a valid email'),
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    mode: 'all',
    resolver: yupResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  });

  const _onSubmit = async (data) => {
    try {
      const response = await userApi.resetPassword(data);
      toast({
        title: 'Information',
        description: 'Please check your email to verify is that you',
        status: 'info',
        duration: 3000,
        variant: 'left-accent',
        position: 'bottom-right',
        isClosable: true,
      })
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

  return (
    <Box mb={7}>
      <Text fontSize="xl" fontWeight="bold" lineHeight='3em'>Reset Password</Text>
      <Text lineHeight="1.2em" color='gray'>Reset password to continue enjoying uninterrupted video and <br /> personalised experience</Text>
      <VStack mt={7} mb={4} gap={4}>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <FormControl mb="5" isRequired isInvalid={!!errors?.email?.message} errortext={errors?.email?.message}>
            <Input {...register('email')} type='email' variant='flushed' borderColor='rgb(111, 111, 111)' focusBorderColor='rgb(176, 80, 255)' placeholder='E-mail' w='333px' />
            <Center>
              <FormErrorMessage>
                {errors?.email?.message}
              </FormErrorMessage>
            </Center>
          </FormControl>

          <Button type='submit' w='333px' h='47px' variant='outline' borderColor='rgb(111, 111, 111)' _hover="transparent" color='gray'>Reset password</Button>
          <Text fontSize='sm' color='lightgray'>Back to <span onClick={goToSignup}>login</span>?</Text>
        </form>
      </VStack>
    </Box>
  );
}

export default ForgotPasswordPage;
