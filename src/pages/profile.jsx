import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentGames, setRecentGames] = useState([]);

  const getAvatar = (avatar) => {
    if (avatar && String(avatar).trim() !== "") return avatar;
    const randomNum = Math.floor(Math.random() * 70) + 1;
    return `https://i.pravatar.cc/150?img=${randomNum}`;
  };

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  // Format time from seconds to readable format
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

  // Calculate average time per game
  const getAvgTimePerGame = (totalTime, totalGames) => {
    if (totalGames === 0) return "0s";
    const avgSeconds = Math.round(totalTime / totalGames);
    return formatTime(avgSeconds);
  };

  // Get rank display text
  const getRankText = (rank) => {
    if (rank <= 0) return "Unranked";
    if (rank === 1) return "1st Place";
    if (rank === 2) return "2nd Place";
    if (rank === 3) return "3rd Place";
    return `#${rank}`;
  };

  // Get rank color
  const getRankColor = (rank) => {
    if (rank <= 0) return "bg-slate-100 text-slate-600";
    if (rank <= 3) return "bg-yellow-100 text-yellow-700";
    if (rank <= 10) return "bg-indigo-100 text-indigo-700";
    if (rank <= 50) return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        /*
        // Real API call
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) throw new Error('User not found');
        const userData = await response.json();
        if (!cancelled) {
          setUser(userData);
        }
        */

        // Demo data with real API structure
        if (!cancelled) {
          setUser({
            id: id || "uuid",
            name: "Gokul",
            avatar: "https://i.pravatar.cc/150?img=1",
            total_games: 5,
            total_stars: 12,
            total_time: 600,
            avg_move_time: 20,
            rank: 37
          });
          
          // Recent games placeholder (replace with API)
          setRecentGames([
            { id: 'g1', date: '2025-09-01', type: 'Daily', time: 54, moves: 4, hints: 0, stars: 3 },
            { id: 'g2', date: '2025-08-31', type: 'Archive', time: 78, moves: 5, hints: 0, stars: 2 },
            { id: 'g3', date: '2025-08-30', type: 'Daily', time: 102, moves: 6, hints: 1, stars: 1 },
            { id: 'g4', date: '2025-08-29', type: 'Daily', time: 45, moves: 3, hints: 0, stars: 3 },
            { id: 'g5', date: '2025-08-28', type: 'Archive', time: 67, moves: 4, hints: 1, stars: 2 },
          ]);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setUser({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 bg-gradient-to-br from-blue-50 to-indigo-100">
        Loading profile...
      </div>
    );
  }

  const safeName = user?.name || "Anonymous";
  const totalStars = Number(user?.total_stars || 0);
  const totalGames = Number(user?.total_games || 0);
  const avgMove = Number(user?.avg_move_time || 0);
  const totalTime = Number(user?.total_time || 0);
  const rank = Number(user?.rank || 0);

  const formatSec = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
          {/* Animated background gradients */}
          <div className="pointer-events-none absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 blur-3xl opacity-40 animate-pulse"></div>
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-tr from-pink-200 to-amber-200 blur-3xl opacity-40 animate-pulse delay-1000"></div>

          <div className="relative">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 blur-lg opacity-60"></div>
                  <img
                    src={getAvatar(user?.avatar)}
                    alt={safeName}
                    className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl"
                  />
                  {getMedal(rank) && (
                    <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow-lg">
                      {getMedal(rank)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mt-4">{safeName}</h2>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getRankColor(rank)}`}>
                  {getRankText(rank)}
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-200">
                  <div className="text-xs text-amber-600 font-medium mb-1">Total Stars</div>
                  <div className="text-2xl font-bold text-amber-700">{totalStars}</div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-3 border border-indigo-200">
                  <div className="text-xs text-indigo-600 font-medium mb-1">Games Played</div>
                  <div className="text-2xl font-bold text-indigo-700">{totalGames}</div>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
                  Share Profile
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="relative">
                  <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 blur-lg opacity-60"></div>
                  <img
                    src={getAvatar(user?.avatar)}
                    alt={safeName}
                    className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover ring-4 ring-white shadow-xl"
                  />
                  {getMedal(rank) && (
                    <span className="absolute -bottom-2 -right-2 text-2xl lg:text-3xl drop-shadow-lg">
                      {getMedal(rank)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800">{safeName}</h2>
                    <div className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${getRankColor(rank)}`}>
                      {getRankText(rank)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-slate-600 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      {totalStars} Stars
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                      {totalGames} Games
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      {formatTime(totalTime)} Total
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="flex items-center gap-2 lg:gap-3">
                <button className="px-4 lg:px-6 py-2 lg:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base">
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Stars Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl border border-amber-200 p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl sm:text-2xl">⭐</span>
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Total Stars</div>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-700 mb-2 sm:mb-3">{totalStars}</div>
              <div className="h-1.5 sm:h-2 w-full bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min(100, (totalStars / 200) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Games Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl sm:rounded-2xl border border-indigo-200 p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl sm:text-2xl">🎮</span>
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Games Played</div>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-700 mb-2 sm:mb-3">{totalGames}</div>
              <div className="h-1.5 sm:h-2 w-full bg-indigo-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min(100, (totalGames / 100) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Avg Move Time Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl border border-emerald-200 p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl sm:text-2xl">⚡</span>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Avg Move</div>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700 mb-2 sm:mb-3">{avgMove}s</div>
              <div className="h-1.5 sm:h-2 w-full bg-emerald-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min(100, (120 / Math.max(1, avgMove)) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Total Time Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl sm:rounded-2xl border border-pink-200 p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl sm:text-2xl">⏱️</span>
                <div className="text-xs font-semibold text-pink-600 uppercase tracking-wide">Total Time</div>
              </div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-pink-700 mb-2 sm:mb-3">{formatTime(totalTime)}</div>
              <div className="h-1.5 sm:h-2 w-full bg-pink-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-1000" 
                     style={{ width: `${Math.min(100, (totalTime / 3600) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">Achievements</h2>
            </div>
            {rank > 0 && (
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getRankColor(rank)}`}>
                {getRankText(rank)} {getMedal(rank)}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg sm:rounded-xl border border-indigo-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl">🔥</span>
                <div>
                  <div className="font-semibold text-indigo-700 text-sm">Daily Streak</div>
                  <div className="text-xs text-indigo-600">5 days in a row</div>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg sm:rounded-xl border border-emerald-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl">🧠</span>
                <div>
                  <div className="font-semibold text-emerald-700 text-sm">No Hints Master</div>
                  <div className="text-xs text-emerald-600">Completed without hints</div>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg sm:rounded-xl border border-amber-200 p-3 sm:p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl">⚡</span>
                <div>
                  <div className="font-semibold text-amber-700 text-sm">Speed Demon</div>
                  <div className="text-xs text-amber-600">Sub 60s finish</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <div className="text-lg font-bold text-slate-800">Recent Games</div>
                <div className="text-xs text-slate-500">Last {recentGames.length} games played</div>
              </div>
            </div>
          </div>
          {recentGames.length === 0 ? (
            <div className="px-4 sm:px-6 py-12 text-center">
              <span className="text-4xl mb-4 block">🎯</span>
              <div className="text-slate-500 text-sm">No recent games played yet.</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentGames.map((g, index) => (
                <div key={g.id} className="group px-4 sm:px-6 py-4 hover:bg-slate-50 transition-all duration-200">
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${g.type === 'Daily' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {g.type}
                        </span>
                        <span className="text-xs text-slate-600">{g.date}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <span>★</span><span>{g.stars}</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⏱️</span>
                        <span className="truncate">{formatSec(g.time)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🎯</span>
                        <span className="truncate">{g.moves}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">💡</span>
                        <span className="truncate">{g.hints}h</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${g.type === 'Daily' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {g.type}
                      </span>
                      <span className="text-sm text-slate-700 font-medium">{g.date}</span>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>⏱️</span>
                        <span className="font-medium">{formatSec(g.time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>🎯</span>
                        <span className="font-medium">{g.moves} moves</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span>💡</span>
                        <span className="font-medium">{g.hints} hints</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                        <span>★</span><span>{g.stars}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8"></div>
    </div>
  );
};

export default Profile;
