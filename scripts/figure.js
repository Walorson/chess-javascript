let globalID = 0;
let firstTeamTurn = true;

class Figure {
    constructor(posX, posY, firstTeam=true)
    {
        this.id = globalID;
        this.skin = 'img/figures/pawn0.png';
        this.pos = { x: posX, y: posY };
        this.legalMoves = [];
        this.firstTeam = firstTeam;
        this.div = this.getDiv();
        
        this.init();  
        globalID++;    
    }
    init()
    {
        if(this.firstTeam == false) this.skin = this.skin.replaceChar(this.skin.length-5, '1');
        board.innerHTML += `<div class="figure" id="figure${this.id}"><img src="${this.skin}"></div>`;
        this.render();
        this.dragAndDrop();
    }
    render()
    {
        this.div = this.getDiv();
        this.div.style.top = ((this.pos.y - 1) * 80)+"px";
        this.div.style.left = ((this.pos.x - 1) * 80)+"px";
    }
    getDiv() { return document.getElementById(`figure${this.id}`); }
    //// Position ////
    setPosition(x, y)
    {
        this.pos.x = x;
        this.pos.y = y;
        this.render();
    }
    getPosition()
    {
        return this.pos;
    }
    //// Skin ////
    setSkin(name)
    {
        name = name.replaceChar(name.length-1, '');
        name += (this.firstTeam) ? '0' : '1';
        this.skin = `img/figures/${name}.png`;
        this.div.querySelector("img").setAttribute("src",`img/figures/${name}.png`);
    }
    //// Update ////
    update() { this.div = this.getDiv(); }
    updateLegalMoves()
    {
        this.legalMoves = [{x: this.pos.x, y: this.pos.y }];
    }
    //// DragAndRop /////
    dragAndDrop()
    {
        this.updateLegalMoves();
        let isDrag = false;
     
        this.div.addEventListener("mousedown", () => {
            if(this.firstTeam == firstTeamTurn) isDrag = true;
            this.div.style.zIndex = 2;
        });
        board.addEventListener("mousemove",(e) => {
            if(!isDrag) return;

            let boardRect = board.getBoundingClientRect();
            let boardX = e.clientX - boardRect.left;
            let boardY = -e.clientY + board.offsetHeight + boardRect.top;

            let figureRect = e.target.getBoundingClientRect();
            let figureX = e.clientX - figureRect.left;
            let figureY = e.clientY - figureRect.top;

            this.div.style.top = boardY - 30 + "px";
            this.div.style.left = boardX - 30 + "px";
        });

        board.addEventListener("mouseup",() => {
            isDrag = false;
            this.div.style.zIndex = 1;

            let newY = Math.round(parseInt(this.div.style.top) / 80) + 1;
            let newX = Math.round(parseInt(this.div.style.left) / 80) + 1;
            let newPos = { x: newX, y: newY };

            this.checkLegalMoves(newPos);
            figures.forEach(figure => { figure.updateLegalMoves(); });

            this.render();
        });
    }
    checkLegalMoves(position)
    {
        for(let i=0; i<this.legalMoves.length; i++)
        {
            if(this.legalMoves[i].x > 8 || this.legalMoves[i].y > 8 || this.legalMoves[i].x < 1 || this.legalMoves[i].y < 1) continue;
            let hereIsEnemy = -1; //The number is a ID of enemy
            
            hereIsEnemy = this.checkIfHereEnemy(position);

            if(hereIsEnemy == "friend") continue; //If on the tile is your teammate

            if(Object.compare(position, this.legalMoves[i]))
            {
                nextTurn(); //Zmień ture gracza
                this.pos = position;

                if(hereIsEnemy > -1) destroyFigure(hereIsEnemy);

                if(this.firstMove == false) this.firstMove = true; //Ruch pierwszy został wykonany
                this.updateLegalMoves();
                break;
            }
        }
    }
    setStraightMoves()
    {
        let y = this.pos.y;
        let x = this.pos.x;
        for(let i=y+1; i<= 8; i++) // Sprawdź czy z góry nie ma przeszkody, która zasłania pole
        {
            let pos = { x: this.pos.x, y: i };
            this.legalMoves.push(pos);  // Sprawdzenie następuje później, aby była możliwość nadepnięcia na przeciwnika (jak w szachach)
            if(checkIfTileBusy(pos)) break; //Sprawdź, czy płyka jest zajęta, jeśli jest - to wiadomo, że pion zasłania resztę pól
        }
        for(let i=y-1; i>0; i--) // Teraz sprawdź z dołu
        {
            let pos = { x: this.pos.x, y: i };           
            this.legalMoves.push(pos);
            if(checkIfTileBusy(pos)) break;
        }
        for(let i=x+1; i<=8; i++) // Teraz sprawdź z prawej
        {
            let pos = { x: i, y: this.pos.y  };
            this.legalMoves.push(pos);
            if(checkIfTileBusy(pos)) break;
        }
        for(let i=x-1; i>0; i--) // Teraz sprawdź z lewej
        {
            let pos = { x: i, y: this.pos.y  };
            this.legalMoves.push(pos);
            if(checkIfTileBusy(pos)) break;
        }
    }
    setCrossMoves()
    {
        let j = (8 - this.pos.y >=  8 - this.pos.x) ? (8 - this.pos.x) : (8 - this.pos.y);
        //////// Top - right /////
        for(let i=1; i<=j; i++)
        {
            this.legalMoves.push( { x: this.pos.x + i, y: this.pos.y + i  } );
            if(checkIfTileBusy({ x: this.pos.x + i, y: this.pos.y + i  })) break;
        }
        ////// Bottom - right /////
        j = (this.pos.y - 1 >= this.pos.x - 1) ? this.pos.x - 1 : this.pos.y - 1;
        for(let i=1; i<=j; i++)
        {
            this.legalMoves.push( { x: this.pos.x - i, y: this.pos.y - i  } );
            if(checkIfTileBusy({ x: this.pos.x - i, y: this.pos.y - i  })) break;
        }
        ///// Top - Left //////
        j = (8 - this.pos.y >= this.pos.x - 1) ? this.pos.x - 1 : 8 - this.pos.y;
        for(let i=1; i<=j; i++)
        {
            this.legalMoves.push( { x: this.pos.x - i, y: this.pos.y + i  } );
            if(checkIfTileBusy({ x: this.pos.x - i, y: this.pos.y + i  })) break;
        }
        //// Bottom - Left //////
        j = (this.pos.y - 1 >= 8 - this.pos.x) ? 8 - this.pos.x : this.pos.y - 1;
        for(let i=1; i<=j; i++)
        {
            this.legalMoves.push( { x: this.pos.x + i, y: this.pos.y - i  } );
            if(checkIfTileBusy({ x: this.pos.x + i, y: this.pos.y - i  })) break;
        }
    }
    checkIfHereEnemy(position)
    {
        let firstTeamCount = getFirstTeamCount(); //Policz ile jest figur z 1. drużyny, jeśli to wiadomo, to i wiadomo ile jest figur w 2. drużynie

        if(this.firstTeam) {
            for(let j=0; j<figures.length; j++)
            {
                if(Object.compare(position, figures[j].pos) && j < firstTeamCount)
                {
                    return "friend";
                }
                else if(Object.compare(position, figures[j].pos) && j >= firstTeamCount)
                {
                    return j;
                }
            }
        }
        else {
            for(let j=0; j<figures.length; j++)
            {
                if(Object.compare(position, figures[j].pos) && j >= firstTeamCount)
                {
                    return "friend";
                }
                else if(Object.compare(position, figures[j].pos) && j < firstTeamCount)
                {
                    return j;
                }
            }
        }
    }
    extraMoves() {}
}

