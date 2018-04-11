
var alienSprites=["assets/sprites/blue_alien.png","assets/sprite/blue_alien2.png","assets/sprites/green_alien.png","assets/sprites/red_alien.png"]
var playerSprite="assets/sprites/player.png";
var projectileSprite="assets/sprites/projectile.png"
var board; 
var startingPosY=80;
var startingPosX=100;
var horizontalSpacing=75;
var horizontalOffset=40;
var verticalSpacing=50;
var projectileSpeed=60;
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
var projectiles = new Array();
reverse=false;
var playerShip;
var enemyShips=[];
var userScore=0;
var highScore=0;
var allScore=[];
var livesRemaining=3;
var userName='';


$(document).ready(function() {
  instantiateProjectiles(projectileNumber);
  gameController();
  instantiateEnemies();
  playerShip=new Player();
  enemyMoveInterval = setInterval(moveEnemies,moveTime);  
});


document.addEventListener('keydown',function (evt){
  if(evt.which === 37){
    playerShip.moveLeft();
  } else if (evt.which === 39){
    playerShip.moveRight();
  } else if(evt.which== 32){
    playerShip.shoot();
  }
});

function instantiateProjectiles(projectileNumber){
  for(var i=0;i<projectileNumber;i++){
    projectiles.push(new Projectile());
  }
}

function instantiateEnemies() {
  count = 0;
  for(var j=0;j<4;j++){
    for (var i=0;i<11;i++){
      var div=createGameObject();
      //Get first (and only) child of div, which is an img
      var img=div.children[0];
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
  var gameObject = document.createElement("div");
  document.body.appendChild(gameObject);
  var objectSprite = document.createElement("img");
  if(sprite!=""){
    objectSprite.src=sprite;
  }
  gameObject.appendChild(objectSprite);
  gameObject.style.position = "absolute";
  return gameObject;
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
    var div = createGameObject(playerSprite);
    div.style.position = "absolute";
    div.style.top = "600px";
    div.style.left = "500px";
    return div;
  }

  left() {
    return this.playerShip.style.left;
  }

  top(){
    return this.playerShip.style.top;
  }

  moveRight(){
    this.playerShip.style.left = toPixels(parseInt(this.playerShip.style.left) + userSpeed);
  }

  moveLeft(){
    this.playerShip.style.left = toPixels(parseInt(this.playerShip.style.left) - userSpeed);
  }
  shoot(){
    var projectile=projectiles.pop();
    projectile.shoot(1);
  }
}

class Projectile {
  constructor(){
    this.projectile=createGameObject(projectileSprite);
    this.projectile.style.visibility="hidden";
  }
  //moves projectile in the specified direction (1 for up or -1 for down)
  shoot(direction){   
    this.projectile.style.left = toPixels(parseInt(playerShip.left())+6);
    this.projectile.style.top = toPixels(parseInt(playerShip.top())-20);
    this.projectile.style.visibility ='visible';
    var moveProjectileInterval=setInterval(this.move(direction),300);
  }

  move(direction){
    console.log("moving");
    this.projectile.style.top = toPixels(parseInt(this.projectile.style.top) + projectileSpeed * -direction);
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