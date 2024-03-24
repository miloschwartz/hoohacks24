import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import InterviewStatus from "./pages/InterviewStatus";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";
import { UserContext } from "./App";
import * as model from "../../model";

interface RouterProps {
  user: {
    userContext: model.UserSession | null;
    setUserContext: React.Dispatch<
      React.SetStateAction<model.UserSession | null>
    >;
  };
}

function Router({ user: { userContext, setUserContext } }: RouterProps) {
  return (
    <>
      <UserContext.Provider value={{ userContext, setUserContext }}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/start" element={<Start />}></Route>
          <Route
            element={
              <ProtectedRoute user={userContext}>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/history"
            element={
              <ProtectedRoute user={userContext}>
                <History />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/interview/:interviewId"
            element={
              <ProtectedRoute user={userContext}>
                <InterviewStatus />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default Router;
