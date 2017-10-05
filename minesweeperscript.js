
var baseUrl = 'http://73.211.130.59:3000'

var height = 16;
var width = 16;
var bombCount = 25;
var imgLength = 20;
var visibleCount = height * width;

var startTime;

var mouseX;
var mouseY;

var clickedRow;
var clickedCol;

var gameOver = false;
var generated = false;

var resetButton = document.getElementById("reset");
var result = document.getElementById("result");
var canvas = document.getElementById("gameBoard");
var c = canvas.getContext("2d");
var unclickedImg;
var blankImg;
var bombImg;
var oneImg;
var twoImg;
var threeImg;
var fourImg;
var fiveImg;
var sixImg;
var sevenImg;
var eightImg;
var flagImg;

var board = new Array(height);
var visible = new Array(height);

var initializeBoard = function() {
    visibleCount = height * width;
    for (i = 0; i < height; i++) {
        board[i] = new Array(width);
        visible[i] = new Array(width);
        for (j = 0; j < width; j++) {
            board[i][j] = 0;
            visible[i][j] = 0;
        }
    }
};


//Initiate is called in two different situations
//
var initiate = function() {
    gameOver = false;
    generated = false;
    unclickedImg = new Image();
    unclickedImg.src = "unclickedImg.png";
    blankImg = new Image();
    blankImg.src = "blankImg.png";
    bombImg = new Image();
    bombImg.src = "bombImg.png";
    oneImg = new Image();
    oneImg.src = "oneImg.png";
    twoImg = new Image();
    twoImg.src = "twoImg.png";
    threeImg = new Image();
    threeImg.src = "threeImg.png";
    fourImg = new Image();
    fourImg.src = "fourImg.png";
    fiveImg = new Image();
    fiveImg.src = "fiveImg.png";
    sixImg = new Image();
    sixImg.src = "sixImg.png";
    sevenImg = new Image();
    sevenImg.src = "sevenImg.png";
    eightImg = new Image();
    eightImg.src = "eightImg.png";
    flagImg = new Image();
    flagImg.src = "flagImg.png";
    unclickedImg.onload = function() {
        drawCanvas();
        initializeBoard();
    }
    startTime = new Date();
    //

}

//This function draws the intial unclicked boxes onto the canvas
//It is called whenever the game is reset
var drawCanvas = function() {
    c.clearRect(0, 0, 600, 600);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            c.drawImage(unclickedImg, imgLength * j, imgLength * i);
        }
    }
}

//This function sets indexes on the board to be equal to bombs.
//It is called when the first click is done.
//It will not generate a bomb on the index that was clicked
//Parameters: clicked index
var generateBombs = function(i, j) {
    //console.log('cannot be on' + i + " " + j);
    for (var count = 0; count < bombCount; count++) {
        //console.log( + "  " + ());
        var row = Math.floor(Math.random() * height);
        var column = Math.floor(Math.random() * width);
        if (board[row][column] == -1 || (i === row && j === column)) {
            count--;
        } else {
            board[row][column] = -1;
        }
    }
}

//This function fills the non-bomb indexes in the board
//It takes in no parameters and returns nothing
//Goes through one index at a time, checks if it's a bomb
//If it's not a bomb, it calls getNearCount to calculate the apropriate number.
var generateNumbers = function() {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (board[i][j] != -1) {
                board[i][j] = getNearCount(i, j);
            }
        }
    }
}


