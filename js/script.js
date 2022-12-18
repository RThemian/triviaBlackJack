//use AJAX to get the two cards for computer dealer and two cards for player and display them. Use the deckOfCards API. Display the SVG images of the cards. Put the computer dealer cards one face down and one face up. Put the player cards face up. Put the computer dealer cards on the top of the body page and the player's cards on the bottom.

//import images from "./images/*.svg";

//hide the hit, double and stand buttons until the player clicks the deal button

$("#hit").hide();
$("#double").hide();
$("#stand").hide();
let balance = 1000;
let bet = 0;
$("#balance").html(`Balance: $${balance}`);
$("#bet").html(`Bet: $${bet}`);

let deckId = "";
let playerCards = [];
let dealerCards = [];
let backOfCard =
  "https://cdn.pixabay.com/photo/2012/05/07/18/52/card-game-48980_640.png";
let playerCardsTotal = 0;
let dealerCardsTotal = 0;

let dealerCard2 = ""; //this is the card that is face down

function getDeck() {
  $.ajax({
    url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=5",
  }).then(
    function (data) {
      deckId = data.deck_id;
      // console.log("deckID", deckId);
      //store deckId in local storage
      localStorage.setItem("deckId", deckId);
      getCards();
    },
    (error) => {
      // console.log(error);
    }
  );
}

