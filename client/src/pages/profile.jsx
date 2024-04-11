import React from 'react';
import Link from "next/link";

const Profile = () => {
  const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

  return (
    <div>
      <h1>User Profile</h1>
      <p>Your user ID is: {userId}</p>
      <Link href="/">Back to Home</Link>
    </div>
  );
};

export default Profile;
