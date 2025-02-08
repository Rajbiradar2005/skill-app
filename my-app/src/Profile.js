import React, { useEffect, useState } from "react";
import { auth } from "./firebase";  // Adjust the path if needed
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { doc, getDoc, setDoc } from "firebase/firestore"; // Add Firestore imports
import { db } from "./firebase"; // Add db import to access Firestore
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    offeredServices: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchProfile = async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);

          // Fetch the profile from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          
          if (userDocSnapshot.exists()) {
            const userProfile = userDocSnapshot.data();
            setProfile(userProfile);
            setFormData({
              bio: userProfile.bio,
              offeredServices: userProfile.offeredServices.join(", "),
            });
          } else {
            console.log("No profile found for this user.");
            // If no profile exists in Firestore, use defaults
            setProfile({
              name: currentUser.displayName || "User",
              email: currentUser.email,
              offeredServices: ["offered service"],
              bio: "This is my bio.",
            });
            setFormData({
              bio: "This is my bio.",
              offeredServices: "offered service",
            });
          }
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

  const handleCancel = () => {
    // Restore original values on cancel
    setFormData({
      bio: profile ? profile.bio : "",
      offeredServices: profile ? profile.offeredServices.join(", ") : "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Convert comma-separated services into arrays
      const updatedProfile = {
        ...profile,
        bio: formData.bio,
        offeredServices: formData.offeredServices.split(",").map((s) => s.trim()),
      };

      // Check if user is authenticated
      if (user) {
        // Save to Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, updatedProfile, { merge: true });  // Use merge to avoid overwriting other fields

        console.log("Profile updated successfully!");

        setProfile(updatedProfile);  // Update local state
        setIsEditing(false);  // Exit edit mode
      } else {
        console.error("User is not authenticated!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-container">
      <h2>Welcome, {profile ? profile.name : "Loading..."}</h2> {/* Check for profile */}
      <div className="profile-info">
        <p><strong>Email:</strong> {profile ? profile.email : "Loading..."}</p> {/* Check for profile */}
        
        <p><strong>Offered Services:</strong></p>
        {isEditing ? (
          <input 
            type="text"
            value={formData.offeredServices}
            onChange={(e) => setFormData({ ...formData, offeredServices: e.target.value })}
          />
        ) : (
          <p>{profile ? profile.offeredServices.join(", ") : "Loading..."}</p>
        )}

        <p><strong>Bio:</strong></p>
        {isEditing ? (
          <input 
            type="text"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        ) : (
          <p>{profile ? profile.bio : "Loading..."}</p>
        )}
      </div>

      {isEditing ? (
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
        </div>
      ) : (
        <button onClick={handleEdit}>Edit Profile</button>
      )}

      {/* Home Button */}
      <button className="home-button" onClick={() => navigate("/Homepage")}>
        Go to Homepage
      </button>
    </div>
  );
};

export default Profile;
