import React, { useEffect, useMemo, useState } from 'react';

const Archive = () => {
	const [items, setItems] = useState([]);
	const [playedIds, setPlayedIds] = useState(new Set());

	useEffect(() => {
		/*
		// Load archived challenges from API
		(async () => {
			try {
				const res = await fetch('/api/challenges/archive');
				const data = await res.json();
				// Expected format: [{ id, date, words, categories, stars }]
				setItems(data);
			} catch (error) {
				console.error('Error loading archive data:', error);
			}
		})();
		*/

		// Demo data with real API structure
		const demo = [
			{ 
				id: 11, 
				date: "2025-08-31T00:00:00.000Z", 
				words: ["apple", "banana", "orange", "grape", "lion", "tiger", "dog", "cat", "red", "blue", "green", "yellow", "india", "china", "japan", "usa"], 
				categories: ["Fruits", "Animals", "Colors", "Countries"],
				stars: 2 
			},
			{ 
				id: 10, 
				date: "2025-08-30T00:00:00.000Z", 
				words: ["car", "bus", "train", "plane", "book", "pen", "pencil", "paper", "moon", "sun", "star", "cloud", "water", "fire", "earth", "air"], 
				categories: ["Transport", "Stationery", "Celestial", "Elements"],
				stars: 0 
			},
			{ 
				id: 9, 
				date: "2025-08-29T00:00:00.000Z", 
				words: ["pizza", "burger", "pasta", "salad", "tennis", "football", "basketball", "cricket", "spring", "summer", "autumn", "winter", "monday", "tuesday", "wednesday", "thursday"], 
				categories: ["Food", "Sports", "Seasons", "Days"],
				stars: 3 
			},
			{ 
				id: 8, 
				date: "2025-08-28T00:00:00.000Z", 
				words: ["guitar", "piano", "drums", "violin", "mountain", "river", "ocean", "desert", "doctor", "teacher", "engineer", "artist", "happy", "sad", "angry", "excited"], 
				categories: ["Instruments", "Landscapes", "Professions", "Emotions"],
				stars: 1 
			},
			{ 
				id: 7, 
				date: "2025-08-27T00:00:00.000Z", 
				words: ["coffee", "tea", "juice", "milk", "chair", "table", "bed", "sofa", "phone", "computer", "camera", "watch", "house", "apartment", "office", "school"], 
				categories: ["Beverages", "Furniture", "Electronics", "Buildings"],
				stars: 0 
			}
		];
		setItems(demo);

		// Determine played levels based on stars (stars > 0 means played)
		const playedIds = new Set(demo.filter(item => item.stars > 0).map(item => item.id));
		setPlayedIds(playedIds);
	}, []);

	const isPastDate = (iso) => {
		try {
			const d = new Date(iso);
			const today = new Date();
			today.setHours(0,0,0,0);
			return d < today;
		} catch {
			return true;
		}
	};

	// Filter past dates only (archive levels are always past dates)
	const filtered = useMemo(() => {
		return items.filter((it) => isPastDate(it.date));
	}, [items]);

	const formatDate = (iso) => {
		try {
			const date = new Date(iso);
			return date.toLocaleDateString('en-US', { 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric' 
			});
		} catch {
			return iso;
		}
	};

	const getStarsDisplay = (stars) => {
		return '★'.repeat(stars) + '☆'.repeat(3 - stars);
	};

	const getStatusText = (stars) => {
		if (stars === 0) return 'Not Played';
		if (stars === 1) return 'Played (1 Star)';
		if (stars === 2) return 'Played (2 Stars)';
		if (stars === 3) return 'Completed (3 Stars)';
		return 'Played';
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			{/* Header */}
			<div className='max-w-6xl mx-auto px-3 sm:px-4 pt-6 sm:pt-10 pb-4 sm:pb-6'>
				<div className='text-center'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-800'>Archive Levels</h2>
					<p className='text-sm sm:text-base text-slate-600 mt-1'>All past levels (playable anytime)</p>
				</div>
			</div>


			{/* Mobile Card Layout */}
			<div className='block sm:hidden max-w-6xl mx-auto px-3 pb-6'>
				{filtered.length === 0 ? (
					<div className='bg-white rounded-xl shadow-lg p-6 text-center'>
						<div className='text-4xl mb-3'>📚</div>
						<div className='text-slate-500 text-sm'>No archive levels available</div>
					</div>
				) : (
					<div className='space-y-2'>
						{filtered.map((it, idx) => {
							const played = it.stars > 0;
							return (
								<div key={it.id} className='bg-white rounded-lg shadow-md p-3 border border-slate-200'>
									{/* Header Row - Compact */}
									<div className='flex items-center justify-between mb-2'>
										<div className='flex items-center gap-2'>
											<span className='font-bold text-slate-800 text-base'>#{it.id}</span>
											<span className={`text-xs px-2 py-0.5 rounded-full ${played ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
												{played ? `${it.stars}★` : 'New'}
											</span>
										</div>
										<a 
											href={`/archive/${it.id}`} 
											className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${played 
												? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-md hover:shadow-lg' 
												: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
											}`}
										>
											<span>{played ? 'Replay' : 'Play'}</span>
											<svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</a>
									</div>

									{/* Date and Stars - Single Row */}
									<div className='flex items-center justify-between mb-2'>
										<div className='text-xs text-slate-600'>{formatDate(it.date)}</div>
										<div className='text-lg text-yellow-500'>
											{getStarsDisplay(it.stars)}
										</div>
									</div>

									{/* Categories - Compact */}
									<div className='flex flex-wrap gap-1 mb-2'>
										{it.categories.slice(0, 3).map((category, idx) => (
											<span key={idx} className='text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-200'>
												{category}
											</span>
										))}
										{it.categories.length > 3 && (
											<span className='text-xs text-slate-500 px-1'>+{it.categories.length - 3}</span>
										)}
									</div>

									{/* Words Count - Compact */}
									<div className='text-center text-slate-400 text-xs'>
										{it.words.length} words • {it.categories.length} categories
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Desktop Table Layout */}
			<div className='hidden sm:block max-w-6xl mx-auto px-4 pb-10'>
				<div className='overflow-hidden rounded-2xl border border-slate-200 shadow bg-white'>
					<div className='sticky top-0 z-10 bg-slate-50 border-b border-slate-200'>
						<div className='grid grid-cols-[80px_120px_100px_200px_120px] text-xs font-semibold text-slate-600 px-4 py-3'>
							<div>ID</div>
							<div>Date</div>
							<div>Stars</div>
							<div>Categories</div>
							{/* <div>Status</div> */}
							<div className='text-right pr-2'>Action</div>
						</div>
					</div>

					{filtered.length === 0 ? (
						<div className='px-6 py-12 text-center text-slate-500 text-sm'>No archive levels.</div>
					) : (
						<div className='divide-y divide-slate-100'>
							{filtered.map((it, idx) => {
								const played = it.stars > 0;
								return (
									<div key={it.id} className={`grid grid-cols-[80px_120px_100px_200px_120px] items-center px-4 py-3 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
										<div className='font-semibold text-slate-800'>#{it.id}</div>
										<div className='text-sm text-slate-700'>{formatDate(it.date)}</div>
										<div className='text-lg text-yellow-500'>
											{getStarsDisplay(it.stars)}
										</div>
										<div className='flex flex-wrap gap-1'>
											{it.categories.slice(0, 2).map((category, idx) => (
												<span key={idx} className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
													{category}
												</span>
											))}
											{it.categories.length > 2 && (
												<span className='text-xs text-slate-500'>+{it.categories.length - 2}</span>
											)}
										</div>
										{/* <div>
											<span className={`text-[11px] px-2 py-0.5 rounded-full border ${played ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
												{played ? 'Played' : 'Not Played'}
											</span>
										</div> */}
										<div className='text-right'>
											<a 
												href={`/archive/${it.id}`} 
												className={`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${played 
													? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-md hover:shadow-lg' 
													: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
												}`}
											>
												<span>{played ? 'Replay' : 'Play'}</span>
												<svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</a>
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
