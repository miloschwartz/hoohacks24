import { useContext } from "react";
import { UserContext } from "../App";

function Profile() {
  const context = useContext(UserContext);
  const user = context?.userContext;

  const signOut = async () => {
    localStorage.removeItem("session");
    context?.setUserContext(null);
  };

  return (
    <>
      {user && (
        <div className="content-container">
          <div className="card w-100 bg-base-300 shadow-xl mt-10">
            <div className="card-body">
              <h2 className="card-title">Hello, {user.name}</h2>

              <div className="text-center">
                <img
                  src={user.picture}
                  alt="picture"
                  className="p-10 w-72 m-auto"
                />
                <div>
                  <p>Email: {user.email}</p>
                  <p>Credits: {user.credits}</p>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn mt-10 ml-auto" onClick={() => signOut()}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
