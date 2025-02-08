import React, { useEffect, useState } from "react";
import { auth } from "./firebase";  // Adjust the path if needed
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
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
          // Simulated API response (Replace with actual fetch from Firebase)
          const userProfile = {
            name: currentUser.displayName || "User",
            email: currentUser.email,
            offeredServices: ["offered service"],
            bio: "This is my bio.",
          };
          setProfile(userProfile);
          setFormData({
            bio: userProfile.bio,
            offeredServices: userProfile.offeredServices.join(", "),
          });
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
      bio: profile.bio,
      offeredServices: profile.offeredServices.join(", "),
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

      // Example Firebase update function (Replace with actual API call)
      // await updateUserProfile(user.uid, updatedProfile);

      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-container">
      <h2>Welcome, {profile.name}!</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {profile.email}</p>
        
        <p><strong>Offered Services:</strong></p>
        {isEditing ? (
          <input 
            type="text"
            value={formData.offeredServices}
            onChange={(e) => setFormData({ ...formData, offeredServices: e.target.value })}
          />
        ) : (
          <p>{profile.offeredServices.join(", ")}</p>
        )}

        <p><strong>Bio:</strong></p>
        {isEditing ? (
          <textarea 
            value={formData.bio} 
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
            rows="3"
          />
        ) : (
          <p>{profile.bio}</p>
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
