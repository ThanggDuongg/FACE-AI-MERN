import * as faceapi from 'face-api.js';
import React, { useState, useRef, useEffect } from 'react'
// import * from '../../../../public/models'

function FaceDetectRealtimePage() {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureVideo, setCaptureVideo] = useState(false);
  const [matcher, setMatcher] = useState(null);

  const videoRef = useRef(null);
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = useRef(null);
  let faceMatcher;

  useEffect( async () => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        faceapi.nets.mtcnn.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.tinyYolov2.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
      const loadTrainingData = async () => {
        const faceDescription = []
        const labels = ["Drogba"]
        for (const label of labels) {
          const description = []
          for (let i = 1; i <= 5; i ++) {
            console.log("../data/Drogba/1.png");
            const image = await faceapi.fetchImage(`/data/${label}/${i}.png`)
            const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
            description.push(detection.descriptor)
            console.log(image);
          }
          faceDescription.push(new faceapi.LabeledFaceDescriptors(label, description))
        }
        console.log("client/src/pages/service/FaceDetectRealtimePage/data/Drogba/1.png");
        // console.log(faceDescription);
        return faceDescription;
      }
      const traning = await loadTrainingData()
      faceMatcher = new faceapi.FaceMatcher(traning, 0.6);
      setMatcher(faceMatcher)
    }
    loadModels();
    
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 }, audio: false })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }

        faceapi.matchDimensions(canvasRef.current, displaySize);
        //TinyFaceDetectorOptions()
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.MtcnnOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors().withAgeAndGender();
        console.log(detections)
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // canvasRef && canvasRef.current &&
        canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
        // canvasRef && canvasRef.current && faceapi.draw.

        resizedDetections.forEach(detection => {
          const box = detection.detection.box
          const drawBox = new faceapi.draw.DrawBox(box, { label: faceMatcher.findBestMatch(detection.descriptor)})
          drawBox.draw(canvasRef.current)
        })
      }
    }, 100)
  }

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    // canvasRef.current = null
    setCaptureVideo(false);
  }

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '10px' }}>
        {
          captureVideo && modelsLoaded ?
            <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
              Close Webcam
            </button>
            :
            <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px', marginTop: '50px', marginBottom: '150px' }}>
              Open Webcam
            </button>
        }
      </div>
      {
        captureVideo ?
          modelsLoaded ?
            <div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                <canvas ref={canvasRef} style={{ position: 'absolute' }} />
              </div>
            </div>
            :
            <div>loading...</div>
          :
          <>
          </>
      }
    </div>
  );
}

export default FaceDetectRealtimePage;
