import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from './components/gameLevel';
import RenderEmoji from "./components/GameDisplay";
import Difficulty from "./components/Difficulty";

export default function App() {
    const [difficulty, setDifficulty] = useState('legend'),
          [gameStage, setGameStage] = useState(1),
          [score, setScore] = useState(0),
          [highScore, setHighScore] = useState(0),
          [completedGame, setCompletedGame] = useState(false),
          [name, setName] = useState('');

    const playAgain = () => {
        // Resetting states
        setGameStage(1);
        setCompletedGame(false);
        setScore(0);
    }

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" 
                        element={<WelcomePage setName={setName}/>} />
                </Routes>

                {/* Ask the player to select desired difficulty level */}
                <Routes>
                    <Route path="/difficulty" 
                        element={<Difficulty setDifficulty={setDifficulty} difficulty={difficulty}/>} />
                </Routes>

                {/* Creating seperate div to display game after displaying welcome page */}
                <div>

                {!completedGame && <Routes>
                    <Route path="/GameDisplay" element={
                            <RenderEmoji gameStage={gameStage}
                            setGameStage={setGameStage} setHighScore={setHighScore} 
                            setScore={setScore} highScore={highScore} score={score} name={name}
                            setCompletedGame={setCompletedGame} difficulty={difficulty}/>
                        }
                    />
                </Routes> }

                    {completedGame && <div> <p className="
                        finalMessage">Congratulations. You have completed this memory card game. Your score is {score}.</p>
                        {/* Going to work further on this functionality tomorrow */}
                        <button className="playAgain" onClick={() => playAgain()}>Play Again</button>
                    </div>
                    }
                    
                </div>
            </div>
        </BrowserRouter>
    );
}