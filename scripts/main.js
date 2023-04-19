let scoreBlock // 'span' score-count html:ssa
let score = 0
let gameInPause = false

// Ei salli sinun muuttaa käärmeen lentorataa kahdesti...
// jos lentoradan muutospainiketta painettiin
let changeMove = true 

// Käärmeen nopeuden asettaminen, ja koko yhden häkin.
// Arvon "step" ei vaikuta nopeuteen, mutta...
// käärmeen nopeuttamiseksi sitä käytetään "stepBoost" kanssa
const config = {
    step: 0,
    stepBoost: 0, // +movespeed
    maxStep: 16,
    sizeCell: 16,
    sizeBerry: 16 / 4
}

// Käärmeen yhden osan koon asettaminen...
// ja hännän alkuperäisen pituuden asettaminen
const snake = {
    x: 16,
    y: 16,
    dx: config.sizeCell,
    dy: 0,
    tails: [],
    maxTails: 3
}

// Marjan alkuperäiset koordinaatit
let berry = {
    x: 0,
    y: 0
}

let canvas = document.querySelector("#game-canvas")
scoreBlock = document.querySelector(".game-score .score-count")

// Piirtoalueen renderöintimenetelmän asettaminen
let context = canvas.getContext("2d")

drawScore()

// Ääretön silmukka
function gameLoop() {

    requestAnimationFrame(gameLoop)
    if (++config.step < config.maxStep) {
        return
    }
    
    config.step = config.stepBoost

    // Kankaan puhdistaminen / päivittäminen
    context.clearRect(0, 0, canvas.width, canvas.height)

    drawBerry()
    drawSnake()
}

requestAnimationFrame(gameLoop)
randomPositionBerry()

function drawSnake() {

    if (!gameInPause) {

        snake.x += snake.dx
        snake.y += snake.dy

        if ( !changeMove ) changeMove = true

        collisionBorder()

        // Vaikuttaa käärmeen ja hännän ulostuloon
        snake.tails.unshift({ x: snake.x, y: snake.y })

        // Poistamme hännän viimeisen osan, jos käärmeen...
        // todellinen pituus on pienempi kuin näytöllä näkyvä
        if (snake.tails.length > snake.maxTails) snake.tails.pop()
    }

    snake.tails.forEach(function (el, index) {

        // Käärmeen pään värin muuttaminen
        if (index == 0) context.fillStyle = "#FA0556"
        // Käärmeen hännän väri muuttuu
        else context.fillStyle = "#A00034"

        // Piirrä käärme (täytä värillä)
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell)


        // Jos käärmeen pää on koordinaateissa, joissa marja sijaitsee, käärme kasvaa
        if (el.x === berry.x && el.y === berry.y) {

            snake.maxTails++
            incScore()
            randomPositionBerry()
        }

        // Jos käärmeen pää on koordinaatistossa, jossa osa sen...
        // hännästä sijaitsee, peli alkaa alusta
        for (let i = index + 1; i < snake.tails.length; i++) {

            if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) refreshGame()
        }
    })
}

// Jos käärme ylittää rajat, se näkyy vastakkaisella puolella
function collisionBorder() {

    if (snake.x < 0) {

        snake.x = canvas.width - config.sizeCell
    } else if (snake.x >= canvas.width) {
        snake.x = 0
    }

    if (snake.y < 0) {

        snake.y = canvas.height - config.sizeCell
    } else if (snake.y >= canvas.height) {
        snake.y = 0
    }
}

// Peli alkaa alusta
function refreshGame() {

    score = 0
    drawScore()

    snake.x = 160
    snake.y = 160
    snake.tails = []
    snake.maxTails = 3
    snake.dx = config.sizeCell
    snake.dy = 0

    randomPositionBerry()
}

// Marjojen piirtäminen
function drawBerry() {

    context.beginPath()
    context.fillStyle = "#A00034"
    context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBerry, 0, 2 * Math.PI)
    context.fill()
}

// Asettaa satunnaisen sijainnin marjalle
function randomPositionBerry() {

    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell
}

function incScore() {

    score++
    drawScore()
}

function drawScore() {

    scoreBlock.innerHTML = score
}

function getRandomInt(min, max) {

    return Math.floor(Math.random() * (max - min) + min)
}


// Laita tauko välilyönti, tai muuttaa kehityskaari käärme
document.addEventListener("keydown", function (e) {

    if (e.key === ' ' || e.key === 'Spacebar') {
        
        if (gameInPause) {

            document.getElementById('id-canvas').style = "filter: blur(0);"
            document.querySelector('.pause-text').innerHTML = ""
            gameInPause = false
        } else {

            document.getElementById('id-canvas').style = "filter: blur(5px);"
            document.querySelector('.pause-text').innerHTML = "PAUSE"
            gameInPause = true
        }
    }

    if ( gameInPause ) return

    if ( e.code == "KeyW" && snake.dy == 0 && changeMove ) {

        snake.dy = -config.sizeCell;
        snake.dx = 0;
    } else if ( e.code == "KeyA" && snake.dx == 0 && changeMove ) {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if ( e.code == "KeyS" && snake.dy == 0 && changeMove ) {
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if ( e.code == "KeyD" && snake.dx == 0 && changeMove ) {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }

    changeMove = false
});
