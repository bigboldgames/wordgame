import React from 'react';
import { useParams } from 'react-router-dom';
import GameBoard from '../component/gameBoard';

const Dailychallange = () => {
	return (
		<GameBoard challenge={'daily'} />
	);
}

export default Dailychallange;
