import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="content-container">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Uh oh</h1>
            <p className="py-6">The page you are looking for does not exist.</p>
            <button
              className="btn btn-error"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
