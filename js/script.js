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
      dealerCardsTotal = updateCardsTotal(dealerCards, dealerCardsTotal);
      displayCards();
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

  $("#playerCard1").css("display", "block");
  $("#playerCard2").css("display", "block");
  $("#dealerCard1").css("display", "block");
  $("#dealerCard2").css("display", "block");

  //   $("#dealerCard2").css("visibility", "hidden");
  //count up the value of the playersCards face cards each count as 10, aces 11 or 1, and 2 through 9 their values
}

function dealerLogic() {
  //add up the value of the dealer's cards
  //if dealerCardsTotal is less than 17, hit
  // for (i = 3; i < dealerCards.length; i++) {
  //   if (dealerCardsTotal < 17) {
  //     $.ajax({
  //       url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
  //     }).then(
  //       function (data) {
  //         // console.log("all card data", data);
  //         dealerCards.push(data.cards[0]);
  //         dealerCardsTotal = updateCardsTotal(dealerCards, dealerCardsTotal);
  //         //display the new card
  //         //dynamic id for dealerCard3, dealerCard4, dealerCard5, dealerCard6, dealerCard7, dealerCard8, dealerCard9, dealerCard10
  //         dealerCardsTotal = updateDealerTotal(dealerCards, dealerCardsTotal);
  //         $("#dealer-cards-total").html(
  //           `Dealer's Cards Total: ${dealerCardsTotal}`
  //         );
  //         if (dealerCardsTotal > 21) {
  //           $("#dealer-cards-total").html(
  //             `Dealer's Cards Total: ${dealerCardsTotal} - BUSTED!`
  //           );
  //         } else if (dealerCardsTotal === 21) {
  //           $("#dealer-cards-total").html(
  //             `Dealer's Cards Total: ${dealerCardsTotal} - BLACKJACK!`
  //           );
  //         }
  //       },
  //       (error) => {
  //         console.log("dealer logic hit error", error);
  //       }
  //     );
  //   }
}

//if dealerCardsTotal is greater than 17, stand
//if dealerCardsTotal is greater than 21, bust
//if dealerCardsTotal is equal to 21, blackjack
//if dealerCardsTotal is greater than playerCardsTotal, dealer wins
//if dealerCardsTotal is less than playerCardsTotal, player wins
//if dealerCardsTotal is equal to playerCardsTotal, push

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
    $("#hit").attr("disabled", true);
    $("#double").attr("disabled", true);
    $("#stand").attr("disabled", true);

    setTimeout(function () {
      //disable the hit, double and stand buttons

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
      //Player's Cards Total: 0

      $("#hit").attr("disabled", false);
      $("#double").attr("disabled", false);
      $("#stand").attr("disabled", false);
      $("#hit").hide();
      $("#double").hide();
      $("#stand").hide();
      //change the player's cards total to 0
      playerCardsTotal = 0;
      $("#player-cards-total").html(
        `Player's Cards Total: ${playerCardsTotal}`
      );
      //display the deal button
      $("#deal").show();
    }, 3000);
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
  } else {
    balance -= parseInt(bet);
  }

  $("#bet").html(`Bet: $${bet}`);
  //reduce the balance by the bet amount

  //display the balance
  $("#balance").html(`Balance: $${balance}`);
});

// $(document).ready(function () {
$("#deal").click(function () {
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
  } else {
    // console.log("bet", bet);
    // console.log("playerMoney", playerMoney);
    balance -= bet;
    $("#bet").html(`Bet: $${bet}`);
  }

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

  //show dealer's cards total
  $("#dealer-cards-total").html(`Dealer's Cards: ${dealerCardsTotal}`);

  //disable the hit, double and stand buttons
  $("#hit").attr("disabled", true);
  $("#double").attr("disabled", true);
  $("#stand").attr("disabled", true);
  dealerLogic();
});

// $(document).ready(function (playerCards) {
$("#hit").click(function () {
  let deckId = localStorage.getItem("deckId");

  // console.log("hit function deckId", deckId);

  $.ajax({
    url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
  }).then(
    function (data) {
      let playerCard3 = data.cards[0].image;
      let playerCard3Value = data.cards[0];
      updatePlayerCardsTotal(playerCard3Value);
      $(`#playerCard3`).attr("src", playerCard3);
      $(`#playerCard3`).css("display", "block");
      updatePlayerTotal();

      // console.log("playerCard3Value", playerCard3Value[0]);
    },
    (error) => {
      console.log(error);
    }
  );

  //display the new card in the player's hand
  $("#playerCard3").css("display", "block");
  $("#playerCard3").attr("src", playerCard3);

  //check if the player has busted
  //if the player has not busted, check if the player has blackjack
  //if the player has blackjack, display a message that the player has blackjack
  //if the player has not blackjack, display a message that the player has not blackjack
  //if the player has busted, display a message that the player has busted
  //if the player has not busted, display a message that the player has not busted
});
// });

//count card total function
//function that updates playerCardsTotal with playerCards parameter
