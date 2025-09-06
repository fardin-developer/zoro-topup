import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [tab, setTab] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [lastMonthData, setLastMonthData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch leaderboard data from API
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://api.zorotopup.com/api/v1/user/leaderboard"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform current month data
      const transformedCurrentMonth = data.currentMonth.leaderboard.map(
        (item) => ({
          fname: item.name || item.email,
          totalSpent: item.totalPurchaseAmount,
          totalOrders: item.purchaseCount,
          _id: item._id,
        })
      );

      // Transform last month data
      const transformedLastMonth = data.lastMonth.leaderboard.map((item) => ({
        fname: item.name || item.email,
        totalSpent: item.totalPurchaseAmount,
        totalOrders: item.purchaseCount,
        _id: item._id,
      }));

      setCurrentMonthData(transformedCurrentMonth);
      setLastMonthData(transformedLastMonth);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard data");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const getRandomAvatar = (index) => {
    const avatars = [
      "https://randomuser.me/api/portraits/men/12.jpg",
      "https://randomuser.me/api/portraits/men/11.jpg",
      "https://randomuser.me/api/portraits/women/11.jpg",
      "https://randomuser.me/api/portraits/men/14.jpg",
      "https://randomuser.me/api/portraits/men/15.jpg",
      "https://randomuser.me/api/portraits/women/12.jpg",
      "https://randomuser.me/api/portraits/women/13.jpg",
      "https://randomuser.me/api/portraits/women/14.jpg",
    ];
    return avatars[index % avatars.length];
  };

  const calculateCountdown = () => {
    const nextMonthStart = new Date();
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1, 1);
    nextMonthStart.setHours(0, 0, 0, 0);

    const now = new Date();
    const timeDiff = nextMonthStart - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    fetchLeaderboardData();

    const countdownInterval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading Leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>Error</h2>
        <p style={styles.errorMessage}>{error}</p>
        <button onClick={fetchLeaderboardData} style={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Leaderboard</h1>
          <div style={styles.tabButtons}>
            <button
              onClick={() => setTab(0)}
              style={{
                ...styles.tabButton,
                ...(tab === 0 ? styles.activeTab : styles.inactiveTab),
              }}
            >
              Active Month
            </button>
            <button
              onClick={() => setTab(1)}
              style={{
                ...styles.tabButton,
                ...(tab === 1 ? styles.activeTab : styles.inactiveTab),
              }}
            >
              Past Month
            </button>
          </div>
        </div>

        {tab === 0 ? (
          <>
            {/* Top 3 Podium */}
            {currentMonthData && currentMonthData.length >= 3 && (
              <div className="mobile-podium-container" style={styles.podiumContainer}>
                {/* 2nd Place */}
                <div className="mobile-podium-item" style={styles.podiumItem}>
                  <div
                    className="mobile-avatar-container"
                    style={{
                      ...styles.avatarContainer,
                      border: "3px solid #3b82f6",
                      borderRadius: "50%",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={getRandomAvatar(1)}
                      className="podium-avatar"
                      style={{
                        ...styles.avatar,
                        width: "140px",
                        height: "140px",
                        border: "none",
                      }}
                      alt={currentMonthData[1]?.fname}
                    />
                    <div className="mobile-medal" style={styles.medal}>🥈</div>
                  </div>
                  <p
                    className="mobile-player-name"
                    style={{
                      ...styles.playerName,
                      ...styles.secondPlaceName,
                    }}
                  >
                    {currentMonthData[1]?.fname}
                  </p>
                  <p
                    className="mobile-player-amount"
                    style={{
                      ...styles.playerAmount,
                      ...styles.secondPlaceAmount,
                    }}
                  >
                    ₹{currentMonthData[1]?.totalSpent}
                  </p>
                </div>

                {/* 1st Place */}
                <div className="mobile-podium-item mobile-first-place" style={{ ...styles.podiumItem, ...styles.firstPlaceContainer }}>
                  <div
                    className="mobile-avatar-container"
                    style={{
                      ...styles.avatarContainer,
                      border: "3px solid #eab308",
                      borderRadius: "50%",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={getRandomAvatar(0)}
                      className="podium-avatar-first"
                      style={{
                        ...styles.avatar,
                        width: "160px",
                        height: "160px",
                        border: "none",
                      }}
                      alt={currentMonthData[0]?.fname}
                    />
                    <div className="mobile-medal" style={styles.medal}>👑</div>
                  </div>
                  <p
                    className="mobile-player-name"
                    style={{
                      ...styles.playerName,
                      ...styles.firstPlaceName,
                    }}
                  >
                    {currentMonthData[0]?.fname}
                  </p>
                  <p
                    className="mobile-player-amount"
                    style={{
                      ...styles.playerAmount,
                      ...styles.firstPlaceAmount,
                    }}
                  >
                    ₹{currentMonthData[0]?.totalSpent}
                  </p>
                </div>

                {/* 3rd Place */}
                <div className="mobile-podium-item" style={styles.podiumItem}>
                  <div
                    className="mobile-avatar-container"
                    style={{
                      ...styles.avatarContainer,
                      border: "3px solid #22c55e",
                      borderRadius: "50%",
                      padding: "2px",
                    }}
                  >
                    <img
                      src={getRandomAvatar(2)}
                      className="podium-avatar"
                      style={{
                        ...styles.avatar,
                        width: "140px",
                        height: "140px",
                        border: "none",
                      }}
                      alt={currentMonthData[2]?.fname}
                    />
                    <div className="mobile-medal" style={styles.medal}>🥉</div>
                  </div>
                  <p
                    className="mobile-player-name"
                    style={{
                      ...styles.playerName,
                      ...styles.thirdPlaceName,
                    }}
                  >
                    {currentMonthData[2]?.fname}
                  </p>
                  <p
                    className="mobile-player-amount"
                    style={{
                      ...styles.playerAmount,
                      ...styles.thirdPlaceAmount,
                    }}
                  >
                    ₹{currentMonthData[2]?.totalSpent}
                  </p>
                </div>
              </div>
            )}

            {/* Rank Table - Starting from 4th place */}
            {currentMonthData && currentMonthData.length > 3 ? (
              <div style={styles.tableContainer} className="leaderboard-table">
                {/* Table Header */}
                <div style={styles.tableHeader} className="table-header">
                  <div>Rank</div>
                  <div style={styles.nameColumn}>Name</div>
                  <div>Orders</div>
                  <div>Amount</div>
                </div>

                {/* Table Rows - Starting from 4th place */}
                <div style={styles.tableBody}>
                  {currentMonthData.slice(3).map((item, index) => (
                    <div key={item._id || index + 4} style={styles.tableRow} className="table-row">
                      <div>{index + 4}</div>
                      <div style={styles.nameColumn}>
                        <div style={styles.nameWithAvatar} className="name-with-avatar">
                          <img
                            src={getRandomAvatar(index + 3)}
                            style={styles.rowAvatar}
                            className="row-avatar"
                            alt={item?.fname}
                          />
                          <span style={styles.fnameSpan} className="fname-span">{item?.fname}</span>
                        </div>
                      </div>
                      <div>{item?.totalOrders}</div>
                      <div>₹{item?.totalSpent}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentMonthData &&
              currentMonthData.length > 0 &&
              currentMonthData.length <= 3 ? (
              <div style={styles.noRecord}>
                <h5>NO MORE RECORDS</h5>
              </div>
            ) : (
              <div style={styles.noRecord}>
                <h5>NO RECORD</h5>
              </div>
            )}
          </>
        ) : (
          <div style={styles.pastMonthContainer} className="past-month-container">
            <div style={styles.pastMonthList} className="past-month-list">
              {lastMonthData && lastMonthData.length > 0 ? (
                lastMonthData.map((item, index) => (
                  <div key={item._id || index} style={styles.winnerItem} className="past-month-winner-item">
                    <div style={styles.winnerInfo} className="past-month-winner-info">
                      <div style={styles.winnerRank} className="past-month-winner-rank">{index + 1}</div>
                      <span style={styles.winnerName} className="past-month-winner-name">{item.fname}</span>
                    </div>
                    <div style={styles.winnerPrize} className="past-month-winner-prize">₹{item.totalSpent}</div>
                  </div>
                ))
              ) : (
                <div style={styles.noRecord}>
                  <h5>NO RECORD</h5>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    fontFamily: 'Orbitron, sans-serif',
    backgroundColor: '#0d0d0d',
    color: 'white',
    padding: '16px 20px',
    minHeight: '100vh',
    margin: '0 auto'
  },
  loadingContainer: {
    fontFamily: 'Orbitron, sans-serif',
    backgroundColor: '#0d0d0d',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 31, 90, 0.3)',
    borderTop: '4px solid #ff1f5a',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '60px',
    padding: '20px 0'
  },
  title: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '2.5rem',
    lineHeight: '3rem',
    color: 'white',
    marginBottom: '32px',
    textShadow: '0 0 20px #ff1f5a'
  },
  tabButtons: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  tabButton: {
    color: 'white',
    padding: '12px 32px',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  activeTab: {
    backgroundColor: '#dc2626',
    border: '2px solid #ff1f5a',
    boxShadow: '0 0 10px #ff1f5a'
  },
  inactiveTab: {
    backgroundColor: '#000000',
    border: '1px solid white'
  },
  podiumContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end',
    gap: '40px',
    marginBottom: '60px',
    flexWrap: 'wrap',
    padding: '40px 20px'
  },
  podiumItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  firstPlaceContainer: {
    backgroundColor: '#1c1c1c',
    padding: '24px',
    borderRadius: '16px',
    border: '3px solid #ff1f5a',
    boxShadow: '0 0 30px #ff1f5a, inset 0 0 20px rgba(255, 31, 90, 0.1)',
    transform: 'scale(1.1)',
    position: 'relative'
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: '8px'
  },
  avatar: {
    borderRadius: '50%'
  },
  firstPlaceAvatar: {
    width: '112px',
    height: '112px'
  },
  secondPlaceAvatar: {
    width: '96px', 
    height: '96px'
  },
  thirdPlaceAvatar: {
    width: '96px',
    height: '96px'
  },
  medal: {
    position: 'absolute',
    top: '-30px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '3rem',
    textShadow: '0 0 10px currentColor'
  },
  playerName: {
    marginTop: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    margin: '8px 0 4px 0',
    fontFamily: 'Orbitron, sans-serif',
    textAlign: 'center'
  },
  firstPlaceName: {
    color: '#eab308',
    fontSize: '1.25rem',
    fontWeight: '700'
  },
  secondPlaceName: {
    color: '#60a5fa',
    fontSize: '1.1rem',
    fontWeight: '600'
  },
  thirdPlaceName: {
    color: '#4ade80',
    fontSize: '1.1rem',
    fontWeight: '600'
  },
  playerAmount: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: "700",
    textAlign: 'center'
  },
  firstPlaceAmount: {
    color: '#eab308',
    fontSize: '1.125rem',
    fontWeight: '800'
  },
  secondPlaceAmount: {
    color: '#60a5fa',
    fontSize: '1rem',
    fontWeight: '700'
  },
  thirdPlaceAmount: {
    color: '#4ade80',
    fontSize: '1rem',
    fontWeight: '700'
  },
  tableContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    overflowX: 'auto',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #333'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 100px 120px',
    color: '#f87171',
    fontSize: '1rem',
    fontWeight: '600',
    borderBottom: '2px solid #dc2626',
    paddingBottom: '16px',
    marginBottom: '20px',
    gap: '16px',
    padding: '0 16px'
  },
  nameColumn: {
    gridColumn: 'span 1'
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 100px 120px',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #ff1f5a',
    boxShadow: '0 0 15px rgba(255, 31, 90, 0.3)',
    cursor: 'pointer',
    gap: '16px',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    backgroundColor: '#252525',
    transition: 'all 0.3s ease',
    marginBottom: '12px'
  },
  nameWithAvatar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Orbitron, sans-serif'
  },
  fnameSpan: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: '500'
  },
  rowAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '2px solid #ff1f5a'
  },
  pastMonthContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px'
  },
  pastMonthList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  winnerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    border: '2px solid #ff1f5a',
    boxShadow: '0 5px 15px rgba(255, 31, 90, 0.2)',
    transition: 'all 0.3s ease'
  },
  winnerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  winnerRank: {
    background: 'linear-gradient(135deg, #ff1f5a 0%, #dc2626 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '25px',
    fontWeight: 'bold',
    minWidth: '40px',
    textAlign: 'center',
    fontSize: '1.1rem',
    boxShadow: '0 0 10px rgba(255, 31, 90, 0.5)'
  },
  winnerName: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem'
  },
  winnerPrize: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: '1.3rem',
    textShadow: '0 0 10px #ffd700'
  },
  noRecord: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888',
    fontSize: '1.2rem',
    fontWeight: '500'
  },
  errorContainer: {
    fontFamily: 'Orbitron, sans-serif',
    backgroundColor: '#0d0d0d',
    color: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  errorTitle: {
    color: '#ff1f5a',
    fontSize: '2rem',
    marginBottom: '16px'
  },
  errorMessage: {
    color: '#ccc',
    fontSize: '1.1rem',
    marginBottom: '24px',
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: '#ff1f5a',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'Orbitron, sans-serif',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(255, 31, 90, 0.3)'
  }
};
export default Leaderboard;