function getCards() {
  $.ajax({
    url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`,
  }).then(
    function (data) {
      // console.log("all card data", data);
      playerCards = data.cards.slice(0, 2);
      dealerCards = data.cards.slice(2, 4);
      //add up the value of the dealers two cards
      // dealerCardsTotal = 0;

      //add up the value of the players two cards

      displayCards();
      checkForBlackJack(dealerCards, playerCards);
    },
    (error) => {
      // console.log(error);
    }
  );
}

//create a function that will add up the value of the player's or dealer's cards

function updateCardsTotal(cards, total) {
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].value === "ACE") {
      total += 11;
      if (total > 21) {
        total -= 10;
      }
    } else if (
      cards[i].value === "KING" ||
      cards[i].value === "QUEEN" ||
      cards[i].value === "JACK"
    ) {
      total += 10;
    } else {
      total += parseInt(cards[i].value);
    }
  }
  console.log("total", total);
  return total;
}

function displayCards() {
  let playerCard1 = playerCards[0].image;
  let playerCard2 = playerCards[1].image;
  let dealerCard1 = dealerCards[0].image;

  //update playerCardsTotal

  //put dealerCard2 image into local storage
  localStorage.setItem("dealerCard2image", dealerCards[1].image);

  let dealerCard2Storage = dealerCards[1].image;

  //resize backOfCard to have the same dimensions as the other cards

  $("#playerCard1").attr("src", playerCard1);
  $("#playerCard2").attr("src", playerCard2);
  $("#dealerCard1").attr("src", dealerCard1);
  $("#dealerCard2").attr("src", backOfCard);

  playerCardsTotal = updateCardsTotal(playerCards, playerCardsTotal);
  // console.log("playerCardsTotal", playerCardsTotal);
  //update playerCardsTotal in HTML
  updatePlayerTotal();

  //check if player has blackjack
  if (playerCardsTotal === 21) {
    //player wins
    $("#message").html("Player has Blackjack");
    setTimeout(function () {
      $("#message").html("Player wins");
      //bet is added to balance
      console.log("balance before adding bet", balance);
      balance += parseInt(bet * 2);
      console.log("balance after adding bet", balance);

      $("#balance").html(`Balance: $${balance}`);
    }, 2000);
    setTimeout(function () {
      $("#message").html("");
    }, 4000);
    //reset the game 4 seconds after the message is displayed
    setTimeout(function () {
      gameReset();
    }, 5000);
  }

  $("#playerCard1").css("display", "block");
  $("#playerCard2").css("display", "block");
  $("#dealerCard1").css("display", "block");
  $("#dealerCard2").css("display", "block");

  //   $("#dealerCard2").css("visibility", "hidden");
  //count up the value of the playersCards face cards each count as 10, aces 11 or 1, and 2 through 9 their values
}

function dealerLogic() {
  //display dealerCardsTotal
  dealerCardsTotal = updateCardsTotal(dealerCards, (dealerCardsTotal = 0));
  console.log("dealerCardsTotal line 129: ", dealerCardsTotal);
  $("#dealer-cards-total").html(`Dealer Total: ${dealerCardsTotal}`);

  //check if dealerCardsTotal is greater than 21
  if (dealerCardsTotal > 21) {
    //player wins
    $("#message").html("Dealer busts");

    setTimeout(function () {
      $("#message").html("Player wins");
      console.log("balance before adding bet", balance);
      balance += parseInt(bet * 2);
      console.log("balance after adding bet", balance);
      $("#balance").html(`Balance: $${balance}`);
    }, 2000);

    setTimeout(function () {
      $("#message").html("");
    }, 4000);
    //reset the game 4 seconds after the message is displayed
    setTimeout(function () {
      gameReset();
    }, 5000);
  } else if (dealerCardsTotal <= 21 && dealerCardsTotal >= 17) {
    //check if dealerCardsTotal is greater than playerCardsTotal
    if (dealerCardsTotal > playerCardsTotal) {
      //dealer wins
      $("#message").html("Dealer wins");
      setTimeout(function () {
        $("#message").html("");
      }, 2000);
      //reset the game 4 seconds after the message is displayed
      setTimeout(function () {
        gameReset();
      }, 3000);
    } else if (dealerCardsTotal < playerCardsTotal) {
      //player wins
      $("#message").html("Player wins");
      console.log("balance before adding bet", balance);
      balance += parseInt(bet * 2);
      console.log("balance after adding bet", balance);
      $("#balance").html(`Balance: $${balance}`);
      setTimeout(function () {
        $("#message").html("");
      }, 2000);
      //reset the game 4 seconds after the message is displayed
      setTimeout(function () {
        gameReset();
      }, 3000);
    } else if (dealerCardsTotal === playerCardsTotal) {
      //tie
      $("#message").html("PUSH");
      //bet is added to balance
      balance += parseInt(bet);
      $("#balance").html(`Balance: $${balance}`);
      setTimeout(function () {
        $("#message").html("");
      }, 2000);
      //reset the game 4 seconds after the message is displayed
      setTimeout(function () {
        gameReset();
      }, 3000);
    }
  } else if (dealerCardsTotal < 17) {
    $.ajax({
      url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
    }).then(function (data) {
      if ($("#dealerCard3").attr("src") === "") {
        let dealerCard3image = data.cards[0].image;
        let dealerCard3 = data.cards[0];

        $(`#dealerCard3`).attr("src", dealerCard3image);
        $(`#dealerCard3`).css("display", "block");
        dealerCards.push(dealerCard3);

        dealerLogic();
      } else if ($("#dealerCard4").attr("src") === "") {
        let dealerCard4image = data.cards[0].image;
        let dealerCard4 = data.cards[0];

        $(`#dealerCard4`).attr("src", dealerCard4image);
        $(`#dealerCard4`).css("display", "block");
        dealerCards.push(dealerCard4);
        dealerLogic();
      } else if ($("#dealerCard5").attr("src") === "") {
        let dealerCard5image = data.cards[0].image;
        let dealerCard5 = data.cards[0];

        $(`#dealerCard5`).attr("src", dealerCard5image);
        $(`#dealerCard5`).css("display", "block");

        dealerCards.push(dealerCard5);
        dealerLogic();
      }
    });
  }
}

function updateDealerTotal() {
  $("#dealer-cards-total").html(`Dealer's Cards Total: ${dealerCardsTotal}`);
  if (dealerCardsTotal > 21) {
    $("#dealer-cards-total").html(
      `Dealer's Cards Total: ${dealerCardsTotal} - BUSTED!`
    );
    $("#message").html("Dealer Busted! Player Wins!");
    console.log("balance before adding bet", balance);
    balance += parseInt(bet * 2);
    $("#balance").html(`Balance: $${balance}`);
    console.log("balance after adding bet && $DOM update", balance);
    setTimeout(function () {
      $("#message").html("");
    }, 5000);
    setTimeout(function () {
      gameReset();
    }, 7000);
  }
}

