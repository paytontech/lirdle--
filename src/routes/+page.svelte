<script>
    import Game from '../components/game.svelte'
</script>
<h2><a href="http://lirdle.com">Lirdle</a><br/>Except it only lies sometimes.</h2>
<Game/>



<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,500;0,600;1,600&display=swap');
    
    body {
        background: black;
    }
    :root {
        font-family: 'Poppins', sans-serif;
        text-align: center;
        color: white;
        background-color: rgb(10, 10, 10);
    }
    a {
        color: rgb(83, 83, 255);
    }
</style>