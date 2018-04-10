var alienSprites=["assets/blue_alien.png","assets/blue_alien2.png","assets/green_alien.png","assets/red_alien.png"]
var playerSprite="assets/player.png";
var projectileSprite="assets/projectile.png"
var board; 
var startingPosY=80;
var startingPosX=100;
var horizontalSpacing=75;
var horizontalOffset=40;
var verticalSpacing=50;
var userSpeed=20;
//Enemy move distance
var moveDistanceX=25;
var moveDistanceY=20;
//Time in ms that it takes for the enemy to move to the right/left
var moveTime=2000;
//Number of times that it will move to the left/right before moving down and reversing direction
var moveTurns=5;
//Keeps current move turn
var movesRemaining=moveTurns;
//Number of projectiles instantiated when the game starts
var projectileNumber=10;
var projectiles=[];
reverse=false;
var playerShip;
var enemyShips=[];


$(document).ready(function() {
  instantiateEnemies();
  instantiateProjectiles(projectileNumber);
  playerShip=new Player();
  enemyMoveInterval = setInterval(moveEnemies,moveTime);
});


function instantiateProjectiles(projectileNumber){
  for(var i=0;i<projectileNumber;i++){
    var projectile=createGameObject(projectileSprite);
    projectile.style.visibility="hidden";
    projectiles[i]=projectile;
  }
}

document.addEventListener('keydown',function (evt){
  if(evt.which === 37){
    playerShip.moveLeft();
  } else if (evt.which === 39){
    playerShip.moveRight();
  } else if(evt.which== 32){
    playerShip.shoot();
  }
});

function instantiateEnemies() {
  count = 0;
  for(var j=0;j<4;j++){
    for (var i=0;i<11;i++){
      div=createGameObject();
      //Get first (and only) child of div, which is an img
      img=div.children[0];
      div.style.position = "absolute";
      div.style.top = toPixels(startingPosY + verticalSpacing * j);
      div.classList.add('enemy');
      div.classList.add('row'+j); //enemy row0
      div.setAttribute('id',"enemy"+i+''+j) //enemy32
      var offset=0;
      if(j % 2 != 0) offset=horizontalOffset;
      div.style.left = toPixels(startingPosX + horizontalSpacing * i + offset);
      img.src = alienSprites[j];
      enemyShips[count] = div; 
      count++;
      div.style.zIndex = "-1";
    }
  } 
}

function toPixels(integer){
  return integer+"px";
}

function createGameObject(sprite=""){
  var div = document.createElement("div");
  document.body.appendChild(div);
  var img = document.createElement("img");
  if(sprite!=""){
    img.src=sprite;
  }
  div.appendChild(img);
  div.style.position = "absolute";
  div.style.top = "600px";
  div.style.left = "500px";
  img.src=playerSprite;
  return div;
}

function moveEnemies(){
  enemyShips.forEach(function(enemy){
   if(movesRemaining>0){
    currentPosX=parseInt(enemy.style.left);
    if(!reverse){        
        enemy.style.left=toPixels(currentPosX+moveDistanceX);
      } else {
        enemy.style.left=toPixels(currentPosX-moveDistanceX);
      }
    }else{
      currentPosY=parseInt(enemy.style.top);
      enemy.style.top=toPixels(currentPosY+moveDistanceY);
    }
  });
  movesRemaining--;
  if(movesRemaining<0){
    movesRemaining=moveTurns;
    reverse=!reverse;
  }
}

class Player {
  constructor(){
    this.playerShip=this.instantiatePlayer();
  }

  instantiatePlayer(){
    var div = document.createElement("div");
    document.body.appendChild(div);
    var img = document.createElement("img");
    div.appendChild(img);
    div.style.position = "absolute";
    div.style.top = "600px";
    div.style.left = "500px";
    img.src=playerSprite;
    return div;
  }

  moveRight(){
    this.playerShip.style.left = toPixels(parseInt(this.playerShip.style.left) + userSpeed);
  }

  moveLeft(){
    this.playerShip.style.left = toPixels(parseInt(this.playerShip.style.left) - userSpeed);
  }


  shoot(){
    var projectile = projectiles.pop();
    projectile.style.left = toPixels(parseInt(this.playerShip.style.left)+5);
    projectile.style.top = this.playerShip.style.top;
    projectile.style.visibility ='visible';
  }
}


function gameController() {  
  // switch(div.className){
  //   case "row0":
  //     userScore+=topRowScore
  //   break
  //   case "row1":
  //     userScore+=secondRowScore
  //   break
  //   case "row2":
  //     userScore+=thirdRowScore
  //   break
  //   case "row3":
  //     userScore+=bottomRowScore
  //   break
  // }
  document.getElementById("show_score").innerHTML=("Your score: " + userScore); 

  document.getElementById("user_score").innerHTML=(userScore);

  if (livesRemaining === 0) {
    allScores.push(userScore);
    allScores.sort();
    highScore = allScores[allScores.length - 1];
  }
  document.getElementById("high_score").innerHTML=("Highest score: " + highScore + " By" + userName);


  document.getElementById("show_lives").innerHTML=("Lives remaining: " + livesRemaining);

}