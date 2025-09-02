import { useEffect, useState } from "react";

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
            <div style={styles.podiumContainer}>
              {/* 2nd Place */}
              <div style={styles.podiumItem}>
                <div
                  style={{
                    ...styles.avatarContainer,
                    border: "4px solid #3b82f6",
                    borderRadius: "50%",
                    padding: "4px",
                  }}
                >
                  <img
                    src={getRandomAvatar(1)}
                    style={{
                      ...styles.avatar,
                      width: "96px",
                      height: "96px",
                      border: "none",
                    }}
                    alt={currentMonthData[1]?.fname}
                  />
                  <div style={styles.medal}>🥈</div>
                </div>
                <p
                  style={{
                    ...styles.playerName,
                    ...styles.secondPlaceName,
                  }}
                >
                  {currentMonthData[1]?.fname}
                </p>
                <p
                  style={{
                    ...styles.playerAmount,
                    ...styles.secondPlaceAmount,
                  }}
                >
                  ₹{currentMonthData[1]?.totalSpent}
                </p>
              </div>

              {/* 1st Place */}
              <div style={{ ...styles.podiumItem, ...styles.firstPlaceContainer }}>
                <div
                  style={{
                    ...styles.avatarContainer,
                    border: "4px solid #eab308",
                    borderRadius: "50%",
                    padding: "4px",
                  }}
                >
                  <img
                    src={getRandomAvatar(0)}
                    style={{
                      ...styles.avatar,
                      width: "112px",
                      height: "112px",
                      border: "none",
                    }}
                    alt={currentMonthData[0]?.fname}
                  />
                  <div style={styles.medal}>👑</div>
                </div>
                <p
                  style={{
                    ...styles.playerName,
                    ...styles.firstPlaceName,
                  }}
                >
                  {currentMonthData[0]?.fname}
                </p>
                <p
                  style={{
                    ...styles.playerAmount,
                    ...styles.firstPlaceAmount,
                  }}
                >
                  ₹{currentMonthData[0]?.totalSpent}
                </p>
              </div>

              {/* 3rd Place */}
              <div style={styles.podiumItem}>
                <div
                  style={{
                    ...styles.avatarContainer,
                    border: "4px solid #22c55e",
                    borderRadius: "50%",
                    padding: "4px",
                  }}
                >
                  <img
                    src={getRandomAvatar(2)}
                    style={{
                      ...styles.avatar,
                      width: "96px",
                      height: "96px",
                      border: "none",
                    }}
                    alt={currentMonthData[2]?.fname}
                  />
                  <div style={styles.medal}>🥉</div>
                </div>
                <p
                  style={{
                    ...styles.playerName,
                    ...styles.thirdPlaceName,
                  }}
                >
                  {currentMonthData[2]?.fname}
                </p>
                <p
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
            <div style={styles.tableContainer}>
              {/* Table Header */}
              <div style={styles.tableHeader}>
                <div>Rank</div>
                <div style={styles.nameColumn}>Name</div>
                <div>Orders</div>
                <div>Amount</div>
              </div>

              {/* Table Rows - Starting from 4th place */}
              <div style={styles.tableBody}>
                {currentMonthData.slice(3).map((item, index) => (
                  <div key={item._id || index + 4} style={styles.tableRow}>
                    <div>{index + 4}</div>
                    <div style={styles.nameColumn}>
                      <div style={styles.nameWithAvatar}>
                        <img
                          src={getRandomAvatar(index + 3)}
                          style={styles.rowAvatar}
                          alt={item?.fname}
                        />
                        <span style={styles.fnameSpan}>{item?.fname}</span>
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
        <div style={styles.pastMonthContainer}>
          <div style={styles.pastMonthList}>
            {lastMonthData && lastMonthData.length > 0 ? (
              lastMonthData.map((item, index) => (
                <div key={item._id || index} style={styles.winnerItem}>
                  <div style={styles.winnerInfo}>
                    <div style={styles.winnerRank}>{index + 1}</div>
                    <span style={styles.winnerName}>{item.fname}</span>
                  </div>
                  <div style={styles.winnerPrize}>₹{item.totalSpent}</div>
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
  );
};

const styles = {
  container: {
    fontFamily: 'Orbitron, sans-serif',
    backgroundColor: '#0d0d0d',
    color: 'white',
    padding: '16px 40px'
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
    marginBottom: '40px'
  },
  title: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
    // fontWeight: 'bold',
    color: 'white',
    marginBottom: '24px',
    // textShadow: '0 0 10px #ff1f5a, 0 0 20px #ff1f5a'
  },
  tabButtons: {
    display: 'inline-flex',
    gap: '16px',
    marginBottom: '40px'
  },
  tabButton: {
    color: 'white',
    padding: '8px 24px',
    borderRadius: '9999px',
    cursor: 'pointer',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    fontWeight: '500'
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
    alignItems: 'center',
    gap: '64px',
    marginBottom: '28px',
    flexWrap: 'wrap'
  },
  podiumItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  firstPlaceContainer: {
    backgroundColor: '#1c1c1c',
    padding: '24px',
    borderRadius: '8px',
    border: '2px solid #ff1f5a',
    boxShadow: '0 0 10px #ff1f5a'
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
    top: '-24px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '2rem'
  },
  playerName: {
    marginTop: '8px',
    fontSize: '1.125rem',
    fontWeight: '600',
    margin: '8px 0 4px 0',
    fontFamily: 'Orbitron, sans-serif'
  },
  firstPlaceName: {
    color: '#eab308',
    fontSize: '1.25rem'
  },
  secondPlaceName: {
    color: '#60a5fa'
  },
  thirdPlaceName: {
    color: '#4ade80'
  },
  playerAmount: {
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    fontWeight: "700"
  },
  firstPlaceAmount: {
    color: '#eab308',
    fontSize: '1.125rem'
  },
  secondPlaceAmount: {
    color: '#60a5fa'
  },
  thirdPlaceAmount: {
    color: '#4ade80'
  },
  tableContainer: {
    maxWidth: '768px',
    margin: '0 auto'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    color: '#f87171',
    fontSize: '0.875rem',
    borderBottom: '1px solid #dc2626',
    paddingBottom: '8px',
    marginBottom: '12px',
    gap: '16px',
    padding: '0 8px'
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
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '6px',
    border: '2px solid #ff1f5a',
    boxShadow: '0 0 10px #ff1f5a',
    cursor: 'pointer',
    gap: '16px',
    fontFamily: 'Orbitron, sans-serif'
  },
  nameWithAvatar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'Orbitron, sans-serif'
  },
  fnameSpan: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.875rem'
  },
  rowAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%'
  },
  pastMonthContainer: {
    maxWidth: '512px',
    margin: '0 auto'
  },
  pastMonthList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  winnerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '8px',
    background: '#1a1a1a',
    border: '1px solid #333'
  },
  winnerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  winnerRank: {
    background: '#ff1f5a',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 'bold',
    minWidth: '30px',
    textAlign: 'center'
  },
  winnerName: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Orbitron, sans-serif'
  },
  winnerPrize: {
    color: '#ffd700',
    fontWeight: 'bold',
    fontSize: '1.1rem'
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
