import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="content-container">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Simulate your interview with AI
            </h1>
            <p className="py-6">
              Master your next job interview with AI! Upload your resume, input
              the job description, and dive into a realistic interview
              experience tailored just for you. Receive instant feedback and
              refine your responses to make a stellar impression every time.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/start")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
