import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const user ={
    email: "devitsingh"
  }

  // 🔹 Random dummy avatar (jab avatar na mile)
  const getAvatar = (avatar) => {
    if (avatar && avatar.trim() !== "") return avatar;
    const randomNum = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/100?img=${randomNum}`;
  };

  // 🔹 Format time from seconds to readable format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // 🔹 Format average move time
  const formatAvgMoveTime = (avgMoveTime) => {
    return `${avgMoveTime}s`;
  };

  // 🔹 Calculate average time per game
  const getAvgTimePerGame = (totalTime, totalGames) => {
    if (totalGames === 0) return "0s";
    const avgSeconds = Math.round(totalTime / totalGames);
    return formatTime(avgSeconds);
  };

  // 🔹 API se leaderboard data fetch karna yaha hoga
  useEffect(() => {
    /*
    // Example API call (replace with your API)
    fetch("/api/leaderboard")
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching leaderboard:', err));
    */

    // 🔹 Demo data with real API structure
    const data = [
      {
        id: "u1",
        name: "Alice",
        total_games: 10,
        total_stars: 150,
        total_time: 3600,
        avg_move_time: 12,
        rank: 1
      },
      {
        id: "u2", 
        name: "Bob",
        total_games: 9,
        total_stars: 140,
        total_time: 4000,
        avg_move_time: 14,
        rank: 2
      },
      {
        id: "u3",
        name: "Charlie",
        total_games: 12,
        total_stars: 135,
        total_time: 3800,
        avg_move_time: 11,
        rank: 3
      },
      {
        id: "u4",
        name: "Diana",
        total_games: 8,
        total_stars: 120,
        total_time: 4200,
        avg_move_time: 15,
        rank: 4
      },
      {
        id: "u5",
        name: "Eve",
        total_games: 11,
        total_stars: 115,
        total_time: 4500,
        avg_move_time: 13,
        rank: 5
      },
      {
        id: "u6",
        name: "Frank",
        total_games: 7,
        total_stars: 100,
        total_time: 5000,
        avg_move_time: 18,
        rank: 6
      },
      {
        id: "u7",
        name: "Grace",
        total_games: 9,
        total_stars: 95,
        total_time: 4800,
        avg_move_time: 16,
        rank: 7
      },
      {
        id: "u8",
        name: "Henry",
        total_games: 6,
        total_stars: 85,
        total_time: 5200,
        avg_move_time: 20,
        rank: 8
      }
    ];
    setPlayers(data);
  }, []);

  if (players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 bg-gradient-to-br from-blue-50 to-indigo-100">
        Loading leaderboard...
      </div>
    );
  }

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="game-Main relative">
      {!user?.email && (
        <div className="userCheck absolute h-full top-0 bg-[#000000a4] backdrop-blur-md w-full left-0 flex justify-center items-center py-3 px-3 flex-col z-20">
          <h3 className="text-white text-center font-semibold text-2xl max-w-[400px] pb-6">
            Log in to see where you rank on the leaderboard
          </h3>
          <Link
            to="/login"
            className="bg-[#1b7fff] py-3 px-10 rounded-lg transform transition active:scale-95 duration-150 shadow-md hover:shadow-lg"
          >
            <p className="text-white text-[20px]">Login</p>
          </Link>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Global Leaderboard</h1>
            <p className="text-gray-600">See the top players by stars, games, and time</p>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {top3.map((p, idx) => {
              const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
              const ring = idx === 0 ? 'ring-yellow-300' : idx === 1 ? 'ring-slate-300' : 'ring-amber-800';
              const bg = idx === 0 ? 'from-yellow-50 to-amber-50' : idx === 1 ? 'from-slate-50 to-slate-100' : 'from-amber-50 to-orange-50';
              return (
                <a key={p.id} href={`/profile/${p.id}`} className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${bg} p-4 sm:p-5 shadow-sm hover:shadow-md transition`}> 
                  <div className="absolute -top-6 -right-6 text-4xl sm:text-6xl opacity-20 group-hover:opacity-30 transition">{medal}</div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src={getAvatar(p.avatar)} alt={p.name} className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-4 ${ring} shadow`} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{medal} {p.name}</h3>
                      <p className="text-xs text-slate-500">{p.total_games} Games • Avg {getAvgTimePerGame(p.total_time, p.total_games)}</p>
                      <div className="mt-1 sm:mt-2 flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                          <span>★</span><span className="text-slate-800">{p.total_stars}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatAvgMoveTime(p.avg_move_time)}/move
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Leaderboard List */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">All Players</div>
              <div className="text-xs text-slate-500">Updated just now</div>
            </div>

            {/* Mobile Card Layout */}
            <div className="block sm:hidden">
              {rest.map((player, index) => {
                const rank = player.rank;
                const isTop = rank <= 10;
                return (
                  <a
                    key={player.id}
                    href={`/profile/${player.id}`}
                    className="block p-4 hover:bg-slate-50 transition duration-200 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank */}
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${isTop ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                        {rank}
                      </div>

                      {/* Profile */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={getAvatar(player.avatar)}
                          alt={player.name}
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <h2 className="text-sm font-medium text-slate-800 truncate">
                            {player.name}
                          </h2>
                          <p className="text-xs text-slate-500">
                            {player.total_games} Games • {getAvgTimePerGame(player.total_time, player.total_games)} avg
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 text-amber-500 font-semibold text-sm">
                          <span>★</span>
                          <span className="text-slate-800">{player.total_stars}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {formatAvgMoveTime(player.avg_move_time)}/move
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden sm:block">
              {rest.map((player, index) => {
                const rank = player.rank;
                const isTop = rank <= 10;
                return (
                  <a
                    key={player.id}
                    href={`/profile/${player.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition duration-200 border-b last:border-b-0"
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold ${isTop ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                      {rank}
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-4 flex-1 ml-4 min-w-0">
                      <img
                        src={getAvatar(player.avatar)}
                        alt={player.name}
                        className="w-10 h-10 rounded-full border border-slate-200"
                      />
                      <div className="min-w-0">
                        <h2 className="text-sm font-medium text-slate-800 truncate">
                          {player.name}
                        </h2>
                        <p className="text-xs text-slate-500 truncate">
                          {player.total_games} Games • {getAvgTimePerGame(player.total_time, player.total_games)} avg
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                          <span>★</span>
                          <span className="text-slate-800">{player.total_stars}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatTime(player.total_time)} total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-slate-700">
                          {formatAvgMoveTime(player.avg_move_time)}
                        </div>
                        <div className="text-xs text-slate-500">per move</div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
