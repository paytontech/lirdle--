<script>
    let gameData = {
        guessCount: 0,
        guesses: [
            /*
            example:
                {word:'WATER',letters:[
                    {letter:'w','placement':0,'state':0 (0 being not at all correct, 1 being incorrect placement, 2 being corrent placement.)}
                ]}
            */
        ],
    };
</script>

{#each gameData.guesses as guess}
    <div id={guess.word} class="prevGuess">
        {#each guess.letters as letter}
            {#if letter.state == 1}
                <p class="letterPrev" style="color:rgb(209, 141, 31)">{letter.letter}</p>
            {:else if letter.state == 2}
                <p class="letterPrev" style="color:green">{letter.letter}</p>
            {:else}
                <p class="letterPrev">{letter.letter}</p>
            {/if}
        {/each}
    </div>
{/each}
<style>
    .prevGuess {
        display: flex;
        width: 100%;
        justify-content: center;
    }
    .letterPrev {
        border-color: gray;
        border-style: solid;
        padding: 10px;
    }
</style>