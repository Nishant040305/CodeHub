import React, { useEffect, useState } from 'react';
import '../pages.css';
import './Leaderboard.css';
import axios from 'axios';
import NavSpace from '../../components/NavSpace';
import Spinner from '../../components/Spinner/Spinner';
import Alert from '../../components/Alert/Alert';
import Footer from '../../components/Footer/Footer';
import { useSelector } from 'react-redux';
import LeaderUser from './LeaderUser';

export default function Leaderboard() {
    const { user } = useSelector((state) => state.auth);
    const [PageHtml, setPageHtml] = useState(<>
        <NavSpace />
        <Spinner />
    </>);

    // Function to sort users by their ratings (new or usual)
    const sortUsersByRating = (userBoardInfo, userRatingsKey) => {
        return [...userBoardInfo].sort((a, b) => {
            const aRating = a[userRatingsKey] || 0;
            const bRating = b[userRatingsKey] || 0;
            return bRating - aRating; // Sort in descending order
        });
    };

    const updatePageHtml = async () => {
        try {
            const leaderboardAPIResponse = await axios.post(
                `${process.env.REACT_APP_SERVER_BASE_URL}/leaderboard`,
                { cfID: user.cfID },
                { withCredentials: true }
            );

            const userBoardInfo = leaderboardAPIResponse.data.data;

            // Get the latest contest ID
            const contests = await axios.get('https://codeforces.com/api/contest.list');
            const latestContest = contests.data.result.find((contest) => contest.phase === 'FINISHED');
            const latestContestId = latestContest.id;

            // Get ratings from the latest contest
            const ratingChanges = await axios.get(`https://codeforces.com/api/contest.ratingChanges?contestId=${latestContestId}`);
            const participants = ratingChanges.data.result;
            console.log(participants);
            // Fetch user info for usual ratings
            const userRatings = await Promise.all(
                userBoardInfo.map(async (user) => {
                    const userInfo = await axios.get(`https://codeforces.com/api/user.info?handles=${user.cfID}`);
                    const userDetails = userInfo.data.result[0];
                    console.log(userDetails);
                    return {
                        cfID: user.cfID,
                        avatar:userDetails.avatar,
                        rank:userDetails.rank,
                        usualRating: userDetails.rating || 0,
                        newRating: participants.find((p) => p.handle === user.cfID)?.newRating || 0,
                    };
                })
            );

            // Sort users by new ratings and usual ratings
            userRatings.sort((a, b) => b.usualRating - a.usualRating);
            const sortedByNewRating = sortUsersByRating(userRatings, 'newRating');
            const sortedByUsualRating = sortUsersByRating(userRatings, 'usualRating');

            // Calculate position changes
            const leaderComponents = sortedByNewRating.map((user, index) => {
                const oldPosition = sortedByUsualRating.findIndex((u) => u.cfID === user.cfID) + 1;
                const newPosition = index + 1;
                const positionChange = oldPosition-newPosition;
                console.log(user);
                return (
                    <LeaderUser
                        key={user.cfID}
                        // rank={newPosition}
                        name={user.cfID}
                        avatar={user.avatar}
                        title={user.rank}
                        cfID={user.cfID}
                        rating={user.newRating}
                        positionChange={positionChange}
                    />
                );
            });

            setPageHtml(<>
                <div>
                    <div className="background-pink-blue">
                        <NavSpace />
                        <div className="leader-heading mt-5 ml-3">Leaderboard</div>
                        <p style={{ textAlign: 'center' }}>
                            Rankings are based on the latest contest results. Ratings of inactive participants are considered 0.
                        </p>
                        <div>{leaderComponents}</div>
                    </div>
                    <Footer />
                </div>
            </>);
        } catch (err) {
            setPageHtml(
                <>
                    <NavSpace />
                    <div
                        className="background-pink-blue"
                        style={{
                            minHeight: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Alert heading="Couldn't fetch data" body="Check your internet connection and try again.." />
                    </div>
                </>
            );
        }
    };

    useEffect(() => {
        updatePageHtml();
    }, []);

    return <>{PageHtml}</>;
}