//This function is called by generate numbers
//Parameters: a spot on the board
//Returns: How many bombs are touching the passed in index
//Purpose: This is called when initializing the board. The board is only filled with bombs at this point.
//This function is called many times to calculate each individual bomb count
var getNearCount = function(i, j) {
    var result = 0;
    for (var row = i - 1; row < i + 2; row++) {
        for (var col = j - 1; col < j + 2; col++) {
            if (row >= 0 && col >= 0 && row < height && col < width) {
                if (board[row][col] === -1) {
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
var setVisible = function(i, j) {
    var zero = false;
    if (visible[i][j] === 1) {
        return;
    }
    if (board[i][j] === 0) {
        zero = true;
    }
    if (board[i][j] === -1) {
        visible[i][j] = 1;
        console.log("Clicked on a bomb noob");
        c.drawImage(bombImg, imgLength * j, imgLength * i);
        lose();
        return;
    }
    //console.log("working on " + i + " " + j);
    visible[i][j] = 1;
    getImage(i, j);
    c.drawImage(getImage(i, j), imgLength * j, imgLength * i);
    visibleCount--;
    for (var row = i - 1; row < i + 2; row++) {
        for (var col = j - 1; col < j + 2; col++) {
            if (row >= 0 && col >= 0 && row < height && col < width) {
                if (board[row][col] === 0 && visible[row][col] != 1) {
                    //    console.log("neighbor " + row + " " + col + " is a 0");
                    setVisible(row, col);
                } else if (board[row][col] != 0 && zero && visible[row][col] != 1) {
                    //    console.log("setting " +row + " " + col + " visible ");
                    visible[row][col] = 1;
                    c.drawImage(getImage(row, col), imgLength * col, imgLength * row);
                    visibleCount--;

                }
            }
        }
    }
}

var setFlag = function(i, j) {

    if (visible[i][j] === 1) {
        console.log('either already a flag or is already revealed');
        return;
    } else if (visible[i][j] === -1) {
        c.drawImage(unclickedImg, imgLength * j, imgLength * i);
        visible[i][j] = 0;
    } else {
        console.log('setting flag');
        c.drawImage(flagImg, imgLength * j, imgLength * i);
        visible[i][j] = -1;
    }


}

var getImage = function(i, j) {
    //    console.log(j + " " +i);
    //console.log(board[i][j]);
    var numToReveal = board[i][j];
    if (numToReveal === 0) {
        return blankImg;
    } else if (numToReveal === 1) {
        return oneImg;
    } else if (numToReveal === 2) {
        return twoImg;
    } else if (numToReveal === 3) {
        return threeImg;
    } else if (numToReveal === 4) {
        return fourImg;
    } else if (numToReveal === 5) {
        return fiveImg;
    } else if (numToReveal === 6) {
        return sixImg;
    } else if (numToReveal === 7) {
        return sevenImg;
    } else if (numToReveal === 8) {
        return eightImg;
    }
}
var setBombsVisible = function() {
    for(var i = 0; i < height; i++) {
        for(var j = 0; j < width; j++) {
            if(board[i][j] === -1) {
                c.drawImage(bombImg, imgLength * j, imgLength * i);
            }
        }
    }
}

var setBombstoFlags = function() {
    for(var i = 0; i < height; i++) {
        for(var j = 0; j < width; j++) {
            if(board[i][j] === -1) {
                c.drawImage(flagImg, imgLength * j, imgLength * i);
            }
        }
    }
}
var lose = function() {
    gameOver = true;
    setBombsVisible();
    result.innerHTML = "You lose!";

}
var win = function() {
    if (visibleCount === bombCount) {
        console.log("you win!");
        setBombstoFlags();
        result.innerHTML = "You win!";
        gameOver = true;
        setTimeout(sendScore, 25);
    }
}
var sendScore = function() {

    var endTime = new Date();
    var dif = endTime.getTime() - startTime.getTime();
    var score = dif/1000;
    var name = prompt('pls enter naem');
//    alert('Name: ' + name + ', Score: '+ dif)
    axios.post(baseUrl + '/api/leaderboard?name=' + name + '&score=' + score)
        .then(function (res) {
            console.log(res);
        })
}

window.onload = function() {
    initiate();
}

canvas.onclick = function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY - 28;
    console.log(mouseX, mouseY);
    clickedCol = Math.floor(mouseY / imgLength);
    clickedRow = Math.floor(mouseX / imgLength);

    if (!generated && clickedRow < width && clickedCol < height) {
        console.log("generating board");
        generateBombs(clickedCol, clickedRow);
        generateNumbers();
        generated = true;
    }
    if (gameOver) {
        return;
    }

    if (e.altKey) {
        setFlag(clickedCol, clickedRow);
    } else if (Math.floor(mouseX / imgLength) < width && Math.floor(mouseY / imgLength) < height) {
        //    console.log(Math.floor(mouseX/imgLength) + " " + Math.floor(mouseY/imgLength));
        if (visible[clickedCol][clickedRow] === 0) {
            setVisible(clickedCol, clickedRow);
        }
    }
    win();
}

resetButton.onclick = function(e) {
    //console.log('reset');

    result.innerHTML = "";

    initiate();
};






console.log("\n\n");


/*
//Print Board
for(var i = 0; i<height; i++) {
//    for(var j = 0; j < height; j++) {
        console.log(board[i][0],board[i][1],board[i][2],board[i][3],board[i][4],board[i][5],board[i][6]);
        //console.log(board[i][j]);
    //}
    console.log()
}

console.log("\n\n");
for(var i = 0; i<height; i++) {

//    for(var j = 0; j < height; j++) {
        console.log(visible[i][0],visible[i][1],visible[i][2],visible[i][3],visible[i][4]);
        //console.log(board[i][j]);
    //}
    console.log()
}*/
