/* eslint-disable no-undef */
import { Box, Button, FormControl, Input, Text, VStack, FormErrorMessage, Center, Image, forwardRef, AspectRatio, Container, Heading, Stack, Flex, useToast } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { handleError } from "../../../utils";

export const RegisterFacePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state)
  const buttonRef = useRef();
  let faceioInstance = null;

  useEffect(() => {
    const faceIoScript = document.createElement('script')
    faceIoScript.src = '//cdn.faceio.net/fio.js'
    faceIoScript.async = true
    faceIoScript.onload = () => faceIoScriptLoaded()
    document.body.appendChild(faceIoScript)

    // auto click
    buttonRef.current.click();

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

  const faceRegistration = async () => {
    try {
      const userInfo = await faceioInstance.enroll({
        locale: "auto",
        payload: {
          accessToken: state.accessToken,
          email: state.email,
          fullname: state.fullname,
          id: state.id,
          image: state.image,
          refreshToken: state.refreshToken,
          role: state.role
        },
      })
      console.log(userInfo)
    } catch (errorCode) {
      console.log(errorCode)
      handleError(errorCode)
    }
  }

  const goToLogin = () => { navigate('/login') }

  return (
    <Box mb={7}>
      <Text fontSize="xl" fontWeight="bold" lineHeight='3em'>Register your face </Text>
      <VStack gap={3} >
        <Button ref={buttonRef} onClick={() => { faceRegistration() }} disabled={false} type="button" w='333px' h='47px' variant='outline' borderColor='rgb(111, 111, 111)' _hover="transparent" color='gray'>Register face to complete progress register</Button>
        <Text fontSize='sm' color='whitesmoke'>Already Registered? <span onClick={goToLogin}>Login</span></Text>
      </VStack>
    </Box>
  )
}
