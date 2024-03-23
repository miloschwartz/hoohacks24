import { useContext, useState } from "react";
import UploadResume from "./components/UploadResume/UploadResume";
import axios from "axios";
import { UserContext, apiClient } from "./App";

function Start() {
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<string>("Behaviorial");
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const userData = useContext(UserContext);

  function ocrLoading() {
    return ocrProgress > 0 && ocrProgress < 100;
  }

  return (
    <>
      <div className="content-container">
        <div className="form-container">
          <div className="text-center mb-10">
            <span className="font-bold text-4xl">Provide Information</span>
          </div>

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

          <div>
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

          <span className="font-bold text-xl mb-4 mt-10">
            Job Listing or Description
          </span>
          <textarea
            className="textarea textarea-bordered"
            id="job-description"
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Type here"
          ></textarea>
          <label htmlFor="job-description" className="label-text mt-2">
            Provide a brief job listing or description to help the AI ask
            relevant questions for. You can copy and paste from a job listing or
            description.
          </label>

          <span className="font-bold text-xl mb-4 mt-10">Upload Resume</span>
          <div id="resume-upload">
            <UploadResume
              onUpload={async (file) => {
                setOcrProgress(0);
                setResumeText(null);

                // TODO: send file to OCR server in lambda
                const reader = new FileReader();

                reader.onloadend = async () => {
                  const base64data = reader.result;
                  // convert to base64 string
                  const res = await apiClient.post("/ocr", base64data, {
                    headers: {
                      "Content-Type": "application/base64",
                    },
                  });
                };
                reader.readAsDataURL(file);
              }}
            ></UploadResume>
          </div>
          <label htmlFor="resume-upload" className="label-text mt-2">
            Upload a pdf, png, or jepg of your resume to help the AI ask
            personalized questions. Your resume will not be stored.
          </label>

          <button
            className="btn btn-primary ml-auto mt-10"
            disabled={
              !resumeText ||
              !jobDescription ||
              !jobTitle ||
              !interviewType ||
              ocrLoading()
            }
            onClick={() => {
              // log all data
              console.log("resumeText", resumeText);
              console.log("jobDescription", jobDescription);
              console.log("jobTitle", jobTitle);
              console.log("interviewType", interviewType);
            }}
          >
            {ocrLoading() ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : null}
            Generate Interview
          </button>
        </div>
      </div>
    </>
  );
}

export default Start;
