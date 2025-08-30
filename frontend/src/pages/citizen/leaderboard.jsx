import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constant";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/leaderboard`);
        if (res.data.success) {
          // sort in descending order by ecoPoints
          const sortedData = res.data.data.sort((a, b) => b.ecoPoints - a.ecoPoints);
          setLeaders(sortedData);
        } else {
          setError("Failed to fetch leaderboard");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-center">Loading leaderboard...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">🌍 Leaderboard</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Eco Points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-50`}
              >
                <td className="px-4 py-2 font-medium">{index + 1}</td>
                <td className="px-4 py-2">{leader.name}</td>
                <td className="px-4 py-2">{leader.ecoPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;