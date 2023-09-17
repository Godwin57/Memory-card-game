import { generateRandomNumber } from "./GameDisplay";
import { produceCertainNumberOfCards } from "./GameDisplay";
import animalEmoji from "../emojis/animalEmoji";

const shuffleArray = (array:string[]) => {
    let newArray:any = [],
        storeRandomNo:number[] = [];

    for (let i = 0; i < array.length; i++) {
        let random;
        do {
            random = generateRandomNumber(array.length)
        } while (storeRandomNo.includes(random))

        newArray = newArray.concat(array[random]);
        storeRandomNo.push(random);
    }

    return newArray;
}

function removeExcessItems(array:string[], requiredNo:number){
    let newArr = array;
    while(newArr.length > requiredNo) newArr.pop();
    return newArr;
}

const reduceArr = (array:any[]) => array.reduce((elem1, elem2) => elem1.concat(elem2), [])

// This function unlike the amature function, only returns emojis that are purely similar looking
export const legend = (arr:string[], maxCardNo:number) => shuffleArray(getSimElem(arr, maxCardNo));

function getSimElem (arr:string[], maxCardNo:number){
    const generatedEmojis:number[] = [];
    
    let emojiNumber,
        cardArr:string[] = [];

    for (let i = 0; i < maxCardNo; i++){    
        do{
            emojiNumber = generateRandomNumber(arr.length);
        }while(generatedEmojis.includes(emojiNumber))

        cardArr.push(arr[emojiNumber])
        generatedEmojis.push(emojiNumber)

        // Reduce array to a single element array
        cardArr = reduceArr(cardArr)
    }

    return removeExcessItems(cardArr, maxCardNo)
}

// Handling card generation for amateur difficulty level
export const amateur = (simArr:any[], nonSimArr:string[], requiredNo:number) => {
    let similarEmojisNo = requiredNo /2,
        similarArr = getSimElem(simArr, similarEmojisNo),
        simEmojisIndexes = [];

    for (let element of similarArr){
        simEmojisIndexes.push(nonSimArr.indexOf(element));
    }

    // Producing the rest of the array that was left to be produced with the non-similar emojis
    const remainingCards = produceCertainNumberOfCards(requiredNo - similarEmojisNo, animalEmoji(), simEmojisIndexes);

    return shuffleArray(similarArr.concat(remainingCards));
}

export default shuffleArray;