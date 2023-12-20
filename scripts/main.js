const board = document.getElementById("board");
const alphabet = ['a','b','c','d','e','f','g','h'];
const tiles = [];
let figures = [];

const generateBoard = () => {
    let first, second;
    for(let i=0; i<8; i++) 
    {
        for(let j=0; j<8; j++)
        {
            if(i % 2 == 0) { first = 1; second = 0 }
            else { first = 0; second = 1; }

            let id = `${i+1}${alphabet[j]}`;

            if(j % 2 == 0) board.innerHTML += `<img src="img/board${first}.png" id="${id}">`;
            else board.innerHTML += `<img src="img/board${second}.png" id="${id}">`;
        }
    }
}
const createFiguresTemplate = () => {
    for(let i=1; i<=8; i++)
        figures.push(new Pawn(i, 2));

    figures.push(new Rook(1,1), new Knight(2,1), new Bishop(3,1), new Queen(4, 1), new King(5, 1), new Bishop(6, 1), new Knight(7, 1), new Rook(8, 1));

    /// Enemy
    for(let i=1; i<=8; i++)
        figures.push(new Pawn(i, 7, false));

    figures.push(new Rook(1,8,false), new Knight(2,8,false), new Bishop(3,8,false), new Queen(4,8,false), new King(5,8,false), new Bishop(6,8,false), new Knight(7,8,false), new Rook(8,8,false));

    figures.forEach(figure => {
        figure.update();
        figure.dragAndDrop();
    });   
}
const updateFiguresCount = () => {
    document.getElementById("team1count").innerHTML = "x"+getFirstTeamCount();
    document.getElementById("team2count").innerHTML = "x"+(figures.length - getFirstTeamCount());
}
const nextTurn = () => {
    if(firstTeamTurn) {
        document.getElementById("team1circle").style.opacity = 0;
        document.getElementById("team2circle").style.opacity = 1;
        firstTeamTurn = false;
    }
    else {
        document.getElementById("team2circle").style.opacity = 0;
        document.getElementById("team1circle").style.opacity = 1;
        firstTeamTurn = true;
    }
}
const printText = (text) => {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    div.setAttribute('class','text');
    document.body.appendChild(div);
}
const freezeGame = () => {
    let div = document.createElement('div');
    div.setAttribute('class','freeze');
    document.body.append(div);
}
const renderButton = (text) => {
    document.querySelector(".text").innerHTML += `<button>${text}</button>`;
    document.querySelector("button").onclick = () => document.location.reload();
}

generateBoard();
createFiguresTemplate();