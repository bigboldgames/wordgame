import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dailychallange from './pages/dailychallange';
import Archive from './pages/archive';
import Leaderboard from './pages/leaderboard';
import Profile from './pages/profile';
import GameBoard from './component/gameBoard';
import Index from './layout';
import HowToplay from './pages/howToplay';

import './App.css'
import Login from './pages/login';

function App() {

  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Index />}>
                <Route index element={<Dailychallange />} />
                <Route path='/archive' element={<Archive />} />
                <Route path='/archive/:id' element={<GameBoard challenge={'archive'} />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/how-to-play' element={<HowToplay />} />
                <Route path='/login' element={<Login />} />
              </Route>
          </Routes>
      </Router>
    </>
  )
}

export default App
