export class Guess {
    word: string = ""
    letters: Letter[] = []
    constructor(word: string, letters: Letter[]) {
        this.word = word
        this.letters = letters
    }
}

class Letter {
    letter: string
    placement: number
    state: LetterState
    constructor(letter: string, placement: number, state: LetterState) {
        this.letter = letter
        this.placement = placement
        this.state = state
    }
}

enum LetterState {
    NotInWord = 0,
    WrongPlacement = 1,
    Correct = 2
}