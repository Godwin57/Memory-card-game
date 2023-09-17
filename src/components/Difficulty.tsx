import React from "react";
import { Link } from "react-router-dom";

// Use split method to animate the game and tell a kinda story before the game starts

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

/* 
    Easy level should not display emojis that look similar and should only use an emoji once in all the stages
    Amateur should also use an emoji once in all the states and about half of its cards should be similar looking
    Legend's emoji cards should all (or at least all except one) be similar looking
*/