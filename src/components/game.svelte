<script>
    import { WORDS } from "../words.js";
    import DeviceDetector from "svelte-device-detector"; /*courtesy of https://github.com/Morgenstern2573/wordle_clone*/
    import { initializeApp } from "firebase/app";
    import { getFirestore, collection, getDoc, setDoc, doc, Timestamp } from "firebase/firestore";
    import moment from 'moment-es6';
    import { animateScroll } from 'svelte-scrollto-element'

    let gameData = {
        wordToGuess: "CRANE" /*example word. will fetch later.*/,
        guessCount: 0,
        guesses: [
            /*
            example:
                {word:'WATER',letters:[
                    {letter:'w','placement':0,'state':0 (0 being not at all correct, 1 being incorrect placement, 2 being corrent placement.)}
                ]}
            */
        ],
        currentGuess: {
            letters: [
                { letter: "" },
                { letter: "" },
                { letter: "" },
                { letter: "" },
                { letter: "" },
            ],
            index: 0,
        },
        winner: false,
    };
    getWord()
    async function getWord() {
        const firebaseConfig = {
            apiKey: "AIzaSyDcl4k6NksjLX0w0r_9EWcLlR7eh15eLWY",
            authDomain: "lirdle-e46e1.firebaseapp.com",
            projectId: "lirdle-e46e1",
            storageBucket: "lirdle-e46e1.appspot.com",
            messagingSenderId: "643367228094",
            appId: "1:643367228094:web:a2e113ba9c6cfc551f84ef",
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const docRef = doc(db,"word","word")
        const docSnap = await getDoc(docRef)
        let hours = moment().diff(docSnap.data().lastUpdated.toMillis(), 'hours');
        if (hours >= 24) {
            //over a day. update word
            let chosenWord = WORDS[random(0,WORDS.length)]
            setDoc(docRef,{
                word:chosenWord.toUpperCase(),
                lastUpdated:Timestamp.fromDate(new Date)
            })
            gameData.wordToGuess = chosenWord.toUpperCase()
        } else {
            gameData.wordToGuess = docSnap.data().word
        }
        
    }
    let invalid = false;
    function keyPressed(e) {
        if (!gameData.winner) {
            if (e.key === "Enter" && gameData.currentGuess.index == 5) {
                checkGuess();
            }
            if (e.key === "Backspace" && gameData.currentGuess.index >= 0) {
                gameData.currentGuess.letters[gameData.currentGuess.index - 1] =
                    { letter: "" };
                if (!gameData.currentGuess.index == 0) {
                    gameData.currentGuess.index--;
                }
            }
            //filter out keys
            if (e.keyCode >= 48 && e.keyCode <= 57) {
                //key is number. skip.
                return;
            } else if (
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                (e.keyCode >= 97 && e.keyCode <= 122)
            ) {
                //alphabet!! woohoo!
                if (gameData.currentGuess.index == 5) {
                    return;
                } else {
                    gameData.currentGuess.letters[gameData.currentGuess.index] =
                        { letter: e.key.toUpperCase() };
                    gameData.currentGuess.index += 1;
                }
            }
        }
    }
    function resetGame() {
        gameData = {
        wordToGuess: WORDS[random(0,WORDS.length)].toUpperCase() /*example word. will fetch later.*/,
        guessCount: 0,
        guesses: [
            /*
            example:
                {word:'WATER',letters:[
                    {letter:'w','placement':0,'state':0 (0 being not at all correct, 1 being incorrect placement, 2 being corrent placement.)}
                ]}
            */
        ],
        currentGuess: {
            letters: [
                { letter: "" },
                { letter: "" },
                { letter: "" },
                { letter: "" },
                { letter: "" },
            ],
            index: 0,
        },
        winner: false,
    }
}
    function random(minimum, maximum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }
    function checkGuess() {
        let word = "";
        let letters = [];
        let lettersToGuess = gameData.wordToGuess.split("");
        let lying = random(0, 2); //if 0, no lie; if 1, lie
        for (let i = 0; i < gameData.currentGuess.letters.length; i++) {
            let currentLetter =
                gameData.currentGuess.letters[i].letter.toUpperCase();
            word += currentLetter;
            let state;
            if (currentLetter == lettersToGuess[i]) {
                //currect placement
                state = 2;
            } else if (
                lettersToGuess.includes(currentLetter) &&
                currentLetter != lettersToGuess[i]
            ) {
                //incorrect placement, but it is in word
                state = 1;
            } else {
                //probably not at all in word
                state = 0;
            }
            letters.push({ letter: currentLetter, placement: i, state: state });
            animateScroll.scrollToBottom()
        }
        //lie occasionally; except if it's right
        if (lying == 1 && word != gameData.wordToGuess) {
            const index = random(0, 5);
            const state = random(0, 2);
            if (letters[index].state == state) {
                //don't change
                return;
            }
            letters[index].state = state;
            letters[index].lie = true;
        }
        let validWord = false;
        if (WORDS.includes(word.toLowerCase())) validWord = true;
        for (let guessIndex in gameData.guesses) {
            let guess = gameData.guesses[guessIndex];
            if (guess.word.toUpperCase() == word.toUpperCase()) {
                //cant guess the same word twice
                validWord = false;
            }
        }

        if (validWord) {
            gameData.guesses = [
                { word: word, letters: letters },
                ...gameData.guesses,
            ];
            gameData.currentGuess.letters = [
                { letter: "" },
                { letter: "" },
                { letter: "" },
                { letter: "" },
                { letter: "" },
            ];
            gameData.currentGuess.index = 0;
            if (word == gameData.wordToGuess) {
                gameData.winner = true;
            }
        } else {
            invalid = true;
            setTimeout(() => {
                invalid = false;
            }, 3000);
        }
    }
    function emojify() {
        //convert games into emoji
        let string = "";
        for (let i = 0; i < gameData.guesses.length; i++) {
            let guess = [...gameData.guesses].reverse()[i];
            let thisLine = "";
            for (let z = 0; z < guess.letters.length; z++) {
                let letter = guess.letters[z];
                if (!letter.lie) {
                    //not a lie
                    if (letter.state == 0) {
                        thisLine += "⬛️";
                    } else if (letter.state == 1) {
                        thisLine += "🟧";
                    } else if (letter.state == 2) {
                        thisLine += "🟩";
                    }
                } else {
                    //lie
                    thisLine += "🤥";
                }
            }
            thisLine += "\n";
            string += thisLine;
            
        }
        string+=`${gameData.guesses.length} guesses`
        navigator.clipboard
            .writeText(string)
            .then((e) => {
                return string;
            })
            .catch((err) => {
                console.error("oops! no clipboard access. ", err);
            });
    }
</script>

{#each [...gameData.guesses].reverse() as guess}
    <div id={guess.word} class="prevGuess">
        {#each guess.letters as letter}
            <div id="letterPrevContainer">
                {#if letter.state == 1}
                <p class="letterPrev" style="color:rgb(209, 141, 31)">
                    {letter.letter}
                </p>
                {:else if letter.state == 2}
                    <p class="letterPrev" style="color:rgb(107, 202, 107)">{letter.letter}</p>
                {:else}
                    <p class="letterPrev">{letter.letter}</p>
                {/if}
            </div>
        {/each}
    </div>
{/each}
{#if !gameData.winner}
    <div class="currentGuessBoxes">
        {#each gameData.currentGuess.letters as letter}
            <div id="guessBoxContainer"><div class="guess-box">{letter.letter}</div></div>
        {/each}
    </div>
{/if}
{#if gameData.winner}
    <div class="winner">
        <h2>You got it!</h2>
        <p>You guessed the word in {gameData.guesses.length} guesses.</p>
        <button on:click|once={emojify}>copy to clipboard</button>
        <button on:click|once={resetGame}>play again (different word)</button>
    </div>
{/if}
<div id="bottomOfPage"></div>
{#if invalid}
    <p style="color:red">Invalid Word!</p>
{/if}
{#if !gameData.winner}
    <DeviceDetector showInDevice="mobile">
        <input id="mobiletextfield" type="text" onkeypress="keyPressed()" />
    </DeviceDetector>
{/if}
<svelte:window on:keydown|preventDefault={keyPressed} />

<style>
    .prevGuess {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .letterPrev {
        border-color: rgb(217, 217, 217);
        border-style: solid;
        padding: 10px;
        width: 20px;
    }
    #letterPrevContainer {
        padding: 1px;
    }
    .currentGuessBoxes {
        display: flex;
        width: 100%;
        justify-content: center;
        
    }
    #guessBoxContainer {
        padding: 1px;
    }
    .guess-box {
        border-color: rgb(255, 255, 255);
        border-style: solid;
        padding: 10px;
        width: 20px;
        height: 20px;
    }
    .winner {
        color: rgb(107, 202, 107);
    }
</style>
