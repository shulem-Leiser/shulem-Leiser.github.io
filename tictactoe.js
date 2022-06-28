document.body.onload = addBox;
let box;
let player1 = { name: '', shape: 'o' }
let player2 = { name: '', shape: 'x', progress: [] }
player1.name = JSON.parse(window.localStorage.getItem("loggedUser"));
window.localStorage.setItem("opponent", JSON.stringify(player2));
let curentPlayer = player1;
let playerWon = null;
const row = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
[1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
let plName = document.getElementById("plName");
plName.innerHTML = `${curentPlayer.name}'s turn`;
const gameState = JSON.parse(window.localStorage.getItem("gameState")) || {};

function addBox() {
    for (let index = 1; index < 10; index++) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "box");
        newDiv.boxNumber = index;
        newDiv.id = "box" + index;
        document.getElementById("nine").appendChild(newDiv);
        newDiv.addEventListener("click", playerTurn);
    }
    if (gameState.name1) {
        restoreProgress();
    } else {
        player2.name = prompt("what\'s your name 2nd player?");
    }
}
function restoreProgress() {
    player2.name = JSON.parse(window.localStorage.getItem("gameState")).name2
    curentPlayer = gameState.curentPlayer;
    plName.innerHTML = `${curentPlayer}'s turn`;
    createImg(1, "o");
    createImg(2, "x");
}
function createImg(player, shape) {
    for (let i = 0; i < gameState.progress1.length; i++) {
        const newImg = document.createElement("img");
        const progress = `progress${player}`
        let div = document.getElementById(`box${gameState[progress][i]}`);
        newImg.setAttribute("src", `./imgs/${shape}.png`)
        div.appendChild(newImg);
        div.shape = shape;
        console.log(newImg);
    }
}
function playerTurn() {
    if (playerWon) {
        return;
    }
    const newImg = document.createElement("img");
    let activePlayer = curentPlayer;
    // let shape = this.shape;
    if (this.firstChild) {
        return alert("box is already in use")
    }
    else if (curentPlayer == player1) {
        newImg.setAttribute("src", "./imgs/o.png");
        this.appendChild(newImg);
        this.shape = "o";
        curentPlayer = player2;
        plName.innerHTML = `${curentPlayer.name}'s turn`;
    }
    else {
        newImg.setAttribute("src", "./imgs/x.png");
        this.appendChild(newImg);
        this.shape = "x"
        curentPlayer = player1;
        plName.innerHTML = `${curentPlayer.name}'s turn`;
    }
    let won = arrayOfShape(this.shape);
    if (won) {
        playerWon = activePlayer;
        plName.innerHTML = `${activePlayer.name} has won!`
        // setTimeout(alert, 200, `${activePlayer.name} has won!`);
        plName.style.backgroundColor = "pink";
        plName.style.color = "black";

        marker(won);
    }
}


//function creates array of clicked cells for each user.
function arrayOfShape(shape) {
    let divArray = [...document.querySelectorAll(".box")];
    let currentArray = divArray.filter(x => x.shape == shape).map(x => x.boxNumber);
    saveProgress(currentArray, shape, divArray);
    return winner(currentArray);
}
// function returns true when there's a winner
function winner(currentArray) {
    for (let i = 0; i < row.length; i++) {
        if (row[i].every(num => { return currentArray.includes(num) })) {
            return row[i]
        }
    }
}
// function saves current progress of game
function saveProgress(currentArray, shape, divArray) {
    let users = JSON.parse(window.localStorage.getItem("users"));
    let userIndex = (JSON.parse(window.localStorage.getItem("userIndex")));
    let opponent = JSON.parse(window.localStorage.getItem("opponent"));
    gameState.name1 = player1.name;
    gameState.name2 = player2.name;
    gameState.curentPlayer = curentPlayer.name;
    
    if (winner(currentArray)) {
        users[userIndex].progress = [];
        window.localStorage.setItem("users", JSON.stringify(users));
        opponent.progress = [];
        window.localStorage.setItem("opponent", JSON.stringify(opponent));
        window.localStorage.removeItem('gameState');
        return;
    }
    if (shape == "o") {
        users[userIndex].progress = [...currentArray];
        gameState.progress1 = [...currentArray]
        window.localStorage.setItem("users", JSON.stringify(users));
        window.localStorage.setItem("gameState", JSON.stringify(gameState));
    } else {
        opponent.progress = [...currentArray];
        gameState.progress2 = [...currentArray]
        window.localStorage.setItem("opponent", JSON.stringify(opponent))
        window.localStorage.setItem("gameState", JSON.stringify(gameState));
    }
    if (gameOver()) {
        users[userIndex].progress = [];
        window.localStorage.setItem("users", JSON.stringify(users));
        opponent.progress = [];
        window.localStorage.setItem("opponent", JSON.stringify(opponent));
        window.localStorage.removeItem('gameState');
        plName.innerHTML = `game over !!`;  
        return addBox;
    }
}

// function marks with CSS the cells that won 
function marker(winnerArray) {
    for (let i = 0; i < 3; i++) {
        let box = document.getElementById(`box${winnerArray[i]}`);
        box.classList.add("class", "boxWon");
    }
}
function gameOver() {
    const fullBox = document.getElementsByTagName("img")
    if (fullBox.length < 9) {
        return false
    }else{
        return true
    }
}
