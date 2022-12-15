//use AJAX to get the two cards for computer dealer and two cards for player and display them. Use the deckOfCards API. Display the SVG images of the cards. Put the computer dealer cards one face down and one face up. Put the player cards face up. Put the computer dealer cards on the top of the body page and the player's cards on the bottom.

//import images from "./images/*.svg";

//hide the hit, double and stand buttons until the player clicks the start button
$("#hit").hide();
$("#double").hide();
$("#stand").hide();

let deckId = "";
let playerCards = [];
let dealerCards = [];
let backOfCard =
  "https://cdn.pixabay.com/photo/2012/05/07/18/52/card-game-48980_640.png";
let playerCardsTotal = 0;

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
      displayCards();
    },
    (error) => {
      // console.log(error);
    }
  );
}
function updatePlayerCardsTotal(playerCard) {
  console.log("updatePlayerCardsTotal: 52", playerCard.value);
  if (playerCard.value === "ACE") {
    playerCardsTotal += 11;
  } else if (
    playerCard.value === "KING" ||
    playerCard.value === "QUEEN" ||
    playerCard.value === "JACK"
  ) {
    playerCardsTotal += 10;
  } else {
    console.log("updatePlayerCardsTotal: 62", playerCard.value);
    playerCardsTotal += parseInt(playerCard.value);
  }
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

  updatePlayerCardsTotal(playerCards[0]);
  updatePlayerCardsTotal(playerCards[1]);
  // console.log("playerCardsTotal", playerCardsTotal);
  //update playerCardsTotal in HTML
  updatePlayerTotal();
  // $("player-cards-total").innerHTML(playerCardsTotal);
  //dynamically resi
  //   $("#dealerCard2").attr("src", dealerCard2);

  $("#playerCard1").css("display", "block");
  $("#playerCard2").css("display", "block");
  $("#dealerCard1").css("display", "block");
  $("#dealerCard2").css("display", "block");

  //   $("#dealerCard2").css("visibility", "hidden");
  //count up the value of the playersCards face cards each count as 10, aces 11 or 1, and 2 through 9 their values
}

function updatePlayerTotal() {
  $("#player-cards-total").html(`Player's Cards Total: ${playerCardsTotal}`);
  if (playerCardsTotal > 21) {
    $("#player-cards-total").html(
      `Player's Cards Total: ${playerCardsTotal} - BUSTED!`
    );
    //reload the page
    setTimeout(function () {
      location.reload();
    }, 3000);
  }
}

// $(document).ready(function () {
$("#start").click(function () {
  // console.log("start button clicked");
  $("#start").css("display", "none");
  $("#hit").show();
  $("#double").show();
  $("#stand").show();

  getDeck();
});
// });

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
      // console.log(error);
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