class Pawn extends Figure {
    constructor(posX, posY, firstTeam) {
        super(posX, posY, firstTeam);
        this.firstMove = false;
    }
    updateLegalMoves()
    {
        this.legalMoves = [];
        if(this.firstTeam && !checkIfTileBusy({x: this.pos.x, y: this.pos.y+1 })) this.legalMoves.push({x: this.pos.x, y: this.pos.y+1 }); //Dla drużyny 1
        else if(!this.firstTeam && !checkIfTileBusy({x: this.pos.x, y: this.pos.y-1 })) this.legalMoves.push({x: this.pos.x, y: this.pos.y-1 }); //Dla drużyny 2

        if(this.firstMove == false && this.firstTeam && !checkIfTileBusy({ x: this.pos.x, y: this.pos.y+1 }))  //Dla drużyny 1
        { 
            this.legalMoves.push({ x: this.pos.x, y: this.pos.y+2 });
        }
        else if(this.firstMove == false && !this.firstTeam && !checkIfTileBusy({ x: this.pos.x, y: this.pos.y-1 })) //Dla drużyny 2
        {
            this.legalMoves.push({ x: this.pos.x, y: this.pos.y-2 });
        }
        //// Ruch zbicia przeciwnika
        //// Dla drużyny 1
        if(this.firstTeam) {
            if(this.checkIfHereEnemy({x: this.pos.x-1, y: this.pos.y+1}) > -1)
                this.legalMoves.push({x: this.pos.x-1, y: this.pos.y+1});
            if(this.checkIfHereEnemy({x: this.pos.x+1, y: this.pos.y+1}) > -1)
                this.legalMoves.push({x: this.pos.x+1, y: this.pos.y+1});
        }
        //// Dla drużyny 2
        else {
            if(this.checkIfHereEnemy({x: this.pos.x-1, y: this.pos.y-1}) > -1)
                this.legalMoves.push({x: this.pos.x-1, y: this.pos.y-1});
            if(this.checkIfHereEnemy({x: this.pos.x+1, y: this.pos.y-1}) > -1)
                this.legalMoves.push({x: this.pos.x+1, y: this.pos.y-1});
        }
    }
}

