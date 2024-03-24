import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as model from "../../../model";
import { apiClient } from "../App";

function Interview() {
  const { interviewId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get<model.Interview>(
        `/get-interview/${interviewId}`,
        {}
      );
      setInterview(res.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState<model.Interview | null>(null);

  return (
    <>
      <div className="content-container">
        <div className="form-container">
          <h1 className="text-5xl font-bold mb-10">Begin your interview</h1>
          {interview &&
            interview.questions.map((question, index) => {
              return (
                <div key={index}>
                  <p className="py-6">{question}</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Interview;
