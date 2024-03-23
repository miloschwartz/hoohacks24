import { useContext, useState } from "react";
import UploadResume from "../components/UploadResume/UploadResume";
import { UserContext, apiClient } from "../App";
import { useNavigate } from "react-router-dom";
import { useToast } from "../useToast";

function Start() {
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<string>("Behaviorial");
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const userContext = useContext(UserContext);
  const user = userContext?.userContext;
  const navigate = useNavigate();
  const toast = useToast();

  const generateInterview = async () => {
    setGenerateLoading(true);

    const formData = new FormData();
    formData.append("file", resumeFile as Blob);
    formData.append("jobTitle", jobTitle as string);
    formData.append("jobDescription", jobDescription as string);
    formData.append("interviewType", interviewType);

    await apiClient
      .post("/generate-interview", formData, {
        headers: {},
      })
      .then((res) => {
        if (!res || res.data.interivewId) {
          setGenerateLoading(false);
          toast.open({
            type: "error",
            text: "Something went wrong. Please try again.",
          });
          return;
        }

        setGenerateLoading(false);
        navigate(`/interview/${res.data.interviewId}`);
      })
      .catch((err) => {
        setGenerateLoading(false);
        toast.open({
          type: "error",
          text: `${err.response.data.message}`,
        });
      });
  };

  return (
    <>
      <div className="content-container">
        <div className="small-container">
          {/* <div className="text-center mb-10">
            <span className="font-bold text-4xl">Provide Information</span>
          </div> */}

          <ul className="steps mb-10 w-full">
            <li className="step step-primary">Provide Info</li>
            <li className="step">Generate</li>
            <li className="step">Interview</li>
            <li className="step">Get Feedback</li>
          </ul>

          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="mb-2">
                <div className="mb-2">
                  <label htmlFor="interview-type" className="label">
                    Interview Type
                  </label>
                  <select
                    id="interview-type"
                    className="select select-bordered w-full"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                  >
                    <option>Behaviorial</option>
                    <option>Technical</option>
                  </select>
                </div>

                <label htmlFor="job-title" className="label">
                  Job Title
                </label>
                <input
                  id="job-title"
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Type here"
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>

              <label htmlFor="job-description" className="label">
                Job Listing or Description
              </label>
              <textarea
                className="textarea textarea-bordered h-48"
                id="job-description"
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Type here"
              ></textarea>
              <label htmlFor="job-description" className="label-text mt-2">
                Provide a brief job listing or description to help the AI ask
                relevant questions for. You can copy and paste from a job
                listing or description.
              </label>

              <span className="font-bold text-xl mb-4 mt-10">
                Upload Resume
              </span>
              <div id="resume-upload">
                <UploadResume
                  onUpload={async (data) => {
                    setResumeFile(data);
                  }}
                ></UploadResume>
              </div>
              <label htmlFor="resume-upload" className="label-text mt-2">
                Upload a pdf, png, or jpeg of your resume to help the AI ask
                personalized questions. Your resume will not be stored.
              </label>

              <div className="card-actions justify-end">
                {user ? (
                  <button
                    className="btn btn-primary ml-auto mt-10"
                    disabled={
                      generateLoading ||
                      !jobTitle ||
                      !jobDescription ||
                      !interviewType
                    }
                    onClick={async () => await generateInterview()}
                  >
                    {generateLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : null}
                    Generate Interview
                  </button>
                ) : (
                  <a
                    href={`${
                      import.meta.env.VITE_APP_API_URL
                    }/auth/google/authorize`}
                    rel="noreferrer"
                    className="ml-auto mt-10"
                  >
                    <button className="btn btn-primary">
                      Sign In to Begin
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Start;
