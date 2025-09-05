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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        /* API wiring placeholder */
        if (!cancelled) {
          setUser({
            id: id || "me",
            email: "john.doe@example.com",
            name: "John Doe",
            provider: "google",
            avatar: "",
            total_games: 45,
            total_stars: 120,
            total_time: 340,
            avg_move_time: 92,
            rank: 2,
          });
          // Recent games placeholder (replace with API)
          setRecentGames([
            { id: 'g1', date: '2025-09-01', type: 'Daily', time: 54, moves: 4, hints: 0, stars: 3 },
            { id: 'g2', date: '2025-08-31', type: 'Archive', time: 78, moves: 5, hints: 0, stars: 2 },
            { id: 'g3', date: '2025-08-30', type: 'Daily', time: 102, moves: 6, hints: 1, stars: 1 },
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
  const safeEmail = user?.email || "No email";
  const provider = user?.provider || "unknown";
  const totalStars = Number(user?.total_stars || 0);
  const totalGames = Number(user?.total_games || 0);
  const avgMove = Number(user?.avg_move_time || 0);
  const totalTime = Number(user?.total_time || 0);
  const rank = Number(user?.rank || 0);

  const formatSec = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Card */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
          {/* soft gradient backdrop inside card */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-200 to-sky-100 blur-2xl opacity-60"></div>
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-100 to-pink-100 blur-2xl opacity-60"></div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Avatar + Basic Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-indigo-300 to-sky-200 blur-md opacity-60"></div>
                <img
                  src={getAvatar(user?.avatar)}
                  alt={safeName}
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-indigo-200 shadow-md"
                />
                {getMedal(rank) && (
                  <span className="absolute -bottom-2 -right-2 text-3xl drop-shadow-md">
                    {getMedal(rank)}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{safeName}</h2>
                  {rank > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 font-semibold">Rank {rank}</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 break-all">{safeEmail}</span>
                  <span className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">{provider}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs inline-flex items-center gap-1"><span>★</span>{totalStars}</span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs">Games {totalGames}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs">Avg {avgMove}s</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (optional placeholders) */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition text-sm">Share</button>
              <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow">Edit</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-5xl mx-auto px-4 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Stars</div>
          <div className="text-3xl font-bold text-slate-800">{totalStars}</div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: `${Math.min(100, (totalStars / 200) * 100)}%` }}></div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Games</div>
          <div className="text-3xl font-bold text-slate-800">{totalGames}</div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-blue-500" style={{ width: `${Math.min(100, (totalGames / 100) * 100)}%` }}></div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Avg Move</div>
          <div className="text-3xl font-bold text-slate-800">{avgMove}s</div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500" style={{ width: `${Math.min(100, (120 / Math.max(1, avgMove)) * 100)}%` }}></div>
          </div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Total Time</div>
          <div className="text-3xl font-bold text-slate-800">{totalTime}s</div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500" style={{ width: `${Math.min(100, (totalTime / 600) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800">Achievements</h2>
            {rank > 0 && (
              <span className="text-sm px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100">Rank {rank} {getMedal(rank)}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs">Daily Streak • 5</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs">No Hints Master</span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs">Sub 60s Finish</span>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700">Recent Games</div>
            <div className="text-xs text-slate-500">Last {recentGames.length}</div>
          </div>
          {recentGames.length === 0 ? (
            <div className="px-6 py-8 text-slate-500 text-sm">No recent games.</div>
          ) : (
            recentGames.map((g) => (
              <div key={g.id} className="px-6 py-4 flex items-center justify-between border-b last:border-b-0 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${g.type === 'Daily' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>{g.type}</span>
                  <span className="text-sm text-slate-700">{g.date}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600">⏱ {formatSec(g.time)}</span>
                  <span className="text-slate-600">🎯 {g.moves} moves</span>
                  <span className="text-slate-600">💡 {g.hints} hints</span>
                  <span className="inline-flex items-center gap-1 text-amber-500 font-semibold"><span>★</span><span className="text-slate-800">{g.stars}</span></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Connections / Socials */}
      <div className="max-w-5xl mx-auto px-4 mt-4 mb-10">
        <div className="bg-white rounded-2xl shadow border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Connections</h2>
            <span className="text-xs text-slate-500">Manage linked accounts</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition text-sm">{provider}</button>
            <button className="px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-sm">LinkedIn</button>
            <button className="px-4 py-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition text-sm">Twitter / X</button>
            <button className="px-4 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition text-sm">Discord</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
