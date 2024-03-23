import { useState } from "react";
import UploadResume from "../components/UploadResume/UploadResume";
import { apiClient } from "../App";
import { useNavigate } from "react-router-dom";

function Start() {
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [interviewType, setInterviewType] = useState<string>("Behaviorial");
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const navigate = useNavigate();

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

          <div className="mb-2">
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
              onUpload={async (data) => {
                setResumeFile(data);
              }}
            ></UploadResume>
          </div>
          <label htmlFor="resume-upload" className="label-text mt-2">
            Upload a pdf, png, or jepg of your resume to help the AI ask
            personalized questions. Your resume will not be stored.
          </label>

          <button
            className="btn btn-primary ml-auto mt-10"
            disabled={generateLoading}
            onClick={async () => {
              setGenerateLoading(true);

              const formData = new FormData();
              formData.append("file", resumeFile as Blob);
              formData.append("jobTitle", jobTitle as string);
              formData.append("jobDescription", jobDescription as string);
              formData.append("interviewType", interviewType);
              const genRes = await apiClient.post(
                "/generate-interview",
                formData,
                {
                  headers: {},
                }
              );

              if (genRes.data.interivewId) {
                setGenerateLoading(false);
                console.error("no interview id was provided");
                return;
              }

              const poll = setInterval(async () => {
                const res = await apiClient.get(
                  `/get-interview/${genRes.data.interviewId}`,
                  {}
                );

                if (res.data.status === "QUESTIONS_GENERATED") {
                  clearInterval(poll);
                  setGenerateLoading(false);
                  navigate(`/interview/${genRes.data.interviewId}`);
                }
              }, 1000);
            }}
          >
            {generateLoading ? (
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
