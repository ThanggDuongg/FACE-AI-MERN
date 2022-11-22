import React from 'react';
import PropTypes from 'prop-types';
import { Container, Heading, Text, Button, Stack, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

NotFound.propTypes = {

};

function NotFound(props) {
  const navigate = useNavigate();

  return (
    <Container
      maxW={'container.xl'}
    // marginTop={'52'}
    // marginBottom={'52'}
    >
      <Box
        marginBottom={'30px'}
      >
        <Heading
          as={'h1'}
          size='4xl'
          fontWeight={'700'}
          fontSize={'100px'}
          textAlign={'center'}
          lineHeight={'1.1'}
          marginBottom={'3'}
        >
          404
        </Heading>
        <Text
          fontSize='4xl'
          textAlign={'center'}
          fontWeight={'medium'}
        >
          Nothing found
        </Text>
      </Box>

      <Stack
        direction='row'
        align='center'
        justify={'center'}
        spacing='10'
      >
        <Button
          backgroundColor={'#D61C62'}
          textColor='white'
          size='lg'
          borderRadius={'3xl'}
          paddingX={'14'}
          paddingY={'1.5'}
          fontWeight='bold'
          _hover={{
            backgroundColor: '#018AE0'
          }}

          onClick={() => { navigate('/login') }}
        >
          BACK TO HOME PAGE
        </Button>
        <Button
          backgroundColor={'#018AE0'}
          textColor='white'
          size='lg'
          borderRadius={'3xl'}
          paddingX={'14'}
          paddingY={'1.5'}
          fontWeight='bold'
          _hover={{
            backgroundColor: 'blue.600'
          }}
        >
          CONTACT US
        </Button>
      </Stack>
    </Container >
  );
}

export default NotFound;
