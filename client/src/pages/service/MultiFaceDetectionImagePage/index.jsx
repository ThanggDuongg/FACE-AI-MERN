import React from 'react'
import { useEffect, useState } from 'react';
import { useRef } from 'react'
import * as faceapi from 'face-api.js';
import { Box, Button, Center, Input, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { imag } from '@tensorflow/tfjs';

export const MultiFaceDetectionImagePage = () => {
  const [file, setFile] = useState();
  const [image, setImage] = useState({
    url: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFjZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    width: 940,
    height: 560,
  });
  const [input, setInput] = useState("");
  const [tab, setTab] = useState(0);
  const imgRef = useRef();
  const canvasRef = useRef();

  // useEffect(() => {
  //   const getImage = () => {
  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);
  //     img.onload = () => {
  //       setImage({
  //         url: img.src,
  //         width: img.width,
  //         height: img.height,
  //       });
  //     };
  //   };

  //   file && getImage();
  // }, [file]);

  useEffect(() => {
    const loadModels = () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]).then(handleImage).catch((e) => console.log(e))
    }

    imgRef.current && loadModels()
  }, [image])

  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    })
    const resized = faceapi.resizeResults(detections, {
      width: 940,
      height: 650,
    })

    // canvasRef.current.getContext('2d').clearRect(0, 0, 940, 650);
    // canvasRef.current.getContext('2d').lineWidth = 5
    // canvasRef.current.getContext('2d').fillStyle = "#ff0000"
    // canvasRef.current.getContext('2d').fillRect(0, 0, 940, 650)
    // canvasRef.current.getContext('2d').strokeStyle = "#0F0000"
    // canvasRef.current.getContext('2d').stroke()

    faceapi.draw.drawDetections(canvasRef.current, resized)
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized)
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized)

    resized.forEach(detection => {
      const box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(canvasRef.current)
    })
  }

  const onSubmit = () => {
    if (tab === 0 && input.length > 0) {
      setImage({ ...image, url: input });
    } else {
      if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          setImage({
            url: img.src,
            width: img.width,
            height: img.height,
          });
        };
      };
    }
  }

  return (
    <Box>
      <Box my='20' position='relative'>
        <Center w='full'>
          <Box w='50%' bg='white' rounded='md'>
            <Tabs isFitted variant='enclosed' color='black' colorScheme='pink'>
              <TabList >
                <Tab onClick={() => { setTab(0) }}>Use link</Tab>
                <Tab onClick={() => { setTab(1) }}>Use upload</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Input
                    bg='white'
                    color='black'
                    type="text"
                    mb='5'
                    value={input}
                    onChange={(e) => { setInput(e.target.value) }}    // add an onChange to monitor input state
                  />
                </TabPanel>
                <TabPanel>
                  <Input
                    bg='white'
                    color='black'
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </TabPanel>
                <Button
                  w='full'
                  colorScheme='pink'
                  variant='solid'
                  onClick={onSubmit}  // add onClick function to perform task
                >
                  Detect
                </Button>
              </TabPanels>
            </Tabs>
          </Box>
        </Center>
      </Box>
      <Center>
        <div style={{ width: '940px', height: '650px', margin: '20px 60px', border: '1px solid blue' }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
              style={{
                width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px'
              }}
              crossOrigin='anonymous'
              ref={imgRef}
              src={image.url}
              alt=''
              width='940'
              height='650'
            />
            <canvas style={{
              color: 'red', width: '100%', height: '100%', position: 'absolute', top: '0px', left: '0px', backgroundColor: 'rgba(255,0,0,.1)'
            }} ref={canvasRef} width='940' height='650' />
          </div>
        </div>
      </Center>
    </Box>
  )
}