function updatePlayerTotal() {
  $("#player-cards-total").html(`Player's Cards Total: ${playerCardsTotal}`);
  if (playerCardsTotal > 21) {
    $("#player-cards-total").html(
      `Player's Cards Total: ${playerCardsTotal} - BUSTED!`
    );
    //show the dealer's second card
    $("#dealerCard2").attr("src", localStorage.getItem("dealerCard2image"));
    bet = 0;
    $("#bet").html(`Bet: $${bet}`);
    //empty the player's hand and the dealer's hand
    //disable the hit, double and stand buttons
    setTimeout(function () {
      gameReset();
    }, 5000);
  }
}

//on click  set bet up to the available balance
$("#bet").click(function () {
  //change the value of bet and display it in the bet div
  //prompt player to enter a bet
  bet = prompt("How much would you like to bet?");
  if (isNaN(bet)) {
    alert("Please enter a number");

    return;
  } else if (bet > balance) {
    alert("You don't have enough money to place that bet");
    return;
  }
  //bet is not a number
  else if (bet === 0) {
    alert("Please place a bet before you play");
    return;
  } else if (bet > 0) {
    balance -= parseInt(bet);
  }

  $("#bet").html(`Bet: $${bet}`);

  //display the balance
  $("#balance").html(`Balance: $${balance}`);
});

// $(document).ready(function () {
$("#deal").click(function () {
  //bet must be placed before the deal button is clicked
  if (bet === 0) {
    alert("Please place a bet before you play");
    return;
  }

  clearOutHands();

  $("#deal").css("display", "none");
  $("#hit").show();
  $("#double").show();
  $("#stand").show();

  getDeck();
});
// });

$("#stand").click(function () {
  //show the dealer's second card
  $("#dealerCard2").attr("src", localStorage.getItem("dealerCard2image"));
  //display dealercard
  $("#dealerCard2").css("display", "block");

  //show dealer's cards total
  dealerCardsTotal = updateCardsTotal(dealerCards, (dealerCardsTotal = 0));
  $("#dealer-cards-total").html(`Dealer's Cards: ${dealerCardsTotal}`);

  //disable the hit, double and stand buttons
  $("#hit").attr("disabled", true);
  $("#double").attr("disabled", true);
  $("#stand").attr("disabled", true);

  //check if dealerCardsTotal is greater than 17
  if (dealerCardsTotal >= 17 && dealerCardsTotal > playerCardsTotal) {
    //dealer wins
    $("#message").html("Dealer Wins!");
    setTimeout(function () {
      $("#message").html("");
    }, 3000);

    setTimeout(function () {
      gameReset();
    }, 5000);
  } else if (dealerCardsTotal >= 17 && dealerCardsTotal < playerCardsTotal) {
    //player wins
    $("#message").html("Player Wins!");
    console.log("balance before adding bet", balance);
    balance += parseInt(bet * 2);
    $("#balance").html(`Balance: $${balance}`);
    console.log("balance after adding bet && $DOM update", balance);
    setTimeout(function () {
      $("#message").html("");
    }, 3000);

    setTimeout(function () {
      gameReset();
    }, 5000);
  } else if (dealerCardsTotal >= 17 && dealerCardsTotal === playerCardsTotal) {
    //tie
    $("#message").html("Tie!");
    setTimeout(function () {
      $("#message").html("");
    }, 3000);

    setTimeout(function () {
      gameReset();
    }, 5000);
  } else {
    //dealerCardsTotal is less than 17

    dealerLogic();
  }
});

// $(document).ready(function (playerCards)

