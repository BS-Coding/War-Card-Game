//Game Initialization
let deckId = ''
let player1Score = 0;
let player2Score = 0;
let warStartCardP1;
let warStartCardP2;

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
    //console.log(data)
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
      //console.log(data)
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
  let winner; 
  document.querySelector('#player1Img').src = ``
  document.querySelector('#cardOne').innerText = ``
  document.querySelector('#player2Img').src = ``
  document.querySelector('#cardTwo').innerText = ``

  //Gets player 1 card
  let player1Card = await fetch(url1)
  let player1Data = await player1Card.json() // parse response as JSON
    
  //Gets player 2 card
  let player2Card = await fetch(url2)
  let player2Data = await player2Card.json() // parse response as JSON
  
  try{
    //Gets card values + images and displays in the DOM
    //console.log(player1Data,player2Data)

    val1 = cardValue(player1Data.cards[0].value)
    card1 = player1Data.cards[0].code
    document.querySelector('#player1Img').src = player1Data.cards[0].image
    document.querySelector('#cardOne').innerText = `${player1Data.cards[0].value} of ${player1Data.cards[0].suit}`

    val2 = cardValue(player2Data.cards[0].value)
    card2 = player2Data.cards[0].code
    document.querySelector('#player2Img').src = player2Data.cards[0].image
    document.querySelector('#cardTwo').innerText = `${player2Data.cards[0].value} of ${player2Data.cards[0].suit}`
  
    //Evalutes winner and adjusts scores
    if (val1 > val2){
      let p1ScoreUpdate = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/add/?cards=${card1},${card2}`)
      player1Score++
      winner = "P1"
      document.querySelector('#h3').innerText = 'Player 1 Wins!'
    } else if (val1 < val2){
      let p2ScoreUpdate = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/add/?cards=${card1},${card2}`)
      player2Score++
      winner = "P2"
      document.querySelector('#h3').innerText = 'Player 2 Wins'
    } else {
      warStartCardP1 = card1
      warStartCardP2 = card2
      winner = ""
      document.querySelector('#h3').innerText = 'WAR'
      alert("WAR!")
      fightWar();
    }

  } catch (err) {
    console.log(`error ${err}`)
  };

  //Updates scores for each side
  const scoreUpdate = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/list/`)
  const scoreData = await scoreUpdate.json() // parse response as JSON
        //console.log(scoreData)
        document.querySelector('#player1Score').innerText = `Player 1: ${scoreData.piles.P1.remaining}`;
        document.querySelector('#player2Score').innerText = `Player 2: ${scoreData.piles.P2.remaining}`;
  const shufflePile1 = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/shuffle/`)
  const shufflePile2 = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/shuffle/`)
    //console.log(`Shuffling Completed: ${shufflePile1} ${shufflePile2}`)
    checkForPlayerWin();
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
  const warPlayer1Cards = await fetch(url1)
  const warPlayer1Data = await warPlayer1Cards.json() // parse response as JSON
  //Gets player 2 cards
  const warPlayer2Cards = await fetch(url2)
  const warPlayer2Data = await warPlayer2Cards.json() // parse response as JSON
    try{
      //Gets card values + images and displays in the DOM
      val1 = cardValue(warPlayer1Data.cards[2].value)
      card11 = warPlayer1Data.cards[0].code
      card12 = warPlayer1Data.cards[1].code
      card13 = warPlayer1Data.cards[2].code //gets code for all 3 cards to use later
      document.querySelector('#player1Img').src = warPlayer1Data.cards[0].image
      document.querySelector('#player1Img').src = warPlayer1Data.cards[1].image
      document.querySelector('#player1Img').src = warPlayer1Data.cards[2].image
      document.querySelector('#cardOne').innerText = `${warPlayer1Data.cards[2].value} of ${warPlayer1Data.cards[2].suit}`

      //Gets card values + images and displays in the DOM
      val2 = cardValue(warPlayer2Data.cards[2].value)
      card21 = warPlayer2Data.cards[0].code
      card22 = warPlayer2Data.cards[1].code
      card23 = warPlayer2Data.cards[2].code //gets code for all 3 cards to use later
      document.querySelector('#player2Img').src = warPlayer2Data.cards[0].image
      document.querySelector('#player2Img').src = warPlayer2Data.cards[1].image
      document.querySelector('#player2Img').src = warPlayer2Data.cards[2].image
      document.querySelector('#cardTwo').innerText = `${warPlayer2Data.cards[2].value} of ${warPlayer2Data.cards[2].suit}`
    } catch (err){
        console.log(`error ${err}`)
    };

  //Evalutes winner and adjusts scores
  let winner;
  if (val1 > val2){
      let p1WarScoreUpdate = fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/add/?cards=${card11},${card12},${card13},${card21},${card22},${card23},${warStartCardP2},${warStartCardP1}`)
      player1Score++
      winner = "P1"
      document.querySelector('#h3').innerText = 'Player 1 Wins!'
    } else if (val1 < val2){
      let p2WarSCoreUpdate = fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/add/?cards=${card11},${card12},${card13},${card21},${card22},${card23},${warStartCardP2},${warStartCardP1}`)
      player2Score++
      winner = "P2"
      document.querySelector('#h3').innerText = 'Player 2 Wins'
    } else {
      winner = ""
      document.querySelector('#h3').innerText = 'WAR...AGAIN!!!'
      fightWar();
    }

  //Updates scores for each side
  const scoreUpdate = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/list/`)
  const scoreData = await scoreUpdate.json() // parse response as JSON
        //console.log(scoreData)
        document.querySelector('#player1Score').innerText = `Player 1: ${scoreData.piles.P1.remaining}`;
        document.querySelector('#player2Score').innerText = `Player 2: ${scoreData.piles.P2.remaining}`;
  const shufflePile1 = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P1/shuffle/`)
  const shufflePile2 = await fetch(`https://deckofcardsapi.com/api/deck/${localStorage.getItem('localDeckID')}/pile/P2/shuffle/`)
    console.log(`Shuffling Completed: ${shufflePile1} ${shufflePile2}`)
    checkForPlayerWin();
}



function checkForPlayerWin(){
  if (document.querySelector('#player2Score').innerText === 'Player 2: 0'){
    alert('Player 1 Wins!');
    newDeck();
  } else if (document.querySelector('#player1Score').innerText === 'Player 1: 0'){
    alert("Player 2 Wins!")
  } else {
    return "No winner"
  }
}