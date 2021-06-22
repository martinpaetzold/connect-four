// Spiced Lab 2021
// Martin
// Big thanks to Florian for his code inspiration :D

var curentPlayer = "player1";
$("#whoIsTheCurentPlayer").html("One");
function switchPlayer() {
    // Switched the player ;)
    // If current player is 1
    // -> change the current player to 2
    if (curentPlayer == "player1") {
        curentPlayer = "player2";
        $("#whoIsTheCurentPlayer").html("Two");
        // console.log(curentPlayer);
    }
    // if current player is 2
    // -> change the current player to 1
    else if (curentPlayer == "player2") {
        curentPlayer = "player1";
        $("#whoIsTheCurentPlayer").html("One");
        // console.log(curentPlayer);
    }
}

function checkForFour(slots) {
    // Find out if there are four in a row in the list of slots

    // String representation of the slots (01200...)
    var slotsAsString = "";
    for (var slot of slots) {
        if ($(slot).hasClass("player1")) {
            slotsAsString += "1";
        } else if ($(slot).hasClass("player2")) {
            slotsAsString += "2";
        } else {
            slotsAsString += "0";
        }
    }
    // console.log("slotsAsString", slotsAsString);

    // check p1
    if (slotsAsString.includes("1111")) {
        return true;
        // check p2
    } else if (slotsAsString.includes("2222")) {
        return true;
    } else {
        return false;
    }
}

function checkForFourDiagonal(slot) {
    var potentialWins = [
        [0, 7, 14, 21],
        [7, 14, 21, 28],
        [14, 21, 28, 35],
        [1, 8, 15, 22],
        [8, 15, 22, 29],
        [2, 9, 16, 23],
        [6, 13, 20, 27],
        [13, 20, 27, 34],
        [20, 27, 34, 41],
        [12, 19, 26, 33],
        [19, 26, 33, 40],
        [18, 25, 32, 39],
        [24, 19, 14, 9],
        [19, 14, 9, 4],
        [24, 19, 14, 9],
        [19, 14, 9, 4],
        [30, 25, 20, 15],
        [25, 20, 15, 10],
        [20, 15, 10, 5],
        [36, 31, 26, 21],
        [26, 21, 16, 11],
        [37, 32, 27, 22],
        [32, 27, 22, 17],
        [38, 33, 28, 23],
    ];

    var allSlots = $(".slot");
    for (var potentialWin of potentialWins) {
        var slotsInDiagonal = [];
        for (var index of potentialWin) {
            slotsInDiagonal.push(allSlots[index]);
        }
        var hasWon = checkForFour(slotsInDiagonal);
        if (hasWon) {
            return true;
        }
    }
}

// simple reload button to reload the page
$(document).ready(function () {
    $("#restartTheGame").click(function () {
        // console.log("Pressed reload.");
        location.reload();
    });
});

// reload from winner modal button
$(document).ready(function () {
    $("#btnModalWinnerRestart").click(function () {
        // stop audio file (not neccessary, but cleaner)
        audioFileForWinner.pause();
        // console.log("Pressed reload.");
        location.reload();
    });
});

// open help modal
$(document).ready(function () {
    $("#helpForGame").click(function () {
        $("#help").show();
    });
});

// close from help modal
$(document).ready(function () {
    $("#btnModalHelpClose").click(function () {
        $("#help").hide();
    });
});

// React to clicks on a column
$(".column").on("click", function (event) {
    //  Find the free slot
    //      Find all slots in this column
    var clickedColumn = $(event.currentTarget);
    var slotsInColumn = clickedColumn.children();

    //      Reverse the list of slots
    var reversedSlots = slotsInColumn.toArray().reverse();

    //      Loop through reversed list
    for (var slot of reversedSlots) {
        //          Check if slot is empty
        var alreadyUsed =
            $(slot).hasClass("player1") || $(slot).hasClass("player2");

        //  Fill with player1 or player2 class
        if (!alreadyUsed) {
            $(slot).addClass(curentPlayer);

            // Check if player 1 || 2 wins vertically
            var playerHasWonVertically = checkForFour(slotsInColumn);

            // Check if player 1 || 2 wins horizontally
            var slotRowNumber = slotsInColumn.index(slot);
            var slotsInRow = $(".row" + slotRowNumber);
            var playerHasWonHorizontally = checkForFour(slotsInRow);

            // Check if player 1 || 2 wins diagonally
            var playHasWonDiagonallyUp = checkForFourDiagonal(slot);

            if (
                playerHasWonVertically ||
                playerHasWonHorizontally ||
                playHasWonDiagonallyUp
            ) {
                // WINNER <---------------------------------------------------
                // console.log("AWESOME! YOU WON!");

                // show alert box with winning content
                // format var curentPlayer for confirm()
                if (curentPlayer == "player1") {
                    var curentPlayerString = "Player One";
                } else if (curentPlayer == "player2") {
                    var curentPlayerString = "Player Two";
                }

                // alert box with "Awesome!"
                /*
                var winnerForFourString =
                    "Awesome!\n\n " +
                    curentPlayerString +
                    " is the winner!\n\nPress OK to restart.";
                var winnerForFour = window.confirm(winnerForFourString);
                if (winnerForFour == true) {
                    // console.log("Restart!");
                    // reload tab
                    location.reload();
                } else {
                    console.log("Press cancel. Do nothing more...");
                }
                */

                // add sound
                audioFileForWinner = new Audio("./assets/winner.mp3");
                audioFileForWinner.play();

                $("#modalWinnerPlayerName").html(curentPlayerString + ",<br>");
                // show modal with winning html version
                $("#modals").show();
            }
            switchPlayer();
            break;
        }
    }
});
