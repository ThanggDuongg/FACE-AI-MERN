import { Box, Button, Input, Center } from "@chakra-ui/react";
import React from "react";
import "./ImageSearchForm.css";
// update the component with their parameter
const ImageSearchForm = ({ onInputChange, onSubmit }) => {
  return (
    <>
      <Center w='full'>
        <Box w='50%'>
          <Input
            bg='white'
            color='black'
            type="text"
            onChange={onInputChange}    // add an onChange to monitor input state
          />
          <Button
            w='full'
            colorScheme='pink'
            variant='solid'
            onClick={onSubmit}  // add onClick function to perform task
          >
            Detect
          </Button>
        </Box>
      </Center>
    </>
  );
};
export default ImageSearchForm;
