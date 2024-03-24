import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

<<<<<<< HEAD
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">
              Ace Your Interview with AI
            </h1>
            <p className="py-6">
              Master your next job interview with AI! Upload your resume, input
              the job description, and dive into a realistic interview
              experience tailored just for you. Receive instant feedback and
              refine your responses to make a stellar impression every time.
            </p>
            <div className="flex justify-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/start")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-base-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Elevate Your Interview Skills
            </p>
          </div>
          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Personalized Questions</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Our AI analyzes your resume and the job description to generate interview questions specifically tailored to your application, ensuring a highly relevant practice experience.
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Speech-to-Text Technology</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Practice answering interview questions naturally by speaking your responses. Our advanced speech-to-text technology accurately transcribes your answers for easy review and analysis.
                </dd>
              </div>
              <div className="relative ">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Detailed Feedback and Analytics</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Receive comprehensive feedback on your interview performance, including insights on your strengths and areas for improvement. Our AI-powered analytics help you track your progress and refine your interview skills.
                </dd>
              </div>
 
            </dl>
          </div>
        </div>
      </div>
    </>
  );
=======
  return (
    <>
      <div className="content-container">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              <Trans>Simulate your interview with AI</Trans>
            </h1>
            <p className="py-6">
              <Trans>
                Master your next job interview with AI! Upload your resume,
                input the job description, and dive into a realistic interview
                experience tailored just for you. Receive instant feedback and
                refine your responses to make a stellar impression every time.
              </Trans>
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/start")}
            >
              <Trans>Get Started</Trans>
            </button>
          </div>
        </div>
      </div>
    </>
  );
>>>>>>> 3ecf98f (translations)
}

export default Home;

