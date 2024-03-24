import { useContext, useEffect, useState } from "react";
import { UserContext, apiClient } from "../App";
import { useToast } from "../useToast";
import Loading from "../components/Loading";
import * as model from "../../../model";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function History() {
  const [pageNo, setPageNo] = useState(1);
  const [nextTokens, setNextTokens] = useState<string[]>([]);
  const [end, setEnd] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [limit, setLimit] = useState(10);
  const [interviews, setInterviews] = useState<model.Interview[]>([]);

  const toast = useToast();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const user = context?.userContext;

  useEffect(() => {
    if (!user) {
      return;
    }
    const getInterviews = () => {
      apiClient
        .get("/get-interviews", {
          params: {
            limit: limit,
          },
        })
        .then((res) => {
          setInterviews(res.data.items);
          if (res.data.nextToken) {
            setNextTokens([res.data.nextToken]);
          }
        })
        .catch((err) => {
          toast.open({
            text: `Failed to get interviews: ${err.message}`,
            type: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getInterviews();
  }, []);

  const fetchInterviews = async (token: string, direction: string) => {
    if (!user) {
      return;
    }

    setLoadingPage(true);

    apiClient
      .get("/get-interviews", {
        params: {
          limit: limit,
          nextToken: token,
        },
      })
      .then((res) => {
        setInterviews(res.data.items);
        if (res.data.nextToken) {
          setNextTokens([...nextTokens, res.data.nextToken]);
          setEnd(false);
        } else {
          setEnd(true);
        }
        setPageNo(direction === "next" ? pageNo + 1 : pageNo - 1);
      })
      .catch((err) => {
        toast.open({
          text: `Failed to get interviews: ${err.message}`,
          type: "error",
        });
      })
      .finally(() => {
        setLoadingPage(false);
      });
  };

  const nextPage = async () => {
    const token = nextTokens[pageNo - 1];
    if (token) {
      fetchInterviews(token, "next");
    }
  };

  const prevPage = async () => {
    const token = nextTokens[pageNo - 2];
    if (token) {
      fetchInterviews(token, "prev");
    }
  };

  const formatDate = (date: string) => {
    return moment(date).format("MMMM Do YYYY, h:mm:ss a");
  };

  const getBadgeColor = (status: model.InterviewStatus) => {
    switch (status) {
      case "GENERATING_QUESTIONS":
        return "badge-neutral";
      case "READY":
        return "badge-success";
      case "IN_PROGRESS":
        return "badge-primary";
      case "COMPLETED":
        return "badge-info";
    }
  };

  const getButtonText = (status: model.InterviewStatus) => {
    switch (status) {
      case "GENERATING_QUESTIONS":
        return "View";
      case "READY":
        return "Begin";
      case "IN_PROGRESS":
        return "Resume";
      case "COMPLETED":
        return "View Results";
    }
  };

  const renderStatus = (status: model.InterviewStatus) => {
    switch (status) {
      case "GENERATING_QUESTIONS":
        return "Generating Interview";
      case "READY":
        return "Ready";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
    }
  };

  if (loading || !interviews) {
    return <Loading />;
  }

  return (
    <>
      <div className="content-container">
        <div className="medium-container">
          <div className="card w-100 bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table text-center">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Created</th>
                      <th>Total Questions</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((interview) => (
                      <tr key={interview.interviewId}>
                        <td></td>
                        <td>{formatDate(interview.created)}</td>
                        <td>
                          {interview.questions && interview.questions.length}
                        </td>
                        <td>
                          <div
                            className={`badge ${getBadgeColor(
                              interview.status
                            )}`}
                          >
                            {renderStatus(interview.status)}
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn btn-neutral btn-sm"
                            onClick={() => {
                              navigate(`/interview/${interview.interviewId}`);
                            }}
                          >
                            {getButtonText(interview.status)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {nextTokens.length > 0 && (
                <div className="card-actions ml-auto mt-10">
                  <div className="join">
                    <button
                      className="join-item btn"
                      onClick={() => prevPage()}
                      disabled={pageNo === 1}
                    >
                      «
                    </button>
                    <button className="join-item btn">{pageNo}</button>
                    <button
                      className="join-item btn"
                      onClick={() => nextPage()}
                      disabled={end}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default History;
