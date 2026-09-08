import { useState } from "react";
import { User, Lock, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useauth";
import { updateProfile, changePassword } from "../services/authService";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Profile() {
  const { user, login } = useAuth();

  const [profileData, setProfileData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileSaving(true);
    try {
      const data = await updateProfile(profileData);
      login(data.user);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 2500);
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 2500);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-dark mb-6">Profile Settings</h1>

      <div className="bg-white border border-sage/60 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-fern" />
          <h2 className="font-semibold text-dark">Personal Information</h2>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <Input label="Name" name="name" value={profileData.name} onChange={handleProfileChange} required />
          <Input label="Email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} required />

          {profileError && (
            <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{profileError}</p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" isLoading={profileSaving}>
              <span className="flex items-center gap-1.5">
                <Save size={15} />
                Save Changes
              </span>
            </Button>
            {profileSuccess && (
              <span className="flex items-center gap-1 text-fern text-sm">
                <CheckCircle2 size={15} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border border-sage/60 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-fern" />
          <h2 className="font-semibold text-dark">Change Password</h2>
        </div>

        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />

          {passwordError && (
            <p className="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{passwordError}</p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" isLoading={passwordSaving}>
              <span className="flex items-center gap-1.5">
                <Lock size={15} />
                Update Password
              </span>
            </Button>
            {passwordSuccess && (
              <span className="flex items-center gap-1 text-fern text-sm">
                <CheckCircle2 size={15} /> Updated
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}