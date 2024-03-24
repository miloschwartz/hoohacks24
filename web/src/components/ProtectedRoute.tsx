import { Navigate } from "react-router-dom";
import { UserSession } from "../../../model";

interface ProtectedRouteProps {
  user: UserSession | null;
  children: any;
}

function ProtectedRoute({ user, children }: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
