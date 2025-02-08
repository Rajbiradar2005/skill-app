import React, { useEffect, useState } from "react";
import { auth } from "./firebase";  // Adjust the path if needed
import { onAuthStateChanged } from "firebase/auth";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          // Simulating an API call to fetch profile data
          const userProfile = {
            name: currentUser.displayName || "User",
            email: currentUser.email,
            offeredServices: ["Web Development", "Graphic Design"], // Example
            requestedServices: ["Video Editing"],
            rating: 4.5,
            bio: "This is my bio.",
          };
          setProfile(userProfile);
          setBio(userProfile.bio);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchProfile(currentUser);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      // Example function to update profile in Firebase (implement this in your backend)
      // await updateUserProfile(user.uid, { bio });

      setProfile((prev) => ({ ...prev, bio }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-container">
      <h2>Welcome, {profile.name}!</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Offered Services:</strong> {profile.offeredServices.join(", ")}</p>
        <p><strong>Requested Services:</strong> {profile.requestedServices.join(", ")}</p>
        <p><strong>Rating:</strong> {profile.rating}</p>
        <p><strong>Bio:</strong></p>
        {isEditing ? (
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            rows="3"
          />
        ) : (
          <p>{bio}</p>
        )}
      </div>
      <button onClick={isEditing ? handleSave : handleEdit}>
        {isEditing ? "Save" : "Edit Profile"}
      </button>
    </div>
  );
};

export default Profile;
