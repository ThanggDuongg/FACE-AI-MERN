import Webcam from 'react-webcam';
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { useEffect } from 'react';
import { Box, Button, Center } from '@chakra-ui/react';

const TensorflowPage = () => {

  const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
    faceDetectionOptions: {
      model: 'short',
    },
    faceDetection: new FaceDetection.FaceDetection({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    }),
    camera: ({ mediaSrc, onFrame, width, height }) =>
      new Camera(mediaSrc, {
        onFrame,
        width,
        height,
      }),
  });

  return (
    <Box my='14' mb='64' width='full'>
      <Button onClick={() => {
        webcamRef.current.removeChild(webcamRef.current.children[0])
      }}>Turn off webcam</Button>
      <p>{`Loading: ${isLoading}`}</p>
      <p>{`Face Detected: ${detected}`}</p>
      <p>{`Number of faces detected: ${facesDetected}`}</p>
      <Center style={{ width: '700px', height: '700px', position: 'relative', margin: 'auto' }}>
        {boundingBox.map((box, index) => (
          <div
            key={`${index + 1}`}
            style={{
              border: '4px solid red',
              position: 'absolute',
              top: `${box.yCenter * 100}%`,
              left: `${box.xCenter * 100}%`,
              width: `${box.width * 100}%`,
              height: `${box.height * 100}%`,
              zIndex: 1,
            }}
          />
        ))}
        <Webcam

          ref={webcamRef}
          forceScreenshotSourceSize
          style={{
            height: '100%',
            width: '100%',
            // objectFit: 'cover',
            position: 'absolute',
          }}
        />
      </Center>
    </Box>
  );
};

export default TensorflowPage;