$("#hit").click(function () {
  let deckId = localStorage.getItem("deckId");

  // console.log("hit function deckId", deckId);
  //disable the double button
  $("#double").attr("disabled", true);
  $.ajax({
    url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
  }).then(
    function (data) {
      if ($("#playerCard3").attr("src") === "") {
        let playerCard3image = data.cards[0].image;
        let playerCard3 = data.cards[0];

        $(`#playerCard3`).attr("src", playerCard3image);
        $(`#playerCard3`).css("display", "block");

        playerCardsTotal = updateCardsTotal([playerCard3], playerCardsTotal);

        updatePlayerTotal();
        console.log("playerCardsTotal from 3", playerCardsTotal);
      } else if ($("#playerCard4").attr("src") === "") {
        let playerCard4image = data.cards[0].image;
        let playerCard4 = data.cards[0];
        $(`#playerCard4`).attr("src", playerCard4image);
        $(`#playerCard4`).css("display", "block");
        playerCardsTotal = updateCardsTotal([playerCard4], playerCardsTotal);
        updatePlayerTotal();
        console.log("playerCardsTotal from 4", playerCardsTotal);
      } else if ($("#playerCard5").attr("src") === "") {
        let playerCard5image = data.cards[0].image;
        let playerCard5 = data.cards[0];
        $(`#playerCard5`).attr("src", playerCard5image);
        $(`#playerCard5`).css("display", "block");
        playerCardsTotal = updateCardsTotal([playerCard5], playerCardsTotal);
        updatePlayerTotal();
        console.log("playerCardsTotal from 5", playerCardsTotal);
      } else {
        alert("You have 5 cards and cannot hit");
      }
    },
    (error) => {
      console.log(error);
    }
  );
});
// });

function gameReset() {
  //change the player's cards total and dealer's cards total to 0
  dealerCardsTotal = 0;
  playerCardsTotal = 0;
  $("#player-cards-total").html(`Player's Cards Total: ${playerCardsTotal}`);
  //display the deal button
  $("#deal").show();
  //hide the hit, double and stand buttons
  $("#hit").hide();
  $("#double").hide();
  $("#stand").hide();
  //hide the dealer's second card
  $("#dealerCard2").css("display", "none");
  //hide the dealer's cards total
  $("#dealer-cards-total").html(`Dealer's Cards Total: ${dealerCardsTotal}`);
  //enable the hit, double and stand buttons
  $("#hit").attr("disabled", false);
  $("#double").attr("disabled", false);
  $("#stand").attr("disabled", false);

  //empty the player's hand and the dealer's hand
  clearOutHands();

  //reset the bet to 0
  bet = 0;
  $("#bet").html(`Bet: $${bet}`);

  if (balance <= 0) {
    alert("You have no more money. Game Over!");
    balance = 1000;
    $("#balance").html(`Balance: $${balance}`);
    gameReset();
  }
}
function clearOutHands() {
  $("#playerCard1").attr("src", "");
  $("#playerCard2").attr("src", "");
  $("#playerCard3").attr("src", "");
  $("#playerCard4").attr("src", "");
  $("#playerCard5").attr("src", "");

  $("#dealerCard1").attr("src", "");
  $("#dealerCard2").attr("src", "");
  $("#dealerCard3").attr("src", "");
  $("#dealerCard4").attr("src", "");
  $("#dealerCard5").attr("src", "");
}

//count card total function
//function that updates playerCardsTotal with playerCards parameter

// double button clicked, double bet
// if (playerCard3.props("src") !== "") {
//   $("#double").attr("disabled", true);
// }

//check if #playerCard3 has prop src
//if it does, disable the double button
if ($("#playerCard3").prop("src") !== "") {
  $("#double").attr("disabled", true);
}

