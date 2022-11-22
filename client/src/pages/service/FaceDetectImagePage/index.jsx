import React, { useState } from 'react'
import { Box, Center, Flex } from '@chakra-ui/react';
import ImageSearchForm from '../../../components/ImageSearchForm';
import FaceDetect from '../../../components/FaceDetect';
import imageApi from '../../../apis/imageApi';

export default function FaceDetectImagePage() {
  const [input, setInput] = useState("");
  const [urlImage, setUrlImage] = useState("");
  const [box, setBox] = useState({});

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onSubmit = async () => {
    // set imageUrl state
    // setState({ ...state, imageUrl: state.input });
    setUrlImage(input)
    try {
      const response = await imageApi.detectOneFace({ imageURL: urlImage })

      displayFaceBox(calculateFaceLocation(response.data.data))
    } catch (err) {
      console.log(err)
    }
  }

  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(clarifaiFace)
    return {
      leftCol: Number(clarifaiFace.left_col) * width,
      topRow: Number(clarifaiFace.top_row) * height,
      rightCol: width - Number(clarifaiFace.right_col) * width,
      bottomRow: height - Number(clarifaiFace.bottom_row) * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box)
  };

  return (
    <Box my='14' mb='64' width='full'>
      <Center width='full'>
        <Flex direction='column' width='full'>
          <ImageSearchForm
            onInputChange={onInputChange}
            onSubmit={onSubmit}
          />
          <FaceDetect box={box} imageUrl={urlImage} />
        </Flex>
      </Center>
    </Box>
  )
}
