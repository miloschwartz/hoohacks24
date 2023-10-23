import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Interview from "./pages/Interview";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./pages/History";
import { UserContext } from "./App";
import * as model from "../../model";

interface RouterProps {
  user: model.UserSession | null;
}

function Router({ user }: RouterProps) {
  return (
    <>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/start" element={<Start />}></Route>
          <Route
            element={
              <ProtectedRoute user={user}>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/history" element={<History />}></Route>
                <Route
                  path="/interview/:interviewId"
                  element={<Interview />}
                ></Route>
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
