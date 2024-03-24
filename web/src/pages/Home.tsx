import { useNavigate } from "react-router-dom";
import { Trans , useTranslation } from 'react-i18next';

function Home() {
  const navigate = useNavigate();
  useTranslation();
  
  return (
    <>
      <div className="hero py-20 bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">Proficio AI</h1>
            <p className="py-1">
              <Trans>Master your next job interview with AI! Upload your resume, input
              the job description, and dive into a realistic interview
              experience tailored just for you. Receive instant feedback and
              refine your responses to make a stellar impression every time.</Trans>
            </p>
            <div className="flex justify-center py-10">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/start")}
              >
                <Trans>Get Started</Trans>
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
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              <Trans>Elevate Your Interview Skills</Trans>
            </p>
          </div>
          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    <Trans>Personalized Questions</Trans>
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  <Trans>Our AI analyzes your resume and the job description to
                  generate interview questions specifically tailored to your
                  application, ensuring a highly relevant practice experience.</Trans>{" "}
                </dd>
              </div>
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    <Trans>Speech-to-Text Technology</Trans>
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  <Trans>Practice answering interview questions naturally by speaking
                  your responses. Our advanced speech-to-text technology
                  accurately transcribes your answers for easy review and
                  analysis.</Trans>
                </dd>
              </div>
<div className="relative">
  <dt>
    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
    </div>
    <p className="ml-16 text-lg leading-6 font-medium">
      <Trans>Multi-Language Support</Trans>
    </p>
  </dt>
  <dd className="mt-2 ml-16 text-base text-gray-500">
    <Trans>Our platform supports multiple languages, allowing you to practice
    interviewing in your preferred language.</Trans>
  </dd>
</div>
              <div className="relative ">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium">
                    <Trans>Detailed Feedback and Analytics</Trans>
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  <Trans>Receive comprehensive feedback on your interview performance,
                  including insights on your strengths and areas for
                  improvement. Our AI-powered analytics help you track your
                  progress and refine your interview skills.</Trans>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
