import { Box } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useFaceApi } from 'react-use-faceapi';

const myFaceApiConfig = {
  input: 'my-image',
  refreshRate: 250
}
export default function FaceDetectImageMultiPeoplePage() {
  const imageRef = useRef();
  const [image, setImage] = useState("");
  const faces = useFaceApi(myFaceApiConfig);

  // Rendering
  return (
    <Box mt='20' mb='52'>
      <img style={{ width: 500 }} ref={imageRef} id="my-image" src={image} />
      <input type="file" onChange={(event) => setImage(URL.createObjectURL(event.target.files[0]))} />

      {faces && faces.map((face) => {

        // Attributes
        const top = face.relativeBox.top * imageRef.current.offsetHeight;
        const left = face.relativeBox.left * imageRef.current.offsetWidth;
        const width = face.relativeBox.width * imageRef.current.offsetWidth;
        const height = face.relativeBox.height * imageRef.current.offsetHeight;

        // Rendering
        return (
          <div style={{
            marginTop: '170px',
            position: 'absolute',
            width: width,
            height: height,
            left: left,
            top: top,
            border: '1px solid red',
          }}
          />
        );
      })}

    </Box >
  )
}
