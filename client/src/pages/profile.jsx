import React from 'react';

const Profile = () => {
    const userId = localStorage.getItem('userId');  // Retrieve user ID from local storage

    return (
        <div>
            <h1>User Profile</h1>
            <p>Your user ID is: {userId}</p>
            <a href="/">Back to Home</a>
        </div>
    );
};

export default Profile;
