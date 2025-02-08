import React, { useEffect, useState } from "react";
import { auth } from "../firebase";  // Adjust the path if needed
import { onAuthStateChanged } from "firebase/auth";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        // Here you can fetch the profile data based on `currentUser.uid`
        // Assuming you have a function to fetch profile details
        // const userProfile = await getUserProfile(currentUser.uid);
        // setProfile(userProfile);
        // setBio(userProfile.bio || "");
      }
    };

    // Listen for auth state changes (e.g., on login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProfile();
      } else {
        setUser(null);
      }
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // Save the updated bio to Firebase
    // await updateUserProfile(user.uid, { bio });
    setIsEditing(false);
  };

  return user && profile ? (
    <div className="profile-container">
      <h2>Welcome, {profile.name}!</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Offered Services:</strong> {profile.offeredServices.join(", ")}</p>
        <p><strong>Requested Services:</strong> {profile.requestedServices.join(", ")}</p>
        <p><strong>Rating:</strong> {profile.rating}</p>
        <p><strong>Bio:</strong> {isEditing ? (
          <input 
            type="text" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
          />
        ) : (
          bio
        )}</p>
      </div>
      {isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit Profile</button>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Profile;
