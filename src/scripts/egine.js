const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        curretTime: 60,
        lives: 3, 
        goal: 10, 
        bestScore: 0, 

    },
    actions: {
        timerId: setInterval(randomSquare, 1000),
        countDownTimerId: setInterval(countDown, 1000),
    },
};

function countDown() {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;

    if (state.values.curretTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);

        if (state.values.result >= state.values.goal) {
            // Se o jogador atingir a meta
            state.values.bestScore = Math.max(state.values.bestScore, state.values.result);
            alert("Parabéns, você atingiu a meta!");

            if (state.values.goal === 30) {
                // Jogo zerado, mostrar botões de reiniciar e encerrar
                alert("Você zerou o jogo!");
                showEndGameButtons();
            } else {
                increaseDifficulty(); // Aumentar dificuldade
                resetGame(); // Reiniciar o jogo
            }
        } else {
            // Se não atingir a meta, perde uma vida
            state.values.lives--;
            document.querySelector('.menu-lives h2').textContent = "X" + state.values.lives;
            
            if (state.values.lives > 0) {
                alert("Game Over! Você perdeu uma vida!");
                resetGame(); // Reinicia o jogo
            } else {
                alert("Game Over! Suas vidas acabaram.");
                showEndGameButtons(); // Exibe os botões de fim de jogo
            }
        }
    }
}

// Função que aumenta a dificuldade ao atingir a meta
function increaseDifficulty() {
    state.values.goal += 5; // Aumenta a meta em 5 pontos
    state.values.gameVelocity -= 200; // Diminui o tempo em 200ms para o Ralph aparecer mais rápido

    clearInterval(state.actions.timerId); // Reinicia o timer com a nova velocidade
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// Função que exibe os botões de fim de jogo
function showEndGameButtons() {
    document.querySelector('.endgame').style.display = "block";
}

// Função que reinicia o jogo sem recarregar a página
function resetGame() {
    state.values.result = 0;
    state.view.score.textContent = state.values.result;
    state.values.curretTime = 60;
    state.view.timeLeft.textContent = state.values.curretTime;
    
    // Reiniciar os timers
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

document.querySelector("#restart-btn").addEventListener("click", () => {
    document.querySelector('.endgame').style.display = "none";
    state.values.lives = 3;
    state.values.goal = 10;
    state.values.gameVelocity = 1000;
    resetGame();
});

document.querySelector("#quit-btn").addEventListener("click", () => {
    alert("Obrigado por jogar!");
    window.close(); // Fecha a janela do navegador (não funciona em todos os navegadores)
});


function playSound(audioName){
    let audio = new Audio(`./src/audio/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition){
                state.values.result++
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");                            
            }
        });        
    });
}

function showEndGameButtons() {
    document.querySelector('.endgame').style.display = 'flex';

    document.querySelector('#restart-btn').addEventListener('click', () => {
        location.reload(); // Reinicia o jogo
    });

    document.querySelector('#quit-btn').addEventListener('click', () => {
        alert("Jogo encerrado. Obrigado por jogar!");
        window.close(); // Fecha a aba do navegador
    });
}


function init() {
    addListenerHitBox();
}

init();