import React from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1080,
  height: 1920,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = React.useRef<Webcam | null>(null);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const imageCount = imageSrc
        ? (imageSrc.match(/data:image\/jpeg;base64,/g) || []).length
        : 0;
      setImageSrc(imageSrc);
      if (imageCount < 3) {
        setImageSrc(imageSrc);
      }
    }
  }, [webcamRef]);

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={true}
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>

      {imageSrc && (
        <div>
          <h2>Captured Image:</h2>
          <img src={imageSrc} alt="Captured" />
        </div>
      )}
    </>
  );
};

export default WebcamCapture;