$("#double").click(function () {
  //add bet to bet
  console.log("playerCard3", playerCard3);
  bet = bet * 2;
  //update balance
  balance = balance - bet;
  $("#bet").html(`Bet: $${bet}`);
  $("#balance").html(`Balance: $${balance}`);
  //disable the hit, double and stand buttons
  $("#hit").attr("disabled", true);
  $("#double").attr("disabled", true);
  $("#stand").attr("disabled", true);

  let deckId = localStorage.getItem("deckId");

  // console.log("hit function deckId", deckId);

  $.ajax({
    url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
  }).then(
    function (data) {
      let playerCard3image = data.cards[0].image;
      let playerCard3 = data.cards[0];

      $(`#playerCard3`).attr("src", playerCard3image);
      $(`#playerCard3`).css("display", "block");

      playerCardsTotal = updateCardsTotal([playerCard3], playerCardsTotal);

      updatePlayerTotal();
      console.log("playerCardsTotal from 3 card", playerCardsTotal);
    },
    (error) => {
      console.log(error);
    }
  );
  //show the dealer's second card
  $("#dealerCard2").attr("src", localStorage.getItem("dealerCard2image"));
  //display dealercard
  $("#dealerCard2").css("display", "block");

  //show dealer's cards total
  dealerCardsTotal = updateCardsTotal(dealerCards, (dealerCardsTotal = 0));
  $("#dealer-cards-total").html(`Dealer's Cards: ${dealerCardsTotal}`);

  //disable the hit, double and stand buttons
  $("#hit").attr("disabled", true);
  $("#double").attr("disabled", true);
  $("#stand").attr("disabled", true);

  //check if dealerCardsTotal is greater than 17
  if (dealerCardsTotal >= 17 && dealerCardsTotal > playerCardsTotal) {
    //dealer wins
    $("#message").html("Dealer Wins!");
    setTimeout(function () {
      $("#message").html("");
    }, 3000);

    setTimeout(function () {
      gameReset();
    }, 5000);
  } else if (dealerCardsTotal >= 17 && dealerCardsTotal < playerCardsTotal) {
    //player wins
    $("#message").html("Player Wins!");
    console.log("balance before adding bet", balance);
    balance += parseInt(bet * 2);
    $("#balance").html(`Balance: $${balance}`);
    console.log("balance after adding bet && $DOM update", balance);
    setTimeout(function () {
      $("#message").html("");
    }, 3000);

    setTimeout(function () {
      gameReset();
    }, 5000);
  } else if (dealerCardsTotal >= 17 && dealerCardsTotal === playerCardsTotal) {
    //tie
    $("#message").html("Tie!");
    setTimeout(function () {
      $("#message").html("");
    }, 3000);

    setTimeout(function () {
      gameReset();
    }, 5000);
  } else {
    //dealerCardsTotal is less than 17

    dealerLogic();
  }
});

function checkForBlackJack(dealerCards, playerCards) {
  dealerCardsTotal = updateCardsTotal(dealerCards, 0);
  playerCardsTotal = updateCardsTotal(playerCards, 0);

  //check if dealer and / or player has blackjack
  if (dealerCardsTotal === 21 && playerCardsTotal === 21) {
    //show dealercard2
    $("#dealerCard2").attr("src", localStorage.getItem("dealerCard2image"));
    //display dealercard
    $("#dealerCard2").css("display", "block");
    //it's a PUSH
    $("#message").html("It's a PUSH");
    setTimeout(function () {
      $("#message").html("");
    }, 2000);
    //reset the game 2 seconds after the message is displayed
    setTimeout(function () {
      gameReset();
    }, 3000);
  } else if (dealerCardsTotal === 21 && playerCardsTotal !== 21) {
    //show dealercard2
    $("#dealerCard2").attr("src", localStorage.getItem("dealerCard2image"));
    //display dealercard
    $("#dealerCard2").css("display", "block");
    //dealer wins
    $("#message").html("Dealer has Blackjack");
    setTimeout(function () {
      $("#message").html("Dealer wins");
      //bet is subtracted from balance
      console.log("balance before subtracting bet", balance);
      balance -= parseInt(bet);
      console.log("balance after subtracting bet", balance);
    }, 2000);
    setTimeout(function () {
      $("#message").html("");
    }, 4000);
    //reset the game 4 seconds after the message is displayed
    setTimeout(function () {
      gameReset();
    }, 5000);
  } else if (dealerCardsTotal !== 21 && playerCardsTotal === 21) {
    //show dealercard2
    $("#dealerCard2").attr("src", localStorage.getItem("dealerCard2image"));
    //display dealercard
    $("#dealerCard2").css("display", "block");

    //player wins
    $("#message").html("Player has Blackjack");
    setTimeout(function () {
      $("#message").html("Player wins");
      //bet is added to balance
      console.log("balance before adding bet", balance);
      balance += parseInt(bet * 1.5);
      console.log("balance after adding bet", balance);
    }, 2000);
    setTimeout(function () {
      $("#message").html("");
    }, 4000);
    //reset the game 4 seconds after the message is displayed
    setTimeout(function () {
      gameReset();
    }, 5000);
  } else {
    //no one has blackjack
    return;
  }
}
