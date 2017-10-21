const beginnerHeight = 9;
const beginnerWidth = 9;
const beginnerBombCount = 10;

const intermediateHeight = 16;
const intermediateWidth = 16;
const intermediateBombCount = 40;

const expertHeight = 16;
const expertWidth = 30;
const expertBombCount = 99;

let gameHeight = 16;
let gameWidth = 16;
let gameBombCount = 40;

let seconds = 0;
//let counter = 0;

let paused = true;

class Minefield {

    constructor(height, width, bombCount) {
        this.gameOver = false;
        this.generated = false;
        this.height = height;
        this.width = width;
        this.bombCount = bombCount;
        this.visibleCount = height * width;
        this.board = new Array(height);
        this.visible = new Array(height);
        this.unclickedImg = new Image();
        this.unclickedImg.src = "unclickedImg.png"
        this.bombImg = new Image();
        this.bombImg.src = "bombImg.png";
        this.blankImg = new Image();
        this.blankImg.src = "blankImg.png";
        this.oneImg = new Image();
        this.oneImg.src = "oneImg.png";
        this.twoImg = new Image();
        this.twoImg.src = "twoImg.png";
        this.threeImg = new Image();
        this.threeImg.src = "threeImg.png";
        this.fourImg = new Image();
        this.fourImg.src = "fourImg.png";
        this.fiveImg = new Image();
        this.fiveImg.src = "fiveImg.png";
        this.sixImg = new Image();
        this.sixImg.src = "sixImg.png";
        this.sevenImg = new Image();
        this.sevenImg.src = "sevenImg.png";
        this.eightImg = new Image();
        this.eightImg.src = "eightImg.png";
        this.flagImg = new Image();
        this.flagImg.src = "flagImg.png";
        this.c = document.getElementById("gameBoard").getContext("2d");
        this.imgLength = 20;
    }
    //This function intitializes the values the board arrays to all 0
    initializeBoard() {
        console.log("initializing a ", this.height, 'by ', this.width)
        this.visibleCount = this.height * this.width;
        for (let i = 0; i < this.height; i++) {
            this.board[i] = new Array(this.width);
            this.visible[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                this.board[i][j] = 0;
                this.visible[i][j] = 0;
            }
        }
    }
    initiate() {
        this.gameOver = false;
        this.generated = false;
        this.resizeBoard();
        this.drawCanvas();
        this.initializeBoard();
    }
    //This function draws the intial unclicked boxes onto the canvas
    //It is called whenever the game is reset
    drawCanvas() {
        this.c.clearRect(0, 0, 600, 600);
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                this.c.drawImage(this.unclickedImg, this.imgLength * j, this.imgLength * i);
            }
        }
    }

    setFlag(i, j) {
        if (i >= this.height || j >= this.width) {
            return;
        }
        if (this.visible[i][j] === 1) {
            console.log('either already a flag or is already revealed');
            return;
        } else if (this.visible[i][j] === -1) {
            this.c.drawImage(this.unclickedImg, this.imgLength * j, this.imgLength * i);
            this.visible[i][j] = 0;
        } else {
            console.log('setting flag');
            this.c.drawImage(this.flagImg, this.imgLength * j, this.imgLength * i);
            this.visible[i][j] = -1;
        }


    }
    getImage(i, j) {
        //    console.log(j + " " +i);
        //console.log(board[i][j]);
        let numToReveal = this.board[i][j];
        if (numToReveal === 0) {
            return this.blankImg;
        } else if (numToReveal === 1) {
            return this.oneImg;
        } else if (numToReveal === 2) {
            return this.twoImg;
        } else if (numToReveal === 3) {
            return this.threeImg;
        } else if (numToReveal === 4) {
            return this.fourImg;
        } else if (numToReveal === 5) {
            return this.fiveImg;
        } else if (numToReveal === 6) {
            return this.sixImg;
        } else if (numToReveal === 7) {
            return this.sevenImg;
        } else if (numToReveal === 8) {
            return this.eightImg;
        }
    }
    setBombsVisible() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] === -1) {
                    this.c.drawImage(this.bombImg, this.imgLength * j, this.imgLength * i);
                }
            }
        }
    }

    //This function is called by generate numbers
    //Parameters: a spot on the board
    //Returns: How many bombs are touching the passed in index
    //Purpose: This is called when initializing the board. The board is only filled with bombs at this point.
    //This function is called many times to calculate each individual bomb count
    getNearCount(i, j) {
        let result = 0;
        for (let row = i - 1; row < i + 2; row++) {
            for (let col = j - 1; col < j + 2; col++) {
                if (row >= 0 && col >= 0 && row < this.height && col < this.width) {
                    if (this.board[row][col] === -1) {
                        result++;
                    }
                }
            }
        }
        return result;
    }

    //This function is called after a click happens
    //It sets the apropriate squares to be visible
    //If it is already set to visibile it immediately returns.
    //If the index that was clicked on has no nearby bombs i.e. the value is 0
    //  a recursive depth first traversal of nearby blocks are done
    //  in which all touching blocks with value 0 are shown and all the blocks touching the revealed 0's are shown
    //Parameters: i , j (the index clicked)
    setVisible(i, j) {
        let zero = false;
        if (this.visible[i][j] === 1) {
            return;
        }
        if (this.board[i][j] === 0) {
            zero = true;
        }
        if (this.board[i][j] === -1) {
            this.visible[i][j] = 1;
            console.log("Clicked on a bomb noob");
            this.c.drawImage(this.bombImg, this.imgLength * j, this.imgLength * i);
            this.lose();
            return;
        }
        //console.log("working on " + i + " " + j);
        this.visible[i][j] = 1;
        this.getImage(i, j);
        this.c.drawImage(this.getImage(i, j), this.imgLength * j, this.imgLength * i);
        this.visibleCount--;
        for (var row = i - 1; row < i + 2; row++) {
            for (var col = j - 1; col < j + 2; col++) {
                if (row >= 0 && col >= 0 && row < this.height && col < this.width) {
                    if (this.board[row][col] === 0 && this.visible[row][col] != 1) {
                        //    console.log("neighbor " + row + " " + col + " is a 0");
                        this.setVisible(row, col);
                    } else if (this.board[row][col] != 0 && zero && this.visible[row][col] != 1) {
                        //    console.log("setting " +row + " " + col + " visible ");
                        this.visible[row][col] = 1;
                        this.c.drawImage(this.getImage(row, col), this.imgLength * col, this.imgLength * row);
                        this.visibleCount--;

                    }
                }
            }
        }
    }


    setBombstoFlags() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] === -1) {
                    this.c.drawImage(this.flagImg, this.imgLength * j, this.imgLength * i);
                }
            }
        }
    }



    //This function sets indexes on the board to be equal to bombs.
    //It is called when the first click is done.
    //It will not generate a bomb on the index that was clicked
    //Parameters: clicked index
    generateBombs(i, j) {
        //If the bomb count is higher than the total amount of available indexes
        //The bomb count is set to the total indexes - 1
        if (this.bombCount > this.width * this.height) {
            this.bombCount = this.width * this.height - 1;
        }
        for (let count = 0; count < this.bombCount; count++) {
            //console.log( + "  " + ());
            let row = Math.floor(Math.random() * this.height);
            let column = Math.floor(Math.random() * this.width);
            console.log(i, j, 'i j');


            console.log(row, column, 'row col');

            if (this.board[row][column] == -1 || (i === row && j === column)) {
                let index = this.findValidIndex(row, column, i, j);
                row = index[0];
                column = index[1];

            }
            this.board[row][column] = -1
        }
        console.log(this.bombCount);
    }


    findValidIndex(row, column, i, j) {
        while (true) {
            column++;
            if (column >= this.width) {
                column = 0;
                row++;
            }
            if (row >= this.height) {
                row = 0;
            }
            if (!(i === row && j === column)) {
                if (this.board[row][column] != -1) {
                    return [row, column];
                }
            }

        }
    }

    //This function fills the non-bomb indexes in the board
    //It takes in no parameters and returns nothing
    //Goes through one index at a time, checks if it's a bomb
    //If it's not a bomb, it calls getNearCount to calculate the apropriate number.
    generateNumbers() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.board[i][j] != -1) {
                    this.board[i][j] = this.getNearCount(i, j);
                }
            }
        }
    }

    win() {
        if (this.visibleCount === this.bombCount) {
            console.log("you win!");
            this.setBombstoFlags();
            result.innerHTML = "You win!";
            this.gameOver = true;
            //setTimeout(sendScore, 25);
        }
    }
    lose() {
        this.gameOver = true;
        this.setBombsVisible();
        result.innerHTML = "You lose!";


    }
    onclick(e) {
        let mouseX = e.pageX;
        let mouseY = e.pageY - 28;
        console.log(mouseX, mouseY);
        let clickedCol = Math.floor(mouseY / this.imgLength);
        let clickedRow = Math.floor(mouseX / this.imgLength);

        if (!this.generated && clickedRow < this.width && clickedCol < this.height) {
            console.log("generating board");
            this.generateBombs(clickedCol, clickedRow);
            this.generateNumbers();
            this.generated = true;
        }
        if (this.gameOver) {
            return;
        }

        if (e.altKey) {
            this.setFlag(clickedCol, clickedRow);
        } else if (Math.floor(mouseX / this.imgLength) < this.width && Math.floor(mouseY / this.imgLength) < this.height) {
            //    console.log(Math.floor(mouseX/imgLength) + " " + Math.floor(mouseY/imgLength));
            if (this.visible[clickedCol][clickedRow] === 0) {
                this.setVisible(clickedCol, clickedRow);
            }
        }
        this.win();
    }
    onRightClick(e) {
        let mouseX = e.pageX;
        let mouseY = e.pageY - 28;

        let clickedCol = Math.floor(mouseY / this.imgLength);
        let clickedRow = Math.floor(mouseX / this.imgLength);

        this.setFlag(clickedCol, clickedRow);
    }

    resizeBoard() {
        let resize = document.getElementById("gameBoard")
        resize.height = this.height * this.imgLength;
        resize.width = this.width * this.imgLength;
        console.log(resize.height, resize.width);
    }

}
var resetButton = document.getElementById("reset");
var result = document.getElementById("result");
var timer = document.getElementById("timer");
resetButton.onclick = function(e) {

    reset();
};


