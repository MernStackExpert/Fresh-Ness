import React, { useContext, useEffect, useState } from "react";
import AdminStats from "./Admin/AdminStats";
import ManagerStats from "./Manager/ManagerStats";
import UserStats from "./User/UserStats";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../Provider/AuthContext";

const DashboardHome = () => {
  const { user: firebaseUser, loading: authLoading } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  

  useEffect(() => {
    const getRoleBasedData = async () => {
      if (!authLoading && firebaseUser?.email) {
        try {
          const response = await axiosInstance.get(`/users?email=${firebaseUser.email}`);
          if (response.data.result?.length > 0) {
            setDbUser(response.data.result[0]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setFetching(false);
        }
      } else if (!authLoading && !firebaseUser) {
        setFetching(false);
      }
    };
    getRoleBasedData();
  }, [firebaseUser, authLoading]);

  if (authLoading || fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animation-fade-in">
      {dbUser?.role === "admin" && <AdminStats dbUser={dbUser} />}
      {dbUser?.role === "manager" && <ManagerStats dbUser={dbUser} />}
      {dbUser?.role === "user" && <UserStats dbUser={dbUser} />}
      
      {!dbUser && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">User data not found</h2>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;