import { Guess } from "./Guess";

class Game {
    wordToGuess: string = "crane"
    guessCount: number = 0
    guesses: Guess[] = []
    currentGuess: Guess
    winner: boolean = false
    constructor(wordToGuess: string) {
        this.wordToGuess = wordToGuess
        this.guessCount = 0
        this.currentGuess = new Guess('', [])
    }
}