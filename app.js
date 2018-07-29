const btn = document.querySelector('.throw-btn'),
      throwForm = document.querySelector('input.throw-output'),
      winner = document.querySelector('div.announce-winner'),
      greenScoreUI = document.querySelector('td.greenScore'),
      blueScoreUI = document.querySelector('td.blueScore'),
      greenPlayer = document.querySelector('div.greenPlayer'),
      bluePlayer = document.querySelector('div.bluePlayer');

console.log(winner);
      
//even = green(*), odd = blue(#)
let turn = 0, flip = 0, flag = 0, greenScore, blueScore;
if(localStorage.getItem('greenScore') === null){
  greenScore = 0;
}else {
  greenScore = localStorage.getItem('greenScore');
  greenScoreUI.innerText = greenScore;
}
if(localStorage.getItem('blueScore') === null){
  blueScore = 0;
}else {
  blueScore = localStorage.getItem('blueScore');
  blueScoreUI.innerText = blueScore;
}

if(greenScore>blueScore){
  greenPlayer.style.width = '20px'; greenPlayer.style.height = '20px';
  bluePlayer.style.width = '10px'; bluePlayer.style.height = '10px';
}else{
  greenPlayer.style.width = '10px'; greenPlayer.style.height = '10px';
  bluePlayer.style.width = '20px'; bluePlayer.style.height = '20px';
}

const arr = ['one', 'two', 'three', 'four', 'five'];

let greenPosition = '.one-1', 
    bluePosition = '.one-1',
    lastGreenPosition = greenPosition,
    lastBluePosition = bluePosition;

btn.addEventListener('click', function(){
  if(flag===0){
    play();
  }
  else{
    playAgain();
  }
});



function playAgain(){
  winner.style.display = 'none';
  flag = 0;
  greenPosition = '.one-1'; bluePosition = '.one-1';
  if(flip%2===0){
    turn = 0;
  }else{
    turn = 1;
  }
  throwForm.innerText = '#';
  btn.value = 'Start';
  if(turn == 0){
    btn.style.color = 'green';
  } else{
    btn.style.color = 'blue';
  }
  move();

}

function play(){
  checkForWinner();
  if(flag===0){
    const dice = generateNumber();
    if(turn%2 === 0){
      lastGreenPosition = greenPosition;
      greenPosition = getNextPosition(dice, greenPosition, lastGreenPosition);
      btn.style.color = 'blue';
      btn.value = `Blue's turn`;
      move('green');
    } else {
      lastBluePosition = bluePosition;
      bluePosition = getNextPosition(dice, bluePosition, lastBluePosition);
      btn.style.color = 'green';
      btn.value = `Green's turn`;
      move('blue');
    }
    turn++;
  }
}

function checkForWinner(){
  if(greenPosition === '.five-5' || bluePosition === '.five-5'){
    flag = 1;
    flip++;
    btn.value = 'Play again';
    btn.style.color = 'green';
    
    if(greenPosition === '.five-5'){
      greenScore++;
      localStorage.setItem('greenScore', greenScore);
      greenScoreUI.innerText = greenScore;
    	winner.style.backgroundColor = 'green';
      winner.innerHTML = 
      `<table>                  
        <tr><td><span style= "font-size:40px;">Winner</span></td><tr>
        <tr><td>Green Player!</td><tr>
      </table>`;
    }else{
      blueScore++;
      localStorage.setItem('blueScore', blueScore);
      blueScoreUI.innerText = blueScore;
	    winner.style.backgroundColor = 'blue';
      winner.innerHTML = 
      `<table>                  
        <tr><td><div style= "font-size:40px;">Winner</div></td><tr>
        <tr><td><div>Blue Player!</div></td><tr>
      </table>`;
    }
    winner.style.display = 'block';	
  } else {
    flag = 0;
  }
}

function showMessage(message){
  messageForm.value = message;
}

function generateNumber(){
  let min = 1, 
      max = 6;
  let num = Math.floor(Math.random()*max + 1);
  throwForm.value = num;
  return num;
}

function getNextPosition(dice, playerPosition, lastPosition){
  const playerPositionUI = document.querySelector(playerPosition);
  console.log(playerPosition);
  if(dice !== 0) {
    let initial = playerPositionUI.classList[0], final = '', initialRow = '', initialCol;
    let i;
    for(i=0; initial[i]!='-'; i++){
      initialRow += initial[i];
    }
    i++;
    initialCol = Number(initial[i]);

    let row, col;
    for(i =0; i<5; i++) {
      if(arr[i] === initialRow){
        initialRow = i+1;
      }
    }
    row = initialRow;
    col = initialCol + dice;
    if(col > 5){
      row++;
      col -= 5;
      if(col>5){
        col-=5;
	row++;
      }
    }
    for(i =0; i<5; i++) {
      if(i+1 === row){
        row = arr[i];
      }
    }
    
    console.log('row:', row, 'col:', col);

    if(row > 5 || col > 5){
      return lastPosition;
    } else{
      return `.${row}-${col}`;
    }
  } else {
    let initial = playerPositionUI.innerText, num = '', initialCol;
    for(let i = 0; !Number.isNaN(initial[i]) && i< initial.length; i++){
      if(initial[i]!='#'){
        num += initial[i];
      }
    }
    num = Number(num);
    let row = (num%5 === 0)? num/5 :Math.floor(num/5) + 1;
    let col = (num%5 ===0 )? 5: num%5;
    for(let i =0; i<5; i++) {
      if(i+1 === row){
        row = arr[i];
      }
    }
    return `.${row}-${col}`;
  }
}

function move(color){
  const greenPositionUI = document.querySelector(greenPosition), 
      bluePositionUI = document.querySelector(bluePosition);

  const greenUI = document.createElement('div'),
        blueUI = document.createElement('div');

  greenUI.setAttribute('class','greenPlayer');
  blueUI.setAttribute('class','bluePlayer');

  if(greenPosition !== lastGreenPosition){0
    remove('green', lastGreenPosition);
    greenPositionUI.appendChild(greenUI);
  }
  if(bluePosition !== lastBluePosition){
    remove('blue', lastBluePosition);
    bluePositionUI.appendChild(blueUI);
  }

  if(greenPositionUI.classList.contains('ladder')||bluePositionUI.classList.contains('ladder')||greenPositionUI.classList.contains('snake')||bluePositionUI.classList.contains('snake')){    
    
    if(color === 'green' && greenPosition !== lastGreenPosition){
      greenPosition = getNextPosition(0, greenPosition);
      setTimeout(function(){move();}, 1000);
    }
    if(color === 'blue' && bluePosition !== lastBluePosition) {
      bluePosition = getNextPosition(0, bluePosition);
      setTimeout(function(){move();}, 1000);
    }
  }
  checkForWinner();
}

function remove(color, lastPosition){
  const colorPositionUI = document.querySelector(lastPosition);
  const targetColor = color + 'Player';
  const spanToRemove = document.querySelector(`div.${targetColor}`);
  spanToRemove.remove();
}


