import React, { useState, useEffect } from 'react';

const GameBoard = ({ challenge = 'daily', challengeId }) => {
	// Default fallback data (used until API data arrives)
	const defaultGameData = {
		id: 1,
		date: "2025-09-01T00:00:00.000Z",
		words: [
			"apple", "banana", "orange", "grape",
			"lion", "tiger", "dog", "cat",
			"red", "blue", "green", "yellow",
			"india", "china", "japan", "usa"
		],
		categories: ["Fruits", "Animals", "Colors", "Countries"]
	};

	// Game data (can be replaced by API response)
	const [gameData, setGameData] = useState(defaultGameData);

	// Word to category mapping
	const wordToCategory = {
		"apple": "Fruits", "banana": "Fruits", "orange": "Fruits", "grape": "Fruits",
		"lion": "Animals", "tiger": "Animals", "dog": "Animals", "cat": "Animals",
		"red": "Colors", "blue": "Colors", "green": "Colors", "yellow": "Colors",
		"india": "Countries", "china": "Countries", "japan": "Countries", "usa": "Countries"
	};

	// Word meanings
	const wordMeanings = {
		"apple": "A sweet fruit that grows on trees",
		"banana": "A yellow curved fruit rich in potassium",
		"orange": "A citrus fruit with vitamin C",
		"grape": "Small round fruits that grow in clusters",
		"lion": "The king of the jungle, a large cat",
		"tiger": "A large striped cat, the largest cat species",
		"dog": "Man's best friend, a loyal pet animal",
		"cat": "A small furry pet that purrs",
		"red": "The color of blood and roses",
		"blue": "The color of the sky and ocean",
		"green": "The color of grass and leaves",
		"yellow": "The color of the sun and bananas",
		"india": "A country in South Asia with diverse culture",
		"china": "The most populous country in the world",
		"japan": "An island nation known for technology",
		"usa": "United States of America, a North American country"
	};

	// Game state
	const [time, setTime] = useState(0);
	const [selectedWords, setSelectedWords] = useState([]);
	const [shuffledWords, setShuffledWords] = useState([]);
	const [foundCategories, setFoundCategories] = useState([]);
	const [hints, setHints] = useState(2);
	const [gameStatus, setGameStatus] = useState('playing');
	const [hintedWords, setHintedWords] = useState([]);
	const [attempts, setAttempts] = useState(0);
	const [timerActive, setTimerActive] = useState(true);
	const [showWordMeanings, setShowWordMeanings] = useState(false);
	const [lastFoundCategory, setLastFoundCategory] = useState(null);
	const [incorrectWords, setIncorrectWords] = useState([]);
	const [correctFlashWords, setCorrectFlashWords] = useState([]);
	const [revealedStars, setRevealedStars] = useState(0);

	// Load challenge data from API based on prop
	useEffect(() => {
		/*
		// Example with fetch
		(async () => {
			try {
				const base = challenge === 'daily' ? '/api/challenges/daily' : '/api/challenges/archive';
				const endpoint = challengeId ? `${base}/${challengeId}` : base;
				const res = await fetch(endpoint, { method: 'GET' });
				if (!res.ok) throw new Error('Failed to load challenge');
				const data = await res.json();
				setGameData({ id: data.id, date: data.date, words: data.words, categories: data.categories });
				// reset game state after loading
				setTime(0);
				setSelectedWords([]);
				setFoundCategories([]);
				setHints(2);
				setGameStatus('playing');
				setHintedWords([]);
				setAttempts(0);
				setTimerActive(true);
				setShowWordMeanings(false);
				setLastFoundCategory(null);
				setIncorrectWords([]);
				setCorrectFlashWords([]);
				setRevealedStars(0);
			} catch (e) {
				// Handle error: keep fallback data or show a toast
				console.error(e);
			}
		})();

		// Example with axios
		// import axios from 'axios'
		// (async () => {
		//   const endpoint = challenge === 'daily' ? '/api/challenges/daily' : '/api/challenges/archive';
		//   const { data } = await axios.get(endpoint);
		//   setGameData({ id: data.id, date: data.date, words: data.words, categories: data.categories });
		// })();
		*/
	}, [challenge, challengeId]);

	// Shuffle words whenever gameData changes
	useEffect(() => {
		const shuffled = [...gameData.words].sort(() => Math.random() - 0.5);
		setShuffledWords(shuffled);
	}, [gameData]);

	// Timer effect
	useEffect(() => {
		if (!timerActive) {
			return;
		}
		
		const timer = setInterval(() => {
			setTime(prev => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timerActive]);

	// Format time
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	// Compute stars based on rules
	const computeStars = () => {
		const hintsUsed = 2 - hints;
		let stars = 0;
		if (time < 60) stars += 1;
		if (hintsUsed === 0) stars += 1;
		if (attempts <= 5) stars += 1;
		return { stars, hintsUsed };
	};

	// Reveal stars one-by-one once finished
	useEffect(() => {
		if (gameStatus === 'won') {
			setRevealedStars(0);
			const { stars } = computeStars();
			let shown = 0;
			const interval = setInterval(() => {
				shown += 1;
				setRevealedStars(prev => (prev < stars ? prev + 1 : prev));
				if (shown >= stars) clearInterval(interval);
			}, 450);
			return () => clearInterval(interval);
		}
	}, [gameStatus]);

	// Handle word selection
	const handleWordClick = (word) => {
		if (selectedWords.length >= 4 || selectedWords.includes(word)) return;
		
		const newSelected = [...selectedWords, word];
		setSelectedWords(newSelected);

		// Check if 4 words are selected
		if (newSelected.length === 4) {
			setAttempts(prev => prev + 1);
			checkCategory(newSelected);
		}
	};

	// Check if selected words form a valid category
	const checkCategory = (words) => {
		const categories = words.map(word => wordToCategory[word]);
		const uniqueCategories = [...new Set(categories)];

		if (uniqueCategories.length === 1) {
			// Correct category found
			const category = uniqueCategories[0];
			setFoundCategories(prev => [...prev, category]);
			setSelectedWords([]);
			setLastFoundCategory(category);
			setCorrectFlashWords(words);
			setTimeout(() => setLastFoundCategory(null), 2000);
			setTimeout(() => setCorrectFlashWords([]), 2000);
			
			// Check if all categories found
			if (foundCategories.length + 1 === gameData.categories.length) {
				setTimerActive(false);
				setGameStatus('won');
				setShowWordMeanings(true);

				/*
				// SEND GAME FINISH EVENT
				// Use this block to notify your backend when game finishes
				(async () => {
					try {
						const { stars, hintsUsed } = computeStars();
						const payload = {
							challengeType: challenge, // 'daily' or 'archive'
							challengeId: gameData.id,
							elapsedSeconds: time,
							attempts,
							hintsUsed,
							stars,
							completedAt: new Date().toISOString(),
						};
						const endpoint = challenge === 'daily' 
							? '/api/challenges/daily/finish' 
							: '/api/challenges/archive/finish';
						await fetch(endpoint, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(payload)
						});
					} catch (e) {
						console.error('Failed to report finish', e);
					}
				})();
				*/
			}
		} else {
			// Wrong selection
			setIncorrectWords(words);
			setTimeout(() => {
				setIncorrectWords([]);
				setSelectedWords([]);
			}, 2000);
		}
	};

	// Use hint
	const useHint = () => {
		if (hints > 0 && gameStatus === 'playing') {
			setHints(prev => prev - 1);
			
			// Find remaining categories
			const remainingCategories = gameData.categories.filter(cat => !foundCategories.includes(cat));
			
			if (remainingCategories.length > 0) {
				// Pick a random remaining category
				const categoryToHint = remainingCategories[Math.floor(Math.random() * remainingCategories.length)];
				
				// Find all words in that category that haven't been found yet
				const wordsInCategory = gameData.words.filter(word => {
					return wordToCategory[word] === categoryToHint && !isWordFound(word);
				});
				
				if (wordsInCategory.length > 0) {
					// Pick 2 random words from the category to highlight
					const wordsToHint = wordsInCategory
						.sort(() => Math.random() - 0.5)
						.slice(0, Math.min(2, wordsInCategory.length));
					
					setHintedWords(wordsToHint);
					// Clear hint after 5 seconds
					setTimeout(() => {
						setHintedWords([]);
					}, 5000);
				}
			}
		}
	};

	// Check if word is already found
	const isWordFound = (word) => {
		return foundCategories.includes(wordToCategory[word]);
	};

	// Get words for a specific category
	const getWordsForCategory = (category) => {
		return gameData.words.filter(word => wordToCategory[word] === category);
	};

	const { stars, hintsUsed } = computeStars();
	const metTime = time < 60;
	const metHints = hintsUsed === 0;
	const metMoves = attempts <= 5;
	// removed totalRevealedToShow; we always render 3 stars with gray placeholders

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4'>
			<div className='max-w-4xl mx-auto'>
				{/* Header */}
				<div className='text-center mb-8'>
					<h1 className='text-4xl font-bold text-gray-800 mb-2'>
						{challenge === 'daily' ? 'Daily Challenge' : 'Archive Challenge'} #{gameData.id}
					</h1>
					<p className='text-gray-600'>Find 4 words that belong to the same category</p>
				</div>

				{/* Game Stats */}
				<div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
					<div className='flex justify-between items-center'>
						<div className='flex gap-6'>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 bg-blue-500 rounded-full'></div>
								<span className='text-lg font-semibold text-gray-700'>
									{formatTime(time)}
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
								<span className='text-lg font-semibold text-gray-700'>
									{hints} hints
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 bg-green-500 rounded-full'></div>
								<span className='text-lg font-semibold text-gray-700'>
									{foundCategories.length}/4 found
								</span>
							</div>
						</div>
						<button 
							onClick={useHint}
							disabled={hints === 0 || gameStatus !== 'playing'}
							className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Use Hint
						</button>
					</div>
				</div>

				{/* Word Grid */}
				<div className={`relative rounded-2xl shadow-lg p-6 mb-6 bg-white transition-all duration-500 ${gameStatus === 'won' ? 'ring-4 ring-green-300 scale-[1.01]' : ''}`}>
					{/* shimmer/confetti overlay on finish */}
					{gameStatus === 'won' && (
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-2xl'>
							<div className='absolute -top-10 left-0 w-full h-10 bg-[repeating-linear-gradient(90deg,rgba(34,197,94,0.2)_0_12px,transparent_12px_24px)] animate-[slideDown_900ms_ease-out_forwards]'></div>
						</div>
					)}
					<h3 className='text-xl font-semibold text-gray-800 mb-6 text-center'>Word Grid</h3>
					<div className='grid grid-cols-4 gap-4'>
						{shuffledWords.map((word, index) => {
							const isSelected = selectedWords.includes(word);
							const isFound = isWordFound(word);
							const isHinted = hintedWords.includes(word);
							const isIncorrect = incorrectWords.includes(word);
							const isCorrectFlash = correctFlashWords.includes(word);
							
							return (
								<button
									key={index}
									onClick={() => handleWordClick(word)}
									disabled={isFound}
									className={`
										p-4 rounded-xl text-center font-semibold text-lg transition-all duration-300 transform relative
										${isIncorrect
											? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse'
											: isSelected 
												? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110 animate-pulse' 
												: isFound
													? `bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ${isCorrectFlash ? 'animate-pulse' : ''}`
													: isHinted
														? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg animate-pulse'
														: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 shadow-md hover:scale-105'
										}
										${isFound ? 'cursor-not-allowed' : 'cursor-pointer'}
									`}
								>
									{word}
									{isHinted && (
										<div className='absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center'>
											<span className='text-xs'>💡</span>
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Performance Summary (shown when finished) */}
				{gameStatus === 'won' && (
					<div className='bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-xl font-bold text-gray-800'>Your Performance</h3>
							<span className={`px-3 py-1 rounded-full text-xs font-semibold ${challenge === 'daily' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
								{challenge === 'daily' ? 'Daily' : 'Archive'}
							</span>
						</div>

						{/* Stars row centered with shine */}
						<div className='relative overflow-hidden rounded-xl mb-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-100'>
							<div className='absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.25),transparent_40%)]'></div>
							<div className='flex items-center justify-center gap-3 px-6 py-5'>
								{[0,1,2].map((i) => {
									const isRevealed = i < revealedStars && i < stars;
									return (
										<span
											key={i}
											className={`relative text-4xl md:text-5xl transition-all duration-500 ease-out transform 
												${isRevealed 
													? 'text-yellow-400 drop-shadow-[0_0_16px_rgba(251,191,36,0.9)] scale-110 rotate-0 opacity-100' 
													: 'text-gray-300 opacity-100 scale-100 rotate-0'}`}
											style={{ transitionDelay: `${i * 120}ms` }}
										>
											★
											{isRevealed && (
												<span className='pointer-events-none absolute inset-0 overflow-hidden rounded-full' aria-hidden>
													<span className='absolute -left-10 top-0 h-full w-6 rotate-12 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-[shine_900ms_ease-out]' />
												</span>
											)}
										</span>
									);
								})}
							</div>
						</div>

						{/* Stat cards */}
						<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
							<div className='rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm'>
								<div className='text-xs uppercase tracking-wide text-gray-500 mb-1'>Time</div>
								<div className='text-2xl font-bold text-gray-800'>{formatTime(time)}</div>
								<div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${metTime ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
									{metTime ? '✓ Under 1 min' : '≥ 1 min'}
								</div>
							</div>
							<div className='rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm'>
								<div className='text-xs uppercase tracking-wide text-gray-500 mb-1'>Hints Used</div>
								<div className='text-2xl font-bold text-gray-800'>{hintsUsed}</div>
								<div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${metHints ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
									{metHints ? '✓ No hints' : 'Hints used'}
								</div>
							</div>
							<div className='rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm'>
								<div className='text-xs uppercase tracking-wide text-gray-500 mb-1'>Moves</div>
								<div className='text-2xl font-bold text-gray-800'>{attempts}</div>
								<div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${metMoves ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
									{metMoves ? '✓ ≤ 5 moves' : '> 5 moves'}
								</div>
							</div>
						</div>

						<p className='text-xs text-gray-500 mt-4 text-center'>Stars: under 1 min, no hints used, moves ≤ 5.</p>
					</div>
				)}

				{/* Found Categories with Words (moved below grid) */}
				{foundCategories.length > 0 && (
					<div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
						<h3 className='text-xl font-semibold text-gray-800 mb-4'>Found Categories</h3>
						<div className='space-y-4'>
							{foundCategories.map((category, index) => (
								<div 
									key={index} 
									className={`bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 transition-all duration-500 ${lastFoundCategory === category ? 'ring-2 ring-green-400 animate-pulse' : ''}`}
								>
									<div className='flex items-center gap-3 mb-2'>
										<div className='bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full font-semibold text-sm'>
											{category}
										</div>
										<span className='text-gray-600 text-sm'>Words:</span>
									</div>
									<div className='flex gap-2 flex-wrap'>
										{getWordsForCategory(category).map((word, wordIndex) => (
											<div key={wordIndex} className='bg-white border border-green-300 text-green-800 px-3 py-1 rounded-lg font-medium text-sm shadow-sm'>
												{word}
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Word Meanings */}
				{showWordMeanings && (
					<div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
						<h3 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Word Meanings</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
							{gameData.words.map((word, index) => (
								<div key={index} className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4'>
									<div className='font-semibold text-blue-800 text-lg mb-2'>{word}</div>
									<div className='text-gray-600 text-sm'>{wordMeanings[word]}</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Game Status */}
				{gameStatus === 'won' && (
					<div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
						<div className='text-6xl mb-4'>🎉</div>
						<h2 className='text-3xl font-bold text-green-600 mb-4'>Congratulations!</h2>
						<div className='bg-gray-50 rounded-xl p-4 mb-6'>
							<p className='text-lg text-gray-700 mb-2'>Final Statistics:</p>
							<div className='flex justify-center gap-6 text-sm'>
								<div className='text-center'>
									<div className='font-semibold text-blue-600'>Time</div>
									<div className='text-gray-600'>{formatTime(time)}</div>
								</div>
								<div className='text-center'>
									<div className='font-semibold text-purple-600'>Attempts</div>
									<div className='text-gray-600'>{attempts}</div>
								</div>
								<div className='text-center'>
									<div className='font-semibold text-green-600'>Hints Used</div>
									<div className='text-gray-600'>{hintsUsed}</div>
								</div>
							</div>
						</div>
						<button 
							onClick={() => window.location.reload()}
							className='bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
						>
							Play Again
						</button>
					</div>
				)}
			</div>
		</div>
	);
}


export default GameBoard;
