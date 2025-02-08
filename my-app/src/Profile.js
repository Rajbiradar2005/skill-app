import React, { useEffect, useState } from "react";
import { auth, db, setDoc, doc, getDoc } from "./firebase";  // Import Firestore methods
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

  // Fetch user profile data from Firestore
  useEffect(() => {
    const fetchProfile = async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);

          // Reference the user profile in Firestore
          const profileRef = doc(db, "profiles", currentUser.uid);  // Path to Firestore user profile
          const docSnapshot = await getDoc(profileRef);

          if (docSnapshot.exists()) {
            // If profile exists in Firestore, update the state with data
            const userProfile = docSnapshot.data();
            setProfile(userProfile);
            setFormData({
              bio: userProfile.bio || "",
              offeredServices: userProfile.offeredServices?.join(", ") || "",
            });
          } else {
            // If profile doesn't exist, set default profile data
            setProfile({
              name: currentUser.displayName || "User",
              email: currentUser.email,
              offeredServices: [],
              bio: "",
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
      bio: profile?.bio || "",
      offeredServices: profile?.offeredServices?.join(", ") || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        ...profile,
        bio: formData.bio,
        offeredServices: formData.offeredServices.split(",").map((s) => s.trim()), // Convert to array
      };

      // Save the updated profile to Firestore
      await setDoc(doc(db, "profiles", user.uid), updatedProfile);

      setProfile(updatedProfile);
      setIsEditing(false);
      alert("Profile saved successfully!");
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
