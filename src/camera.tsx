import React from "react";
import Webcam from "react-webcam";

const maxImages = 4;
const soundEffect = new Audio("https://www.soundjay.com/button/beep-07.wav");

const filterOptions = [
  { label: "No Filter", value: "none" },
  {
    label: "Sepia",
    value: "sepia(0.6) contrast(1.2) brightness(0.9) grayscale(0.3)",
  },
  { label: "Grayscale", value: "grayscale(100%) contrast(1.2)" },
  { label: "Faded Look", value: "brightness(0.7) contrast(0.8) sepia(0.4)" },
  { label: "Warm Vintage", value: "sepia(0.8) saturate(0.5) contrast(1.1)" },
];

// Type definition for the images state
interface ImageObject {
  src: string;
  filter: string;
}

const PhotoBooth = () => {
  const webcamRef = React.useRef<Webcam | null>(null);
  const [images, setImages] = React.useState<ImageObject[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>(
    filterOptions[0].value
  );
  const [isCaptureInProgress, setIsCaptureInProgress] =
    React.useState<boolean>(false); // To prevent multiple captures
  const [countdownTime, setCountdownTime] = React.useState<number>(0); // Time left for countdown
  const [isCountingDown, setIsCountingDown] = React.useState<boolean>(false); // To track countdown state
  const [viewImage, setViewImage] = React.useState<string | null>(null); // To view enlarged image

  // Capture photo function
  const capture = React.useCallback(() => {
    if (!isCaptureInProgress && webcamRef.current) {
      setIsCaptureInProgress(true); // Lock the capture function to prevent multiple captures
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        soundEffect.play(); // Play the shutter sound
        setImages((prevImages) => {
          const newImages = [
            ...prevImages,
            { src: imageSrc, filter: selectedFilter },
          ];
          if (newImages.length > maxImages) {
            newImages.shift(); // Remove the oldest image if the limit is exceeded
          }
          localStorage.setItem("images", JSON.stringify(newImages));
          return newImages;
        });
      }
      setIsCaptureInProgress(false); // Unlock the capture function after the photo is taken
    }
  }, [selectedFilter, isCaptureInProgress]);

  // Countdown timer function
  const startCountdown = (seconds: number) => {
    if (!isCountingDown) {
      setCountdownTime(seconds); // Set the countdown time
      setIsCountingDown(true); // Start the countdown process
    }
  };

  // Function to handle the countdown and capture photo after countdown ends
  React.useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (isCountingDown && countdownTime > 0) {
      timerId = setTimeout(() => {
        setCountdownTime((prevTime) => prevTime - 1); // Decrease the countdown time by 1 second
      }, 1000);
    } else if (countdownTime === 0 && isCountingDown) {
      capture(); // Trigger capture when countdown reaches 0
      setIsCountingDown(false); // Reset countdown status
    }

    return () => {
      if (timerId) clearTimeout(timerId); // Clear the timer when countdown is finished or the component unmounts
    };
  }, [isCountingDown, countdownTime, capture]);

  // Remove photo function
  const removePhoto = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1); // Remove the image at the given index
      localStorage.setItem("images", JSON.stringify(newImages));
      return newImages;
    });
  };

  // Handle window orientation changes
  const [orientation, setOrientation] = React.useState<number>(
    window.orientation || 0
  );

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.orientation || 0);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // Apply rotation for the webcam view based on orientation
  const getRotationStyle = () => {
    switch (orientation) {
      case 90:
        return { transform: "rotate(90deg)" };
      case -90:
        return { transform: "rotate(-90deg)" };
      case 180:
        return { transform: "rotate(180deg)" };
      default:
        return {}; // Default to no rotation (portrait mode)
    }
  };

  // View enlarged image function
  const viewImageFn = (src: string) => {
    setViewImage(src); // Set the image to be viewed in enlarged format
  };

  // Close enlarged image
  const closeImage = () => {
    setViewImage(null); // Close the enlarged image view
  };

  return (
    <div>
      <h1>Photo Booth</h1>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={true}
        width={1280}
        style={{
          ...getRotationStyle(),
          filter: selectedFilter,
        }}
      />

      {/* Countdown Buttons */}
      <div>
        <button
          onClick={() => startCountdown(3)} // Set countdown for 3 seconds
          disabled={isCountingDown || images.length >= maxImages}
        >
          Capture in 3 seconds
        </button>
        <button
          onClick={() => startCountdown(5)} // Set countdown for 5 seconds
          disabled={isCountingDown || images.length >= maxImages}
        >
          Capture in 5 seconds
        </button>
        <button
          onClick={() => startCountdown(10)} // Set countdown for 10 seconds
          disabled={isCountingDown || images.length >= maxImages}
        >
          Capture in 10 seconds
        </button>
      </div>

      {/* Timer Display */}
      <div>
        <h4>Timer: {countdownTime}s</h4>
        {countdownTime === 0 && <p>Time's up! Capturing photo...</p>}
      </div>

      {/* Filter Selection */}
      <div>
        <h3>Choose Filter:</h3>
        <select
          onChange={(e) => setSelectedFilter(e.target.value)}
          value={selectedFilter}
        >
          {filterOptions.map((filter, index) => (
            <option key={index} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {/* Display Captured Images */}
      {images.length > 0 ? (
        <div>
          <h2>Captured Images:</h2>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.map((imageObj, index) => (
              <div key={index} style={{ margin: "10px" }}>
                <img
                  src={imageObj.src}
                  alt={`Captured ${index}`}
                  style={{
                    width: "200px",
                    height: "auto",
                    borderRadius: "8px",
                    filter: imageObj.filter,
                    cursor: "pointer",
                  }}
                  onClick={() => viewImageFn(imageObj.src)} // View enlarged image on click
                />
                <button
                  onClick={() => removePhoto(index)}
                  style={{ marginTop: "5px" }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No images captured yet.</p>
      )}

      {/* Enlarge Image Modal */}
      {viewImage && (
        <div style={modalStyle}>
          <span onClick={closeImage} style={closeBtnStyle}>
            X
          </span>
          <img src={viewImage} alt="Enlarged" style={enlargedImageStyle} />
        </div>
      )}
    </div>
  );
};

// Modal styles for enlarged image view
const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: "20px",
  right: "20px",
  color: "white",
  fontSize: "24px",
  cursor: "pointer",
};

const enlargedImageStyle: React.CSSProperties = {
  maxWidth: "90%",
  maxHeight: "90%",
};

export default PhotoBooth;
