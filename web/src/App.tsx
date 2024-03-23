import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import * as model from "../../model";
import Router from "./Router";
import Loading from "./components/Loading";
import { BsGithub, BsLinkedin } from "react-icons/bs";

interface UserContextProps {
  userContext: model.UserSession | null;
  setUserContext: React.Dispatch<
    React.SetStateAction<model.UserSession | null>
  >;
}

export const UserContext = React.createContext<UserContextProps | undefined>(
  undefined
);

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
});

function App() {
  const [user, setUser] = useState<model.UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const token = localStorage.getItem("session");
      if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data: user } = await apiClient.get<model.UserSession>(
          "/session"
        );
        if (user) {
          setUser(user);
        }
      }
      setLoading(false);
    };

    getSession();
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("session", token);
      window.location.replace(window.location.origin);
    }
  }, []);

  const signOut = async () => {
    localStorage.removeItem("session");
    setUser(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col h-screen justify-between">
        <div className="container mx-auto">
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <Link to="/">
                <span className="text-xl font-bold">
                  Interview Simulator AI
                  <span className="badge badge-neutral ml-3">v23.10.0</span>
                </span>{" "}
              </Link>
            </div>
            {user ? (
              <div className="flex-none gap-2">
                <span className="mr-3">
                  {user.credits} {user.credits === 1 ? "Credit" : "Credits"}
                </span>
                <div className="form-control">
                  <button className="btn" onClick={() => navigate("/start")}>
                    <Link to="/start">Start Interview</Link>
                  </button>
                </div>
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img src={user.picture} />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu dropdown-content bg-base-200 rounded-box w-52"
                  >
                    <li>
                      <Link to="/history">My Interviews</Link>
                    </li>
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <a onClick={() => signOut()}>Sign out</a>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <a
                href={`${
                  import.meta.env.VITE_APP_API_URL
                }/auth/google/authorize`}
                rel="noreferrer"
              >
                <button className="btn">Sign In</button>
              </a>
            )}
          </div>
        </div>

        <div className="mb-auto">
          <Router user={{ userContext: user, setUserContext: setUser }} />
        </div>

        <footer className="footer items-center p-4 bg-base-300 text-dark mt-10">
          <aside className="items-center grid-flow-col">
            <p>Milo Schwartz &middot; 2023</p>
          </aside>
          <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a href="https://www.linkedin.com/in/milo-schwartz-46002a24a/">
              <BsLinkedin size="1.5rem" />
            </a>
            <a href="https://github.com/miloschwartz">
              <BsGithub size="1.5rem" />
            </a>
          </nav>
        </footer>
      </div>
    </>
  );
}

export default App;
