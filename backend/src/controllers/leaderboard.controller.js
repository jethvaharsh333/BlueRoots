import { UserRole } from "../models/user-role.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getLeaderboardPoints = async (req, res) => {
    const leaderboard = await UserRole.aggregate([
        {
            $lookup: {
                from: "users", // collection name for User
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "roles", // collection name for Role
                localField: "roleId",
                foreignField: "_id",
                as: "role"
            }
        },
        { $unwind: "$role" },
        {
            $match: {
                "role.roleName": "CITIZEN"
            }
        },
        {
            $sort: { "user.ecoPoints": -1 }
        },
        { $limit: 10 },
        {
            $project: {
                _id: 0,
                name: "$user.username",
                ecoPoints: "$user.ecoPoints"
            }
        }
    ]);

    return ApiResponse.success(leaderboard, "Leaderboard fetched successfully.").send(res);
}

export { getLeaderboardPoints }