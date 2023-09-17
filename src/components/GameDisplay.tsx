import React, { useEffect, useState } from "react";
import animalEmoji from "../emojis/animalEmoji";
import shuffleArray from "./gameLogic";
import {legend, amateur} from './gameLogic';

export const generateRandomNumber = (maxRange: number) => Math.floor(Math.random() * maxRange)

export function produceCertainNumberOfCards(cardNumberLimit:number, cardArray:any[], except:number[]){
    let cards = [],
    storeGeneratedNo:number[] = [],
    randomNo;

    for(let i = 0; i < cardNumberLimit; i++){
        do{
            randomNo =  generateRandomNumber(cardArray.length);
        }while(except.includes(randomNo) || storeGeneratedNo.includes(randomNo))

        storeGeneratedNo.push(randomNo);
        cards.push(cardArray[randomNo]);
    }
    
    return cards;
}

interface RenderEmojiProps {
    gameStage: number;
    setGameStage: any;
    score: number;
    setScore: any;
    setHighScore: any;
    highScore: number;
    setCompletedGame: any;
    name: string;
    difficulty: string;
}

function RenderEmoji({gameStage, setGameStage, score, setScore, setHighScore, highScore,
    setCompletedGame, name, difficulty}:RenderEmojiProps) {
    
    const [emojiToDisplay, setEmojiToDisplay] = useState([]),
          [clickCount, setClickCount] = useState(1),
          [finishedLevel, setFinishedLevel] = useState(false),
          [pause, setPause] = useState(false);


    // Returns the number of cards each game stage should have
    const cardNumber = (gameStage:number) => {
        let numberOfCards = 0;

        switch (gameStage){
            case 1: 
                numberOfCards = 3;
                break;
            case 2: 
                numberOfCards = 6;
                break;
            case 3: 
                numberOfCards = 10;
                break;
            case 4: 
                numberOfCards = 15;
                break;
            case 5: 
                numberOfCards = 22;
                break;
        }

        return numberOfCards;
    }

    // Allocating time to each game stage
    function gameStageTimer (difficulty:string, gameStage:number) {
        let time = 0;

        if(difficulty === 'easy') {
            time = 12;

            if(gameStage !== 1) {
                time *= gameStage;
            }
        }

        else if (difficulty === 'amateur'){
            time = 10;

            if(gameStage !== 1) {
                time *= gameStage;
            }
        }

        else if(difficulty === 'legend'){
            
            time = 8;

            if(gameStage !== 1) {
                time *= gameStage;
            }
        }

        return time;
    }

    const [timer, setTimer] = useState(gameStageTimer(difficulty, gameStage));
    
    let timerId:NodeJS.Timeout;

    useEffect(() => {
        timerId = setTimeout(() => {
            setTimer(timer - 1);
        }, 1000)

        // Check if timer has finished counting
        if (timer === 0 && !finishedLevel){
            // Starts the game afresh when time runs out. I should later work on this to display a
            // a game over message or page
            resetStates(true);
            // Regenerate cards if timer finishes in stage one
            gameStage === 1 && regenerateGameEmoji();
        }

        return () => {
            clearTimeout(timerId)
        }
    })

    // Grouping similar emojis. Would use this in amatuer and legend diff. level
    const getSimilarObj = (array:any) => {
        let storeSimilarArr = Object.create(null),
        newArray = array.filter((obj:any) => obj.uniqueName) //Removed arrays that are not similar

        function addArr (obj:any){
            if(storeSimilarArr[obj.uniqueName] == null){
                storeSimilarArr[obj.uniqueName] = [obj];
            }
            else{
                storeSimilarArr[obj.uniqueName].push(obj);
            }
        }

        for (let element of newArray){
            addArr(element);
        }

        return storeSimilarArr;
    }

    // Converting an object whose properties are arrays into an array
    // of arrays
    const objToArr = (obj:any) => {
        return Object.entries(obj)
            .map((arr:any) => arr[1])
    }

    const generateEmojiCards = (emojiArray: any[], gameStage:number, difficulty:string) => {
        if(difficulty === 'easy') {
            return produceCertainNumberOfCards(cardNumber(gameStage), emojiArray, [500]);
        }

        else if(difficulty === 'amateur') {
            return amateur(objToArr(getSimilarObj(animalEmoji())), emojiArray, cardNumber(gameStage))
        }

        else if(difficulty === 'legend') {
            return legend(objToArr(getSimilarObj(animalEmoji())), cardNumber(gameStage))
        }
    }

    const incrementScore = () => {
        switch(difficulty){
            case 'easy':
                setScore(score + 2);
                break;
            case 'amateur':
                setScore(score + 3);
                break;
            case 'legend':
                setScore(score + 5);
                break;
            // I think adding this default value here is quite useless though.
            default: 
                console.error("DIFFICULTY IS UNRECOGNIZED")
        }
    }

    const handleHighScore = (score:number) => {
        if(score > highScore) setHighScore(score);
        return;
    }

    function resetStates (restartGame:boolean) {
        if (restartGame){
            setGameStage(1);
            setScore(0);
            gameStage === 1 && regenerateGameEmoji();
        }

        setClickCount(1);
        setFinishedLevel(false);
        setTimer(gameStageTimer(difficulty, 1))
    }

    const clickEmoji = (emojiObj:any, array:string[]) => {
        if (pause){
            alert("Game is currently paused, click the play button to continue")
            return;
        }

        if(emojiObj.clicked){
            alert("Game Over. You've previously clicked that animal");
            resetStates(true);
            return;
        }

        setEmojiToDisplay(shuffleArray(array));
        incrementScore();
        
        emojiObj.clicked = true;
        emojiObj.displayed = true;

        setClickCount(clickCount + 1);

        if(clickCount === cardNumber(gameStage)){ 
            setFinishedLevel(true);

            if(gameStage < 5){
                setGameStage(gameStage + 1);
                return;
            }

            setCompletedGame(true);
            return;
        }
    }

    const regenerateGameEmoji = () => {
        let displayEmojis:any = generateEmojiCards(animalEmoji(), gameStage, difficulty);
        setEmojiToDisplay(displayEmojis);
    }

    // Using useEffect to generate the required number of emojis for the game stage
    useEffect(() => {
        regenerateGameEmoji();

        resetStates(false);

        // Reset timer
        setTimer(gameStageTimer(difficulty, gameStage));
    }, [gameStage])

    useEffect(() => {
        handleHighScore(score)
    }, [score]);

    // Using useEffect to handle the game pausing functionality
    useEffect(() => {
        pause && clearTimeout(timerId);
    }, [pause])

    // A little cheat for my game. It returns the emoji cards that have not been clicked
    // This distorts the ui though
    // const emoji = emojiToDisplay
    //     .filter((aniEmo:any) => !aniEmo.clicked)
    //     .map((aniEmo:any) => <p key={aniEmo.codes}>{aniEmo.char}</p>);

    return (
        <>
            {/* Display score and highscore. Also display difficulty level*/}
            <div className="score">
                    <p>Score: {score}</p>
                    <p>High-Score: {highScore}</p>
                    <p className="capitalize">Selected difficulty: {difficulty}</p>
            </div>

            <button className='pauseGame' onClick={() => setPause(!pause)}>
                {pause? 'Play' : 'Pause'}
            </button>

            {timer > 0 && <p className="timer">Remaining Time: {timer}</p>}

            <p className="gameStage">Current Game Stage: {gameStage}</p>

            {/* Emoji cards section*/}
            <div className="emojiSection">
                {emojiToDisplay.map((aniEmo:any) =>
                        <div style={{display: 'inline-block'}} key={aniEmo.codes} 
                                onClick={() => {clickEmoji(aniEmo, emojiToDisplay)}} className="emojiCard">
                            
                            {/* The emoji */}
                            <h1>{aniEmo.char}</h1>

                            <p style={{marginTop: '10px'}}><b>{aniEmo.name}</b></p>

                            {/* My little cheat for the game */}
                            {/* {emoji} */}
                        </div>
                )}
            </div>

            <p className="gameScore">{name !== ''? name + ' your' : 'Your'} game score is {score}</p>
        </>
    );
}

export default RenderEmoji;


/*
    Features to add in future
        (Done, not finished though) Add a timer to make the game more interesting(Kinda make it animated)
        (Done) Add a pause feature to the game
        Make the game to show an alert that says time's up when the time for that stage is up.
        Make the contents of the game's welcome page animated
        Probably add a backend that display's the highest scorer's in the game(Might use Json server for this)
        Work more on this game's UI. Add beautiful animations.

    Thoguhts on the game
        So far the game looks good, though I don't like it's over simple UI
        (Done) About the difficulty levels, I think legend should be easy and vice versa(I'd work on that right away)
        And I definitely need to make it responsive.

    'Appearance of (Done) before a to-do task indicates that it have been handled'    

    Pause feature:
        The timer should stop when the user clicks on pause (an icon would probably be used to show this)
        The whole game should be made unclickable (disabled when the player clicks on pause)
*/