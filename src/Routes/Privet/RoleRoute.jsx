import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../Provider/AuthContext";
import axiosInstance from "../../utils/axiosInstance";


const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading, logOut } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [fetchingRole, setFetchingRole] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (user?.email) {
        try {
          const response = await axiosInstance.get(`/users?email=${user.email}`);

          if (response.data.result?.length > 0) {
            setDbUser(response.data.result[0]);
          }
        } catch (error) {
          console.error("Role Check Error:", error);
        } finally {
          setFetchingRole(false);
        }
      } else {
        setFetchingRole(false);
      }
    };
    checkRole();
  }, [user]);

  if (loading || fetchingRole) {
    return <div className="h-screen flex items-center justify-center"><span className="loading loading-dots loading-xl"></span></div>;
  }


  if (user && dbUser && !allowedRoles.includes(dbUser.role)) {
    logOut();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleRoute;