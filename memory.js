let divOpened;
let timeoutState = false;
let steps = 0;
let picturesArray = [];
let cells = 0;
window.onload = playgame;
function playgame() {
    let memoryGame = JSON.parse(localStorage.getItem("memoryGame"));
    if (memoryGame) {
        picturesArray = memoryGame.picturesArray;
        steps = memoryGame.steps;
        cells = memoryGame.cells;
        document.getElementById('btndiv').style.display = 'none';
        createBoardViews();
    } else {
        document.getElementById('btndiv').style.display = '';
    }
}

function createBoardViews() {
    let tbody = document.getElementById('tbody');
    for (let i = 1, x = 0; i <= 4; i++, x += (cells / 4)) {
        let tr = document.createElement("tr");
        tr.id = `row${i}`;
        tbody.appendChild(tr);
        for (let j = 1; j <= cells / 4; j++) {
            let index = (j + x);
            let src = picturesArray[index - 1]["src"];
            let img = document.createElement('img');
            let cover = document.createElement('img');
            let div = document.createElement("div")
            cover.src = `./imgs/background.jpg`;
            cover.id = "coverId";
            div.onclick = toggle;
            img.src = src;
            img.id = `img${index}`;
            img.index = index;
            div.pictureObj = picturesArray[index - 1]
            img.classList.add('imgClick');
            img.setAttribute('index', index);
            div.className = "divContainer";
           
            // if (div.pictureObj.state == "match") {
            //     cover.className = "back-hidden";
            // }
            let td = document.createElement('td');
            td.id = `td${index}`;
            div.appendChild(img);
            div.appendChild(cover);
            td.appendChild(div)
            tr.appendChild(td);
            changeImageVisibility(div.pictureObj.state == "match", div)
        }
    }

}

function createBoard(c) {
    document.getElementById('btndiv').style.display = 'none';
    cells = c;


    for (let i = 1; i <= cells / 2; i++) {
        let pictureObj1 = {};
        let pictureObj2 = {};
        pictureObj1.src = `./imgs/${i}.jpg`;
        pictureObj2.src = `./imgs/${i}.jpg`;
        pictureObj1.setID = `set${i}`;
        pictureObj2.setID = `set${i}`;
        pictureObj1.state = "unknown";
        pictureObj2.state = "unknown";
        picturesArray.push(pictureObj1, pictureObj2)
    }
    shuffleArray(picturesArray);
    createBoardViews();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function toggle() {
    if (timeoutState) {
        return;
    }
    changeImageVisibility(true, this);
    if (divOpened) {
        // second click
        timeoutState = true;
        setTimeout(checkMatch, 1500, this, divOpened);
        steps++;
        document.getElementById("steps").innerHTML = steps;
    } else {
        // first click
        divOpened = this;
    }
}
function checkMatch(div1, div2) {
    let pictureObj1 = div1.pictureObj;
    let pictureObj2 = div2.pictureObj;

    if (pictureObj1.setID == pictureObj2.setID) {
        pictureObj1.state = "match";
        pictureObj2.state = "match";
        div1.children[0].classList.add("blink-me");
        div2.children[0].classList.add("blink-me");
    } else {
        changeImageVisibility(false, div1);
        changeImageVisibility(false, div2);
        // div1.children[1].classList.remove("back-hidden")
        // div2.children[1].classList.remove("back-hidden")
    }
    timeoutState = false;
    divOpened = null;
    saveGame(picturesArray, steps, cells);
    endGame();
}

function endGame() {
    let matched = matchBoolean();
    if (matched) {
        console.log("hi");
        document.getElementById('btndiv').style.display = '';
        steps = 0;
        window.localStorage.removeItem('memoryGame');
        let tbody = document.getElementById("tbody");
        // document.getElementById("tbody").style.display = "none"
        picturesArray = [];
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        document.getElementById("steps").innerHTML =""
    }

}
function saveGame(picturesArray, steps, cells) {
    let memoryGame = {
        picturesArray,
        steps,
        cells
    }
    localStorage.setItem("memoryGame", JSON.stringify(memoryGame));

}
function matchBoolean() {
    let state = true;
    let memoryGame = JSON.parse(localStorage.getItem("memoryGame"));
    console.log(memoryGame.picturesArray.length);
    for (let i = 0; i < memoryGame["picturesArray"].length; i++) {
        if (memoryGame.picturesArray[i].state == "unknown") {
            state = false;
            return state;
        }
    }
    return state;
}

function changeImageVisibility(showImg, div) {
    if(showImg) {
        div.children[0].classList.remove("back-hidden")
        div.children[1].classList.add("back-hidden")
    } else {
        div.children[1].classList.remove("back-hidden")
        div.children[0].classList.add("back-hidden")
    }
}