function reset() {
    let difficulty = document.getElementsByName('difficulty');
    for (let i = 0; i < difficulty.length; i++) {
        if (difficulty[i].checked) {
            console.log(difficulty[i].id);
            setDifficulty(difficulty[i].id);
        }
    }

    seconds = 0;
    timer.innerHTML = "0";
    stopCycle();
    //console.log('reset');

    field.drawCanvas();

    field.initiate();

    result.innerHTML = "";
    //  initiate();
}

var setDifficulty = function(difficulty) {
    if (difficulty == 'beginner') {
        console.log('setting to beginner');
        field.width = beginnerWidth;
        field.height = beginnerHeight;
        field.bombCount = beginnerBombCount;
    } else if (difficulty == 'intermediate') {
        console.log('setting to intermediate');
        field.width = intermediateWidth;
        field.height = intermediateHeight;
        field.bombCount = intermediateBombCount;

    } else if (difficulty == 'expert') {
        console.log('setting to expert');
        field.width = expertWidth;
        field.height = expertHeight;
        field.bombCount = expertBombCount;
    }

}




let field = new Minefield(gameHeight, gameWidth, gameBombCount);
gameBoard.onclick = function(e) {
    if(paused) {
        startTimer();
    }
    paused = false;


    field.onclick(e);
}

function startTimer() {
    var counter = setInterval(function() {
        if (paused || field.gameOver) {

            clearInterval(counter);
            return;
        }
        seconds++;
        timer.innerHTML = seconds;
        console.log(seconds);

    }, 1000);

}

function stopCycle() {
    paused = true;

}



gameBoard.oncontextmenu = function(e) {
    field.onRightClick(e);
    return false;
};
field.initializeBoard();


field.unclickedImg.onload = function() {
    field.drawCanvas();
}




/*
function sleep(50) {
  field.bombImg.onload = function() {
    field.setBombsVisible();
  }
}
*/




//field.setBombsVisible();
