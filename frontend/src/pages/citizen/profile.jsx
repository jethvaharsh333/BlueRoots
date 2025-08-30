import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";
import { UserRound, Pencil, KeyRound } from "lucide-react";
import { IconBadge } from "../../components/common/icon-badge";
import UpdateProfile from "./update-profile";
import UpdatePassword from "./update-password"; // ✅ import new component

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false); // ✅ new state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(BACKEND_URL + "/user/current");
        console.log(res.data);
        setUser(res.data.data);
        toast.success(res.data.message);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-x-2 mb-4">
        <IconBadge icon={UserRound} />
        <h2 className="text-2xl font-bold text-green-900">My Profile</h2>
      </div>

      {/* Loading */}
      {loading && <div className="text-gray-500">Loading...</div>}

      {/* Profile Content */}
      {user && (
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6 relative">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-28 h-28 rounded-full border-4 border-green-200 shadow-md object-cover"
            />
          </div>

          {/* Info Grid */}
          {!isEditing && !isUpdatingPassword ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{user.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium">{user.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>

                <button
                  onClick={() => setIsUpdatingPassword(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <KeyRound size={18} />
                  Update Password
                </button>
              </div>
            </>
          ) : isEditing ? (
            <UpdateProfile
              user={user}
              setUser={setUser}
              onCancel={() => setIsEditing(false)}
              onSave={() => setIsEditing(false)}
            />
          ) : (
            <UpdatePassword
              onCancel={() => setIsUpdatingPassword(false)}
              onSave={() => setIsUpdatingPassword(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
