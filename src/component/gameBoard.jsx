import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const GameBoard = ({ challenge = 'daily' }) => {
	// Extract challengeId from URL parameters
	const { id: urlChallengeId } = useParams();
	const location = useLocation();
	
	// Get challengeId from URL params or query string
	const challengeId = urlChallengeId || new URLSearchParams(location.search).get('challengeId');
	
	// Debug logging
	console.log('GameBoard Debug:', {
		challenge,
		urlChallengeId,
		challengeId,
		pathname: location.pathname,
		search: location.search
	});
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

	// Word meanings - will be fetched from API
	const [wordMeanings, setWordMeanings] = useState({});
	const [loadingMeanings, setLoadingMeanings] = useState(false);

	// Fetch word meanings from dictionary API
	const fetchWordMeanings = async () => {
		setLoadingMeanings(true);
		const meanings = {};
		
		for (const word of gameData.words) {
			try {
				const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
				if (response.ok) {
					const data = await response.json();
					if (data[0] && data[0].meanings && data[0].meanings[0] && data[0].meanings[0].definitions && data[0].meanings[0].definitions[0]) {
						meanings[word] = data[0].meanings[0].definitions[0].definition;
					} else {
						meanings[word] = `Definition for "${word}" not found`;
					}
				} else {
					meanings[word] = `Definition for "${word}" not available`;
				}
			} catch (error) {
				console.error(`Error fetching definition for ${word}:`, error);
				meanings[word] = `Definition for "${word}" not available`;
			}
		}
		
		setWordMeanings(meanings);
		setLoadingMeanings(false);
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

	// Check if daily challenge is already completed today
	const checkDailyChallengeStatus = () => {
		if (challenge !== 'daily') return false;
		
		const today = new Date().toDateString();
		const savedData = localStorage.getItem(`dailyChallenge_${today}`);
		
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);
				return parsedData.completed;
			} catch (e) {
				console.error('Error parsing saved daily challenge data:', e);
			}
		}
		return false;
	};

	// Get saved daily challenge data
	const getSavedDailyChallengeData = () => {
		if (challenge !== 'daily') return null;
		
		const today = new Date().toDateString();
		const savedData = localStorage.getItem(`dailyChallenge_${today}`);
		
		if (savedData) {
			try {
				return JSON.parse(savedData);
			} catch (e) {
				console.error('Error parsing saved daily challenge data:', e);
			}
		}
		return null;
	};

	// Save daily challenge completion data
	const saveDailyChallengeData = (completionData) => {
		if (challenge !== 'daily') return;
		
		const today = new Date().toDateString();
		const dataToSave = {
			completed: true,
			completedAt: new Date().toISOString(),
			...completionData
		};
		
		localStorage.setItem(`dailyChallenge_${today}`, JSON.stringify(dataToSave));
	};

	// Load challenge data from API based on prop
	useEffect(() => {
		const loadChallengeData = async () => {
			try {
				// Check if daily challenge is already completed
				if (challenge === 'daily' && checkDailyChallengeStatus()) {
					const savedData = getSavedDailyChallengeData();
					if (savedData) {
						// Show finished state for completed daily challenge
						setGameStatus('completed');
						setTime(savedData.time_taken || 0);
						setFoundCategories(savedData.categories || []);
						setHints(savedData.hints || 0);
						setAttempts(savedData.moves || 0);
						setRevealedStars(savedData.stars || 0);
						setTimerActive(false);
						return;
					}
				}

				// Determine which API to call based on challenge type
				if (challenge === 'archive') {
					// Archive challenge API call - when user comes from archive
					const base = '/api/challenges/archive';
					const endpoint = challengeId ? `${base}/${challengeId}` : base;
					const res = await fetch(endpoint, { method: 'GET' });
					if (!res.ok) throw new Error('Failed to load archive challenge');
					const data = await res.json();
					setGameData({ id: data.id, date: data.date, words: data.words, categories: data.categories });
				} else {
					// Default: Guest user API call for daily challenge
					// This will be called for daily challenges or when no specific challenge is specified
					const response = await fetch('/api/guest/daily-challenge', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					});
					
					if (response.ok) {
						const data = await response.json();
						setGameData({ 
							id: data.levelId || data.id, 
							date: data.date, 
							words: data.words, 
							categories: data.categories 
						});
					} else {
						throw new Error('Failed to load daily challenge');
					}
				}

				// Reset game state after loading
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
				console.error('Error loading challenge data:', e);
			}
		};

		loadChallengeData();
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
				// Fetch word meanings when game is won
				fetchWordMeanings();

				// Handle game completion
				const handleGameCompletion = async () => {
					try {
						const { stars, hintsUsed } = computeStars();
						const completionData = {
							levelId: gameData.id,
							stars: stars,
							time_taken: time,
							moves: attempts,
							hints: hintsUsed,
							type: challenge === 'daily' ? 'Daily' : 'Archive',
							categories: [...foundCategories, category]
						};

						// Save daily challenge data locally (only for daily challenges)
						if (challenge === 'daily') {
							saveDailyChallengeData(completionData);
						}

						// Send finish API call with new data structure
						const response = await fetch('/api/game/finish', {
							method: 'POST',
							headers: { 
								'Content-Type': 'application/json' 
							},
							body: JSON.stringify(completionData)
						});

						if (response.ok) {
							console.log('Game result saved successfully');
						} else {
							throw new Error('Failed to save game result');
						}
					} catch (e) {
						console.error('Error saving game result:', e);
					}
				};

				// Call completion handler
				handleGameCompletion();
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
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4'>
			<div className='max-w-4xl mx-auto'>
				{/* Header */}
				<div className='text-center mb-4 sm:mb-8'>
					<h2 className='text-2xl sm:text-xl md:text-4xl font-bold text-gray-800 mb-2 px-2'>
						{challenge === 'archive' ? 'Archive Challenge' : 'Daily Challenge'} #{gameData.id}
					</h2>
					<p className='text-sm sm:text-base text-gray-600 px-2'>Find 4 words that belong to the same category</p>
				</div>

				{/* Completed State for Daily Challenge */}
				{gameStatus === 'completed' && challenge === 'daily' && (
					<div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl shadow-lg border-2 border-green-200 p-4 sm:p-6 mb-4 sm:mb-6'>
						<div className='text-center'>
							<div className='text-4xl mb-3'>🎉</div>
							<h3 className='text-xl sm:text-2xl font-bold text-green-800 mb-2'>Daily Challenge Completed!</h3>
							<p className='text-sm sm:text-base text-green-700 mb-4'>You've already completed today's challenge. Come back tomorrow for a new one!</p>
							
							{/* Show completion stats */}
							<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
								<div className='bg-white rounded-lg p-3 shadow-sm'>
									<div className='text-lg sm:text-2xl font-bold text-green-600'>{formatTime(time)}</div>
									<div className='text-xs text-green-600'>Time</div>
								</div>
								<div className='bg-white rounded-lg p-3 shadow-sm'>
									<div className='text-lg sm:text-2xl font-bold text-green-600'>{attempts}</div>
									<div className='text-xs text-green-600'>Moves</div>
								</div>
								<div className='bg-white rounded-lg p-3 shadow-sm'>
									<div className='text-lg sm:text-2xl font-bold text-green-600'>{2 - hints}</div>
									<div className='text-xs text-green-600'>Hints Used</div>
								</div>
								<div className='bg-white rounded-lg p-3 shadow-sm'>
									<div className='text-lg sm:text-2xl font-bold text-yellow-600'>
										{'★'.repeat(revealedStars)}{'☆'.repeat(3 - revealedStars)}
									</div>
									<div className='text-xs text-green-600'>Stars</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Game Stats - Hide when completed */}
				{gameStatus !== 'completed' && (
					<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6'>
					{/* Mobile Layout - All stats in one row */}
					<div className='block sm:hidden'>
						<div className='flex justify-between items-center mb-3'>
							{/* Time */}
							<div className='flex items-center gap-1.5'>
								<div className='w-2 h-2 bg-blue-500 rounded-full'></div>
								<span className='text-sm font-semibold text-gray-700'>
									{formatTime(time)}
								</span>
							</div>
							{/* Hints */}
							<div className='flex items-center gap-1.5'>
								<div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
								<span className='text-sm font-semibold text-gray-700'>
									{hints}
								</span>
							</div>
							{/* Progress */}
							<div className='flex items-center gap-1.5'>
								<div className='w-2 h-2 bg-green-500 rounded-full'></div>
								<span className='text-sm font-semibold text-gray-700'>
									{foundCategories.length}/4
								</span>
							</div>
							{/* Hint Button */}
							<button 
								onClick={useHint}
								disabled={hints === 0 || gameStatus !== 'playing'}
								className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Hint
							</button>
						</div>
					</div>

					{/* Desktop Layout */}
					<div className='hidden sm:flex justify-between items-center'>
						<div className='flex gap-4 lg:gap-6'>
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
				)}

				{/* Word Grid - Hide when completed */}
				{gameStatus !== 'completed' && (
				<div className={`relative rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6 bg-white transition-all duration-500 ${gameStatus === 'won' ? 'ring-4 ring-green-300 scale-[1.01]' : ''}`}>
					{/* shimmer/confetti overlay on finish */}
					{gameStatus === 'won' && (
						<div className='pointer-events-none absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl'>
							<div className='absolute -top-10 left-0 w-full h-10 bg-[repeating-linear-gradient(90deg,rgba(34,197,94,0.2)_0_12px,transparent_12px_24px)] animate-[slideDown_900ms_ease-out_forwards]'></div>
						</div>
					)}
					<h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center'>Word Grid</h3>
					
					{/* Mobile Grid - 4x4 with smaller boxes */}
					<div className='grid grid-cols-4 gap-1.5 sm:hidden'>
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
										p-2 rounded-md text-center font-semibold text-xs transition-all duration-300 transform relative min-h-[50px] flex items-center justify-center
										${isIncorrect
											? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse'
											: isSelected 
												? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 animate-pulse' 
												: isFound
													? `bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ${isCorrectFlash ? 'animate-pulse' : ''}`
													: isHinted
														? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg animate-pulse'
														: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 shadow-md hover:scale-105 active:scale-95'
										}
										${isFound ? 'cursor-not-allowed' : 'cursor-pointer touch-manipulation'}
									`}
								>
									<span className='break-words leading-tight'>{word}</span>
									{isHinted && (
										<div className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-300 rounded-full flex items-center justify-center'>
											<span className='text-xs'>💡</span>
										</div>
									)}
								</button>
							);
						})}
					</div>

					{/* Desktop Grid - 4x4 with smaller boxes */}
					<div className='hidden sm:grid grid-cols-4 gap-2 lg:gap-3'>
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
										p-3 rounded-lg text-center font-semibold text-sm transition-all duration-300 transform relative min-h-[60px] flex items-center justify-center
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
									<span className='break-words leading-tight'>{word}</span>
									{isHinted && (
										<div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full flex items-center justify-center'>
											<span className='text-xs'>💡</span>
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
				)}

				{/* Performance Summary (shown when finished) - Compact Version */}
				{gameStatus === 'won' && (
					<div className='bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-100'>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='text-base sm:text-lg font-bold text-gray-800'>Performance</h3>
							<span className={`px-2 py-1 rounded-full text-xs font-semibold ${challenge === 'archive' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
								{challenge === 'archive' ? 'Archive' : 'Daily'}
							</span>
						</div>

						{/* Stars row - smaller */}
						<div className='relative overflow-hidden rounded-lg mb-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-100'>
							<div className='flex items-center justify-center gap-2 px-3 py-3'>
								{[0,1,2].map((i) => {
									const isRevealed = i < revealedStars && i < stars;
									return (
										<span
											key={i}
											className={`relative text-2xl sm:text-3xl transition-all duration-500 ease-out transform 
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

						{/* Compact stats - single row on mobile */}
						<div className='grid grid-cols-3 gap-2 sm:gap-3'>
							<div className='rounded-lg border border-gray-100 bg-gray-50 p-2 sm:p-3 shadow-sm text-center'>
								<div className='text-xs text-gray-500 mb-1'>Time</div>
								<div className='text-lg sm:text-xl font-bold text-gray-800'>{formatTime(time)}</div>
								<div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${metTime ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
									{metTime ? '✓' : '✗'}
								</div>
							</div>
							<div className='rounded-lg border border-gray-100 bg-gray-50 p-2 sm:p-3 shadow-sm text-center'>
								<div className='text-xs text-gray-500 mb-1'>Hints</div>
								<div className='text-lg sm:text-xl font-bold text-gray-800'>{hintsUsed}</div>
								<div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${metHints ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
									{metHints ? '✓' : '✗'}
								</div>
							</div>
							<div className='rounded-lg border border-gray-100 bg-gray-50 p-2 sm:p-3 shadow-sm text-center'>
								<div className='text-xs text-gray-500 mb-1'>Moves</div>
								<div className='text-lg sm:text-xl font-bold text-gray-800'>{attempts}</div>
								<div className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full ${metMoves ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
									{metMoves ? '✓' : '✗'}
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Found Categories with Words (moved below grid) */}
				{foundCategories.length > 0 && (
					<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6'>
						<h3 className='text-lg sm:text-xl font-semibold text-gray-800 mb-4'>Found Categories</h3>
						<div className='space-y-3 sm:space-y-4'>
							{foundCategories.map((category, index) => (
								<div 
									key={index} 
									className={`bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-500 ${lastFoundCategory === category ? 'ring-2 ring-green-400 animate-pulse' : ''}`}
								>
									<div className='flex items-center gap-2 sm:gap-3 mb-2'>
										<div className='bg-gradient-to-r from-green-400 to-green-500 text-white px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm'>
											{category}
										</div>
										<span className='text-gray-600 text-xs sm:text-sm'>Words:</span>
									</div>
									<div className='flex gap-1.5 sm:gap-2 flex-wrap'>
										{getWordsForCategory(category).map((word, wordIndex) => (
											<div key={wordIndex} className='bg-white border border-green-300 text-green-800 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm shadow-sm'>
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
					<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6'>
						<h3 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center'>Word Meanings</h3>
						
						{loadingMeanings ? (
							<div className='flex items-center justify-center py-8'>
								<div className='flex items-center gap-3'>
									<div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
									<span className='text-gray-600'>Loading definitions...</span>
								</div>
							</div>
						) : (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
								{gameData.words.map((word, index) => (
									<div key={index} className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4'>
										<div className='font-semibold text-blue-800 text-base sm:text-lg mb-2 capitalize'>{word}</div>
										<div className='text-gray-600 text-xs sm:text-sm leading-relaxed'>
											{wordMeanings[word] || 'Definition not available'}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Game Status */}
				{gameStatus === 'won' && (
					<div className='bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center'>
						<div className='text-4xl sm:text-6xl mb-3 sm:mb-4'>🎉</div>
						<h2 className='text-2xl sm:text-3xl font-bold text-green-600 mb-3 sm:mb-4'>Congratulations!</h2>
						<div className='bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6'>
							<p className='text-base sm:text-lg text-gray-700 mb-2'>Final Statistics:</p>
							<div className='flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm'>
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
							className='bg-gradient-to-r from-green-500 to-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto'
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
