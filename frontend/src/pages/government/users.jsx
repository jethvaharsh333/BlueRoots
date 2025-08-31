import { useEffect, useState } from "react";
import axiosClient from "../../utils/axiosClient";
import { BACKEND_URL } from "../../constant";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosClient.get(`${BACKEND_URL}/user/`);
        if (res.data.success) {
          setUsers(res.data.data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading users...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="border rounded-xl shadow-md hover:shadow-lg transition p-5 bg-white flex flex-col items-center text-center"
          >
            {/* Avatar */}
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-gray-200"
            />

            {/* Username + Email */}
            <h2 className="text-lg font-semibold">{user.username}</h2>
            <p className="text-sm text-gray-600 mb-3">{user.email}</p>

            {/* User Details */}
            <div className="w-full text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Gender:</span> {user.gender}
              </p>
              <p>
                <span className="font-medium">Account Type:</span>{" "}
                {user.accountType}
              </p>
              <p>
                <span className="font-medium">Eco Points:</span>{" "}
                <span className="text-green-600 font-semibold">{user.ecoPoints}</span>
              </p>
              <p>
                <span className="font-medium">Email Verified:</span>{" "}
                {user.isEmailVerified ? (
                  <span className="text-green-600 font-semibold">Yes ✅</span>
                ) : (
                  <span className="text-red-500 font-semibold">No ❌</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;