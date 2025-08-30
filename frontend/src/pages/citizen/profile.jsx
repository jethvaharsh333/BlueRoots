import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constant";
import axiosClient from "../../utils/axiosClient";
import toast from "react-hot-toast";
import { UserRound } from "lucide-react";
import { IconBadge } from "../../components/common/icon-badge";

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(BACKEND_URL + "/user/current");
                setUser(res.data.data);
                toast.success(res.data.data.message);
                console.log(res.data);
            } catch (error) {
                toast.success(error.response.data.data.message);
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    return (
        <>
        <div className="flex items-center gap-x-2 mb-2">
            <IconBadge icon={UserRound} />
            <h2 className="text-xl">
                Profile
            </h2>
        </div>
            {loading && <div>Loading...</div>}
            {user && (
                <div>
                    <h2>Name: {user.username}</h2>
                    
                </div>
            )}
        </>
    );
}

export default Profile;