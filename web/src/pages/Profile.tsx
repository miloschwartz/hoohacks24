import { useContext } from "react";
import { UserContext } from "../App";

function Profile() {
  const context = useContext(UserContext);
  const user = context?.userContext;

  return (
    <>
      {user && (
        <div className="content-container">
          <span className="font-bold text-4xl">Hello, {user.name}</span>
          <img src={user.picture} alt="picture " className="p-10" />
          <div>
            <p>Email: {user.email}</p>
            <p>Credits: {user.credits}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
