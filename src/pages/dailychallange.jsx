import React from 'react';
import { useParams } from 'react-router-dom';
import GameBoard from '../component/gameBoard';

const Dailychallange = () => {
	const { type, id } = useParams(); // e.g., /play/:type/:id where type is 'daily' or 'archive'
	return (
		<GameBoard challenge={type === 'archive' ? 'archive' : 'daily'} challengeId={id ? Number(id) : undefined} />
	);
}

export default Dailychallange;
