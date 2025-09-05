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

  // 🔹 API se leaderboard data fetch karna yaha hoga
  useEffect(() => {
    // Example API call (replace with your API)
    // fetch("/api/leaderboard")
    //   .then(res => res.json())
    //   .then(data => setPlayers(data));

    // 🔹 Abhi ke liye dummy data
    const data = [
      {
        id: 1,
        name: "John Doe",
        stars: 120,
        totalGames: 45,
        avgTime: "1m 32s",
        avatar: "",
      },
      {
        id: 2,
        name: "Emma Stone",
        stars: 110,
        totalGames: 39,
        avgTime: "1m 50s",
        avatar: "",
      },
      {
        id: 3,
        name: "Michael Smith",
        stars: 100,
        totalGames: 50,
        avgTime: "2m 05s",
        avatar: "",
      },
      {
        id: 4,
        name: "Sophia Lee",
        stars: 95,
        totalGames: 36,
        avgTime: "2m 20s",
        avatar: "",
      },
      {
        id: 5,
        name: "David Kim",
        stars: 90,
        totalGames: 41,
        avgTime: "2m 10s",
        avatar: "",
      },
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
                <a key={p.id} href={`/profile/${p.id}`} className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${bg} p-5 shadow-sm hover:shadow-md transition`}> 
                  <div className="absolute -top-8 -right-8 text-6xl opacity-20 group-hover:opacity-30 transition">{medal}</div>
                  <div className="flex items-center gap-4">
                    <img src={getAvatar(p.avatar)} alt={p.name} className={`w-16 h-16 rounded-full ring-4 ${ring} shadow`} />
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-800 truncate">{medal} {p.name}</h3>
                      <p className="text-xs text-slate-500">{p.totalGames} Games • Avg {p.avgTime}</p>
                      <div className="mt-2 inline-flex items-center gap-1 text-amber-500 font-semibold">
                        <span>★</span><span className="text-slate-800">{p.stars}</span>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Leaderboard List */}
          <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">All Players</div>
              <div className="text-xs text-slate-500">Updated just now</div>
            </div>

            {rest.map((player, index) => {
              const rank = index + 4; // after top 3
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
                        {player.totalGames} Games • Avg {player.avgTime}
                      </p>
                    </div>
                  </div>

                  {/* Stars + Badges */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                      <span>★</span>
                      <span className="text-slate-800">{player.stars}</span>
                    </span>
                    {player.avgTime && (
                      <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {player.avgTime}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
