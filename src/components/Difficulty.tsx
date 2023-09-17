import React from "react";
import { Link } from "react-router-dom";

function Difficulty({setDifficulty}:any) {
    return (
        <div className="difficulty">
            <p>Select a dificulty level to start the game</p>
            <div className="diffButtons">
                <Link to={"/GameDisplay"}><button onClick={() => setDifficulty('easy')}>Easy</button></Link>
                <Link to={"/GameDisplay"}><button onClick={() => setDifficulty('amateur')}>Amateur</button></Link>
                <Link to={"/GameDisplay"}><button onClick={() => setDifficulty('legend')}>Legend</button></Link>
            </div>
        </div>
    );
}

export default Difficulty;