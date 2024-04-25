import React from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { authState } = useAuth();
  const userId = authState?.decodedToken?.id;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Your user ID is: {userId}</p>
      <Link href="/">Back to Home</Link>
    </div>
  );
};

export default Profile;
