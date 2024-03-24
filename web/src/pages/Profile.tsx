import { useContext } from "react";
import { Trans } from 'react-i18next'
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
              <h2 className="card-title"><Trans>Hello</Trans>, {user.name}</h2>

              <div className="text-center">
                <img
                  src={user.picture}
                  alt="picture"
                  className="p-10 w-72 m-auto"
                />
                <div>
                  <p><Trans>Email</Trans>: {user.email}</p>
                  <p><Trans>Credits</Trans>: {user.credits}</p>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn mt-10 ml-auto" onClick={() => signOut()}>
                  <Trans>Sign Out</Trans>
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
