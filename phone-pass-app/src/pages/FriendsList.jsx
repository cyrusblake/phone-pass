import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import { getUserFriends } from "../api/firestore";
import '../styles/components/friendslist.css';

const FriendsList = () => {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                if (user?.uid) {
                    const userFriends = await getUserFriends(user.uid);
                    setFriends(userFriends);
                }
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch friends:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [user]);

    if (loading) {
        return <div>Loading friends...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Navbar />
            <div className="friends-container">
                <h1 className="f1">Friends List</h1>
                
                {friends.length === 0 ? (
                    <p>You haven't added any friends yet.</p>
                ) : (
                    <div className="friends-grid">
                        {friends.map((friend, index) => (
                            <div key={index} className="friend-card">
                                <Link to={`/viewPage/${friend.userId}`}>
                                    <div className="friend-avatar">
                                        {/* Add avatar/image here */}
                                    </div>
                                    <h3 className="f-usernames">{friend.username}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
        </>
    );
};

export default FriendsList;