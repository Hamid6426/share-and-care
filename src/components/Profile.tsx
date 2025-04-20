"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { currentUser, isUserLoading } = useAuth();

  if (isUserLoading) {
    return <p>Loading...</p>;
  }

  if (!currentUser) {
    return <p>User not found or not logged in.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {currentUser.name}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Role:</strong> {currentUser.role}</p>
    </div>
  );
};

export default Profile;
