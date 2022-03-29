//Game Initialization
let deckId = ''
let player1Score = 0;
let player2Score = 0;

//Function to compare values of each card drawn
function cardValue(val){
  if (val === 'ACE'){
    return 14;
  } else if (val === 'KING'){
    return 13;
  }else if (val === 'QUEEN'){
    return 12;
  } else if (val === 'JACK'){
    return 11;
  } else {
    return parseInt(val);
  }
}


//Resets or Begins game
async function newDeck(){
  document.querySelector("#draw").classList.remove("hidden");
  await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  .then(res => res.json()) // parse response as JSON
  .then(data => {
    console.log(data)
      deckId = data.deck_id
      localStorage.setItem("localDeckID", deckId)

      player1Score = 0;
      player2Score = 0;
      document.querySelector('#player1Score').innerText = player1Score;
      document.querySelector('#player2Score').innerText = player2Score;
      document.querySelector('#h3').innerText = ""
      document.querySelector('#cardOne').innerText = ""
      document.querySelector('#cardTwo').innerText = ""

      document.querySelector('#player1Img').src = ""
      document.querySelector('#player2Img').src = ""
  })
  .catch(err => {
      console.log(`error ${err}`)
  })
  //Sets up 26 cards in each pile
  fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/draw/?count=26`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/add/?cards=${data.cards[0].code},${data.cards[1].code},${data.cards[2].code},${data.cards[3].code},${data.cards[4].code},${data.cards[5].code},${data.cards[6].code},${data.cards[7].code},${data.cards[8].code},${data.cards[9].code},${data.cards[10].code},${data.cards[11].code},${data.cards[12].code},${data.cards[13].code},${data.cards[14].code},${data.cards[15].code},${data.cards[16].code},${data.cards[17].code},${data.cards[18].code},${data.cards[19].code},${data.cards[20].code},${data.cards[21].code},${data.cards[22].code},${data.cards[23].code},${data.cards[24].code},${data.cards[25].code}`)
    })
  fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/draw/?count=26`)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/add/?cards=${data.cards[0].code},${data.cards[1].code},${data.cards[2].code},${data.cards[3].code},${data.cards[4].code},${data.cards[5].code},${data.cards[6].code},${data.cards[7].code},${data.cards[8].code},${data.cards[9].code},${data.cards[10].code},${data.cards[11].code},${data.cards[12].code},${data.cards[13].code},${data.cards[14].code},${data.cards[15].code},${data.cards[16].code},${data.cards[17].code},${data.cards[18].code},${data.cards[19].code},${data.cards[20].code},${data.cards[21].code},${data.cards[22].code},${data.cards[23].code},${data.cards[24].code},${data.cards[25].code}`)
    })
};

//Adds listeners to buttons
document.querySelector('#draw').addEventListener('click', drawCards);
document.querySelector('#reset').addEventListener('click', newDeck);


//Base Function for drawing cards
async function drawCards(){
  let url1 = `https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/draw/?count=1`
  let url2 = `https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/draw/?count=1`
  let val1;
  let val2;
  let card1;
  let card2;
  document.querySelector('#player1Img').src = ``
  document.querySelector('#cardOne').innerText = ``
  document.querySelector('#player2Img').src = ``
  document.querySelector('#cardTwo').innerText = ``

  //Gets player 1 card
  await fetch(url1)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        //Gets card values + images and displays in the DOM
        val1 = cardValue(data.cards[0].value)
        card1 = data.cards[0].code
        document.querySelector('#player1Img').src = data.cards[0].image
        document.querySelector('#cardOne').innerText = `${data.cards[0].value} of ${data.cards[0].suit}`
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

  //Gets player 2 card
  await fetch(url2)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        //Gets card values + images and displays in the DOM
        val2 = cardValue(data.cards[0].value)
        card2 = data.cards[0].code
        document.querySelector('#player2Img').src = data.cards[0].image
        document.querySelector('#cardTwo').innerText = `${data.cards[0].value} of ${data.cards[0].suit}`
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

  //Evalutes winner and adjusts scores
  let winner;
  if (val1 > val2){
      player1Score++
      winner = "P1"
      document.querySelector('#h3').innerText = 'Player 1 Wins!'
    } else if (val1 < val2){
      player2Score++
      winner = "P2"
      document.querySelector('#h3').innerText = 'Player 2 Wins'
    } else {
      winner = ""
      document.querySelector('#h3').innerText = 'WAR'
    }

    if (winner === "P1"){
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/add/?cards=${card1},${card2}`)
    } else if (winner === "P2"){
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/add/?cards=${card1},${card2}`)
    } else if(winner === ""){
        alert("WAR!")
        fightWar();
    }

  //Updates scores for each side
  await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/list/`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#player1Score').innerText = `Player 1: ${data.piles.P1.remaining}`;
        document.querySelector('#player2Score').innerText = `Player 2: ${data.piles.P2.remaining}`;
  
})
}

//Special script for fighting a war
async function fightWar(){
  let url1 = `https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/draw/?count=3`
  let url2 = `https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/draw/?count=3`
  let val1;
  let val2;
  let card11;
  let card12;
  let card13;
  let card21;
  let card22;
  let card23;

  //Gets player 1 cards
  await fetch(url1)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        //Gets card values + images and displays in the DOM
        val1 = cardValue(data.cards[2].value)
        card11 = data.cards[0].code
        card12 = data.cards[1].code
        card13 = data.cards[2].code //gets code for all 3 cards to use later
        document.querySelector('#player1Img').src = data.cards[0].image
        document.querySelector('#player1Img').src = data.cards[1].image
        document.querySelector('#player1Img').src = data.cards[2].image
        document.querySelector('#cardOne').innerText = `${data.cards[2].value} of ${data.cards[2].suit}`
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

  //Gets player 2 cards
  await fetch(url2)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        //Gets card values + images and displays in the DOM
        val2 = cardValue(data.cards[2].value)
        card21 = data.cards[0].code
        card22 = data.cards[1].code
        card23 = data.cards[2].code //gets code for all 3 cards to use later
        document.querySelector('#player2Img').src = data.cards[0].image
        document.querySelector('#player2Img').src = data.cards[1].image
        document.querySelector('#player2Img').src = data.cards[2].image
        document.querySelector('#cardTwo').innerText = `${data.cards[2].value} of ${data.cards[2].suit}`
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

  //Evalutes winner and adjusts scores
  let winner;
  if (val1 > val2){
      player1Score++
      winner = "P1"
      document.querySelector('#h3').innerText = 'Player 1 Wins!'
    } else if (val1 < val2){
      player2Score++
      winner = "P2"
      document.querySelector('#h3').innerText = 'Player 2 Wins'
    } else {
      winner = ""
      document.querySelector('#h3').innerText = 'WAR...AGAIN!!!'
    }

    if (winner === "P1"){
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/add/?cards=${card11},${card12},${card13},${card21},${card22},${card23}`)
    } else if (winner === "P2"){
      fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/add/?cards=${card11},${card12},${card13},${card21},${card22},${card23}`)
    } else if(winner === ""){
        fightWar();
    }

  //Updates scores for each side
  await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/list/`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        document.querySelector('#player1Score').innerText = `Player 1: ${data.piles.P1.remaining}`;
        document.querySelector('#player2Score').innerText = `Player 2: ${data.piles.P2.remaining}`;
  
})
}

console.log("done")