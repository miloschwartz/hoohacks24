import { useContext } from "react";
import { UserContext } from "../App";

function Profile() {
  const userData = useContext(UserContext);

  return (
    <>
      {userData && (
        <div className="content-container">
          <span className="font-bold text-4xl">Hello, {userData.name}</span>

          <img src={userData.picture} alt="picture " className="p-10" />

          <div>
            <p>Email: {userData.email}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
