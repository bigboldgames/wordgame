import React, { useEffect, useMemo, useState } from 'react';

const Archive = () => {
	const [items, setItems] = useState([]);
	const [playedIds, setPlayedIds] = useState(new Set());

	useEffect(() => {
		/*
		// Load archived challenges from API
		(async () => {
			const res = await fetch('/api/challenges/archive');
			const data = await res.json();
			// expected: [{ id, date, type: 'archive', stars, timeSec, moves, hints }]
			setItems(data);
		})();
		
		// Load user progress (played challenge IDs)
		(async () => {
			const res = await fetch('/api/user/progress');
			const data = await res.json();
			// expected: { playedIds: number[] }
			setPlayedIds(new Set(data.playedIds || []));
		})();
		*/

		// Fallback dummy data (only archive types for demo)
		const demo = [
			{ id: 2011, date: '2025-08-30', type: 'archive', stars: 3, timeSec: 52, moves: 4, hints: 0 },
			{ id: 2010, date: '2025-08-29', type: 'archive', stars: 2, timeSec: 81, moves: 5, hints: 0 },
			{ id: 2009, date: '2025-08-28', type: 'archive', stars: 1, timeSec: 110, moves: 6, hints: 1 },
			{ id: 2008, date: '2025-08-27', type: 'archive', stars: 3, timeSec: 49, moves: 4, hints: 0 },
			{ id: 2007, date: '2025-08-26', type: 'archive', stars: 2, timeSec: 70, moves: 5, hints: 0 },
		];
		setItems(demo);

		// Fallback dummy played
		setPlayedIds(new Set([2011, 2008]));
	}, []);

	const isPastDate = (iso) => {
		try {
			const d = new Date(iso + 'T00:00:00');
			const today = new Date();
			today.setHours(0,0,0,0);
			return d < today;
		} catch {
			return true;
		}
	};

	// Only archive type and only past dates
	const filtered = useMemo(() => {
		return items.filter((it) => it.type === 'archive' && isPastDate(it.date));
	}, [items]);

	const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			{/* Simple Header */}
			<div className='max-w-5xl mx-auto px-4 pt-10 pb-6'>
				<div className='text-center'>
					<h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800'>Archive Levels</h1>
					<p className='text-slate-600 mt-1'>All past levels (playable anytime)</p>
				</div>
			</div>

			{/* Listing */}
			<div className='max-w-5xl mx-auto px-4 pb-10'>
				<div className='overflow-hidden rounded-2xl border border-slate-200 shadow bg-white'>
					<div className='sticky top-0 z-10 bg-slate-50 border-b border-slate-200'>
						<div className='grid grid-cols-[90px_130px_120px_120px_120px_110px_120px] text-xs font-semibold text-slate-600 px-4 py-3'>
							<div>ID</div>
							<div>Date</div>
							<div>Time</div>
							<div>Moves</div>
							<div>Hints</div>
							<div>Status</div>
							<div className='text-right pr-2'>Action</div>
						</div>
					</div>

					{filtered.length === 0 ? (
						<div className='px-6 py-12 text-center text-slate-500 text-sm'>No archive levels.</div>
					) : (
						<div className='divide-y divide-slate-100'>
							{filtered.map((it, idx) => {
								const played = playedIds.has(it.id);
								return (
									<div key={it.id} className={`grid grid-cols-[90px_130px_120px_120px_120px_110px_120px] items-center px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
										<div className='font-semibold text-slate-800'>#{it.id}</div>
										<div className='text-sm text-slate-700'>{it.date}</div>
										<div className={`text-sm text-slate-700 ${!played ? 'opacity-50' : ''}`}>{played ? `⏱ ${formatTime(it.timeSec)}` : '-'}</div>
										<div className={`text-sm text-slate-700 ${!played ? 'opacity-50' : ''}`}>{played ? `🎯 ${it.moves}` : '-'}</div>
										<div className={`text-sm text-slate-700 ${!played ? 'opacity-50' : ''}`}>{played ? `💡 ${it.hints}` : '-'}</div>
										<div>
											<span className={`text-[11px] px-2 py-0.5 rounded-full border ${played ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>{played ? 'Played' : 'Unplayed'}</span>
										</div>
										<div className='text-right'>
											<a href={`/archive/${it.id}`} className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold transition ${played ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>{played ? 'Replay' : 'Play'}</a>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default Archive;
