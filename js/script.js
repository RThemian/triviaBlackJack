//use AJAX to get the two cards for computer dealer and two cards for player and display them. Use the deckOfCards API. Display the SVG images of the cards. Put the computer dealer cards one face down and one face up. Put the player cards face up. Put the computer dealer cards on the top of the body page and the player's cards on the bottom.

//import images from "./images/*.svg";

$(document).ready(function () {
  $("#start").click(function () {
    console.log("start button clicked");
    $("#start").css("display", "none");
    let deckId = "";
    let playerCards = [];
    let dealerCards = [];
    let backOfCard =
      "https://cdn.pixabay.com/photo/2012/05/07/18/52/card-game-48980_640.png";

    let dealerCard2 = ""; //this is the card that is face down

    function getDeck() {
      $.ajax({
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=5",
      }).then(
        function (data) {
          deckId = data.deck_id;
          console.log("deckID", deckId);
          //store deckId in local storage
          localStorage.setItem("deckId", deckId);
          getCards();
        },
        (error) => {
          console.log(error);
        }
      );
    }

    function getCards() {
      $.ajax({
        url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`,
      }).then(
        function (data) {
          console.log("all card data", data);
          playerCards = data.cards.slice(0, 2);
          dealerCards = data.cards.slice(2, 4);
          displayCards();
        },
        (error) => {
          console.log(error);
        }
      );
    }

    function displayCards() {
      var playerCard1 = playerCards[0].image;
      var playerCard2 = playerCards[1].image;
      var dealerCard1 = dealerCards[0].image;
      var dealerCard2 = dealerCards[1].image;

      //resize backOfCard to have the same dimensions as the other cards

      $("#playerCard1").attr("src", playerCard1);
      $("#playerCard2").attr("src", playerCard2);
      $("#dealerCard1").attr("src", dealerCard1);
      $("#dealerCard2").attr("src", backOfCard);
      //dynamically resi
      //   $("#dealerCard2").attr("src", dealerCard2);

      $("#playerCard1").css("display", "block");
      $("#playerCard2").css("display", "block");
      $("#dealerCard1").css("display", "block");
      $("#dealerCard2").css("display", "block");

      //   $("#dealerCard2").css("visibility", "hidden");
    }
    getDeck();
  });
});

$(document).ready(function (playerCards) {
  $("#hit").click(function () {
    //add another card to the player's hand use deckID and API
    //get the deckId from local storage
    let deckId = localStorage.getItem("deckId");

    console.log("hit function deckId", deckId);

    $.ajax({
      url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`,
    }).then(
      function (data) {
        console.log("hit card data", data);
        console.log("playerCards", playerCards);
        let playerCard3 = data.cards[0].image;
        // data.cards.slice(0, 2).image
        $("#playerCard3").attr("src", playerCard3);
        $("#playerCard3").css("display", "block");
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
});
