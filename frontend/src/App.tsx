import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { MissionBrief } from './components/MissionBrief';
import { GameJourney } from './components/GameJourney';
import { DebriefJourney } from './components/DebriefJourney';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brief" element={<MissionBrief />} />
        <Route path="/game" element={<GameJourney />} />
        <Route path="/debrief" element={<DebriefJourney />} />
      </Routes>
    </Router>
  );
};

export default App;
