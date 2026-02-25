// pages/Settings.jsx
import { useAuth } from "../PropertyDetails/AuthContext";
import "./Settings.css"
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate()

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirm) {
      console.log("delete account");
      try {
        const result = await fetch("http://localhost:5000/api/deleteAccount", {
          method: "DELETE",
          credentials: "include"
        })
        const res = await result.json()
        console.log(res);
        if (res) {
          await checkAuth()
          navigate("/")
        }

      } catch (err) {
        console.log(err)

      }
    }
  };

  return (
    <div className="settings-page">
      <h1 className="page-title">Account Settings</h1>

      {/* PROFILE */}
      <div className="card">
        <h2>Profile</h2>

        <div className="info">
          <label>Name</label>
          <input type="text" defaultValue={user?.name} />
        </div>

        <div className="info">
          <label>Email</label>
          <input type="email" defaultValue={user?.email} disabled />
        </div>

        <button className="save-btn">Save Changes</button>
      </div>

      {/* PASSWORD */}
      <div className="card">
        <h2>Change Password</h2>

        <div className="info">
          <label>Current Password</label>
          <input type="password" />
        </div>

        <div className="info">
          <label>New Password</label>
          <input type="password" />
        </div>

        <button className="save-btn">Update Password</button>
      </div>

      {/* DANGER ZONE */}
      <div className="card danger">
        <h2>Danger Zone</h2>
        <p>Once you delete your account, there is no going back.</p>

        <button className="delete-btn" onClick={handleDelete}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
