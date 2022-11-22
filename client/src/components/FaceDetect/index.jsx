import { Box, Center, Image } from "@chakra-ui/react";
import React from "react";
import "./FaceDetect.css";

const FaceDetect = ({ imageUrl, box }) => {
  // console.log(box);
  return (
    <Center mt='52'>
      <Box position='absolute' >
        <Image id="inputimage" alt="" src={imageUrl} maxW='600px' maxH='300px' />
        <Box
          top={box.topRow}
          right={box.rightCol}
          bottom={box.bottomRow}
          left={box.leftCol}
          color='red'
          className="bounding-box"
        >{imageUrl && 'Face'}</Box>
      </Box>
    </Center>
  );
};

export default FaceDetect;
