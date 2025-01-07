import React from 'react';
import './Leaderboard.css'; // Ensure this includes styles for user avatars, ranks, etc.
import { useNavigate } from 'react-router-dom';
function LeaderUser(props) {
    const { avatar, name, rank, rating, positionChange, title, cfID } = props;
    const navigate = useNavigate();
    // Compare rating with the leaderboard
    // Rank color based on Codeforces rank
    const rankColor = getRankColor(title);

    // Handle user click to navigate to the user's Codeforces profile
    const handleUserClick = () => {
        navigate(`/get-codeforces-profile/${cfID}`);
    };
    const handleCodeforcesRedirect = () => {
        window.open(`https://codeforces.com/profile/${cfID}`, "_blank");
    };

    return (
        <div className="leader-box" onClick={handleUserClick}>
            <div className="leader-info">
                <img src={avatar} alt={`${name} Avatar`} className="user-avatar" />
                <b className='p-2 text-gray-600'>#{rank}</b><span className="leader-rank" style={{ color: rankColor }}>
                     {name}
                </span>
                
            </div>
            <button className='p-2 bg-transparent border-none' onClick={()=>{handleCodeforcesRedirect()}}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="code-forces"
                width="24"
                height="24"
            >
                <path fill="#F44336" d="M24 19.5V12a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 18 12v7.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z" />
                <path fill="#2196F3" d="M13.5 21a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 13.5 3h-3C9.673 3 9 3.672 9 4.5v15c0 .828.673 1.5 1.5 1.5h3z" />
                <path fill="#FFC107" d="M0 19.5c0 .828.673 1.5 1.5 1.5h3A1.5 1.5 0 0 0 6 19.5V9a1.5 1.5 0 0 0-1.5-1.5h-3C.673 7.5 0 8.172 0 9v10.5z" />
            </svg>
        </button>

            <div className="leader-rating">
            <div>
                {positionChange === 0 && (
                    <span style={{ color: 'gray' }}>
                        <span>&#8594;</span> 0
                    </span>
                )}
                {positionChange > 0 && (
                    <span style={{ color: 'green' }}>
                        <span>&#9650;</span> +{positionChange}
                    </span>
                )}
                {positionChange < 0 && (
                    <span style={{ color: 'red' }}>
                        <span>&#9660;</span> {positionChange}
                    </span>
                )}
            </div>
            </div>
        </div>
    );
}

function getRankColor(rank) {
    switch(rank) {
        case 'newbie': return 'gray';
        case 'pupil': return 'green';
        case 'specialist': return 'cyan';
        case 'expert': return 'blue';
        case 'candidate master': return 'purple';
        case 'master': return 'orange';
        case 'international master': return 'red';
        case 'grandmaster': return 'darkred';
        case 'international grandmaster': return 'darkred';
        case 'legendary grandmaster': return 'darkred';
        default: return 'black';
    }
}

export default LeaderUser;