class Rook extends Figure {
    constructor(posX, posY, firstTeam) {
        super(posX, posY, firstTeam);
        this.setSkin("rook0");
    }
    updateLegalMoves()
    {
        this.legalMoves = [];
        this.setStraightMoves();
    }
}

class Bishop extends Figure {
    constructor(posX, posY, firstTeam) {
        super(posX, posY, firstTeam);
        this.setSkin("bishop0");
    }
    updateLegalMoves()
    {
        this.legalMoves = [];
        this.setCrossMoves();
    }
}

class Knight extends Figure {
    constructor(posX, posY, firstTeam) {
        super(posX, posY, firstTeam);
        this.setSkin("knight0");
    }
    updateLegalMoves()
    {
        this.legalMoves = [];
        this.legalMoves.push({ x: this.pos.x - 1, y: this.pos.y + 2 }); // up up left
        this.legalMoves.push({ x: this.pos.x + 1, y: this.pos.y + 2 }); // up up right
        this.legalMoves.push({ x: this.pos.x - 1, y: this.pos.y - 2 }); // down down left
        this.legalMoves.push({ x: this.pos.x + 1, y: this.pos.y - 2 }); // down down right
        this.legalMoves.push({ x: this.pos.x - 2, y: this.pos.y + 1 }); // up left left
        this.legalMoves.push({ x: this.pos.x + 2, y: this.pos.y + 1 }); // up right right
        this.legalMoves.push({ x: this.pos.x - 2, y: this.pos.y - 1 }); // down left left
        this.legalMoves.push({ x: this.pos.x + 2, y: this.pos.y - 1 }); // down right right
    }
}

class Queen extends Figure {
    constructor(posX, posY, firstTeam) {
        super(posX, posY, firstTeam);
        this.setSkin("queen0");
    }
    updateLegalMoves()
    {
        this.legalMoves = [];
        this.setStraightMoves();
        this.setCrossMoves();
    }
}

class King extends Figure {
    constructor(posX, posY, firstTeam) {
        super(posX, posY, firstTeam);
        this.setSkin("king0");
    }
    updateLegalMoves()
    {
        this.legalMoves = [];
        this.legalMoves.push({ x: this.pos.x, y: this.pos.y + 1 }); //top
        this.legalMoves.push({ x: this.pos.x + 1, y: this.pos.y + 1 }); //topRight
        this.legalMoves.push({ x: this.pos.x + 1, y: this.pos.y }); //Right
        this.legalMoves.push({ x: this.pos.x + 1, y: this.pos.y - 1 }); //bottomRight
        this.legalMoves.push({ x: this.pos.x, y: this.pos.y - 1 }); //bottom
        this.legalMoves.push({ x: this.pos.x - 1, y: this.pos.y - 1 }); //bottomLeft
        this.legalMoves.push({ x: this.pos.x - 1, y: this.pos.y }); //Left
        this.legalMoves.push({ x: this.pos.x - 1, y: this.pos.y + 1 }); //LeftTop
    }
}

function checkIfTileBusy(position)
{
    for(let j=0; j<figures.length; j++)
    {
        if(Object.compare(position, figures[j].pos))
        {
            return true;
        }
    }
    return false;
}
function destroyFigure(ID)
{
    checkIfKingLive(ID);

    figures[ID].div.remove();
    delete figures[ID];
    let newArray = [];
    for(let i=0; i<figures.length; i++)
    {
        if(figures[i] != undefined) newArray.push(figures[i]);
    }
    figures = newArray;

    updateFiguresCount();
}
function getFirstTeamCount()
{
    let firstTeamCount = 0;
    for(let i=0; i<figures.length; i++)
    {
        if(figures[i].firstTeam) firstTeamCount++;
    }
    return firstTeamCount;
}
function checkIfKingLive(ID)
{
    let firstTeamCount = getFirstTeamCount();

    if(figures[ID].id < firstTeamCount && figures[ID] instanceof King) {
        freezeGame();
        printText("Żółci wygrali!");
        renderButton("Zagraj jeszcze raz");
    }
    else if(figures[ID] instanceof King) {
        freezeGame();
        printText("Biali wygrali!");
        renderButton("Zagraj jeszcze raz");
    }
}
Object.prototype.compare = function(object1, object2) {
    if(JSON.stringify(object1) == JSON.stringify(object2)) return true;
    else return false;
}
String.prototype.replaceChar = function(pos, char) {
    if(char == undefined) return;
    return this.slice(0, pos) + char + this.slice(pos+1, this.length);
}