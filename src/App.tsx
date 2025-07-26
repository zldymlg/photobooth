import { useNavigate } from "react-router-dom";
function App() {
  const nagivate = useNavigate();

  const handleClick = () => {
    nagivate("/Camera");
  };

  return (
    <>
      <div className="container-fluid d-flex flex-column vh-100">
        <h1 className="text-center p-2">Welcome to the Photo Booth App</h1>
        <p className="text-center p-2">This is a simple React application.</p>
        <div
          className="row d-flex justify-content-center"
          style={{ gap: "1rem" }}
        >
          {" "}
          {/* Added g-4 for gap */}
          <div
            className="col-md-auto card btn"
            style={{ width: "18rem" }}
            onClick={handleClick}
          >
            <img
              src="src/assets/StripOne.png"
              className="card-img-top"
              alt="portrait"
            />
            <div className="card-body">
              <h5 className="card-title">Portrait</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card’s content.
              </p>
            </div>
          </div>
          <div className="col-md-auto card btn" style={{ width: "18rem" }}>
            <img
              src="src/assets/polaroid.jpg"
              className="card-img-top"
              alt="portrait"
              style={{ height: "60%" }}
            />
            <div className="card-body">
              <h5 className="card-title">Polaroid</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card’s content.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="text-center p-3">© 2023 Photo Booth App</div>
      </footer>
    </>
  );
}

export default App;
