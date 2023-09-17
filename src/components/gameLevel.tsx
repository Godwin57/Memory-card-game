import React from 'react'
import { Link } from 'react-router-dom'

function WelcomePage({setName}: any) {
    return (
        <>
            <div className="welcome">
                <h2>Welcome to Godwin's Memory Card Game.</h2>
                <p>We've just been attacked by quite a number of animals and its more of a mental war
                    than a physical. You just have to click on the picture of an animal to destroy it.
                    Take heed that you don't click on one picture twice. Can you help us win this war???
                </p>
                <div className='inputs'>
                    {/* Ask the player to input name. Optional */}
                    <input type="text" onChange={(e) => setName(e.target.value)} 
                        placeholder='Enter your name. *Optional'/>
                    <Link to="./Difficulty"> 
                        <button>Go to Game</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default WelcomePage;