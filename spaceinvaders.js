
var alienSprites=["assets/sprites/blue_alien.png","assets/sprites/blue_alien2.png","assets/sprites/green_alien.png","assets/sprites/red_alien.png"];
var playerSprite="assets/sprites/player.png";
var projectileSprite="assets/sprites/projectile.png"
var board; 
var leftBoundary=10;
var rightBoundary=87;
var startingPosY=14;
var startingPosX=12;
var horizontalSpacing=5;
var horizontalOffset=2.5;
var verticalSpacing=8;
var projectileSpeed=6;
var playerSpeed=1;
var playerProjectileSpeed=3;
var enemyProjectileSpeed=2;
var cannotShoot=false;
//time in ms that takes for the projectile to update position (less is faster)
var projectileMoveFreq=40;
//Enemy move distance
var moveDistanceX=3;
var moveDistanceY=5;
//Time in ms that it takes for the enemy to move to the right/left
var moveTime=2000;
//Number of times that it will move to the left/right before moving down and reversing direction
var moveTurns=6;
//Keeps current move turn
var movesRemaining=moveTurns;
//Number of projectiles instantiated when the game starts
var projectileNumber=20;
var projectiles = new Array();
reverse=false;
var playerShip;
var enemyShips=[];
//game controller vars
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
  StartEnemies();
});

function StartEnemies(){
  console.log("first shot");
  enemyMoveInterval = setInterval(moveEnemies,moveTime); 
  setInterval(RandomShoot,2000);  
}

function RandomShoot(){
  randomEnemy=Math.floor(Math.random()*(enemyShips.length-1));
  console.log("enemy "+randomEnemy+" shoots");
  enemyShips[randomEnemy].shoot(); 
}


document.addEventListener('keydown',function (evt){
  if(evt.which === 37){
    if(playerShip.left<leftBoundary) return;
    playerShip.moveLeft();
  } else if (evt.which === 39){
    if(playerShip.left>rightBoundary) return;
    playerShip.moveRight();
  } else if(evt.which== 32){ 
    if (cannotShoot) return; 
    playerShip.shoot();  
    cannotShoot=true;
  }
});

document.addEventListener('keyup',function(evt){
  cannotShoot=false;
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
      var offset=0;
      if(j % 2 != 0) offset=horizontalOffset;
      var enemy=new Enemy(alienSprites[j],toPercentage(startingPosX + horizontalSpacing * i + offset),toPercentage(startingPosY + verticalSpacing * j),i,j);
      enemyShips[count] = enemy; 
      count++;    
    }
  } 
}

function toPercentage(integer){
  return integer+"%";
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
    currentPosX=parseInt(enemy.left);
    if(!reverse){        
        enemy.left=toPercentage(currentPosX+moveDistanceX);
      } else {
        enemy.left=toPercentage(currentPosX-moveDistanceX);
      }
    }else{
      currentPosY=parseInt(enemy.top);
      enemy.top=toPercentage(currentPosY+moveDistanceY);
    }
  });
  movesRemaining--;
  if(movesRemaining<0){
    movesRemaining=moveTurns;
    reverse=!reverse;
  }
}

class Enemy {
  constructor(sprite,xPos,yPos,col,row) {
    this.enemyShip=this.instantiateEnemy(sprite,xPos,yPos,col,row);
  }

  get left() {
    return this.enemyShip.style.left;
  }

  get x() {
    return this.enemyShip.getBoundingClientRect().x;
  }

  get y(){
    return this.enemyShip.getBoundingClientRect().y;
  }

  set left(value) {
    this.enemyShip.style.left=value;
  }

  get top() {
    return this.enemyShip.style.top;
  }

  set top(value) {
    this.enemyShip.style.top=value;
  }

  get width(){
    return this.enemyShip.offsetWidth;
  }

  get height(){
    return this.enemyShip.offsetHeight;
  }

  instantiateEnemy(sprite,xPos,yPos,col,row){
    var enemyShip = createGameObject(sprite);
    enemyShip.style.position = "absolute";
    enemyShip.style.top = yPos;
    enemyShip.style.left = xPos;
    enemyShip.style.zIndex = "-1";
    enemyShip.classList.add('enemy');
    enemyShip.classList.add('row'+row); //enemy row0
    enemyShip.setAttribute('id',"enemy"+col+''+row) //enemy32
    return enemyShip;
  }

  shoot(){ 
    var projectile=projectiles.pop();
    projectile.shoot(-1,this.left,this.top,enemyProjectileSpeed);  
  }
}

class Player {
  constructor() {
    this.playerShip=this.instantiatePlayer();
  }

  instantiatePlayer(){
    var div = createGameObject(playerSprite);
    div.style.position = "absolute";
    div.style.top = "85%";
    div.style.left = "50%";
    return div;
  }

  get left() {
    return parseInt(this.playerShip.style.left);
  }

  get x() {
    return this.playerShip.getBoundingClientRect().x;
  }

  get y() {
    return this.playerShip.getBoundingClientRect().y;
  }

  get top(){
    return parseInt(this.playerShip.style.top);
  }

  get width(){
    return this.playerShip.offsetWidth;
  }

  get height(){
    return this.playerShip.offsetHeight;
  }

  moveRight(){
    this.playerShip.style.left = toPercentage(parseInt(this.playerShip.style.left) + playerSpeed);
  }

  moveLeft(){
    this.playerShip.style.left = toPercentage(parseInt(this.playerShip.style.left) - playerSpeed);
  }

  shoot(){ 
    var projectile=projectiles.pop();
    projectile.shoot(1,toPercentage(parseInt(playerShip.left)+0.5),toPercentage(parseInt(playerShip.top)+0.5),playerProjectileSpeed);
    playerShip.canShoot=false;
  }
}

class Projectile {
  constructor(){
    this.projectile=createGameObject(projectileSprite);
    this.projectile.style.visibility="hidden";
    this.moveProjectileInterval;
  }

  setVisibility(visible){
    if(visible) {
      this.projectile.style.visibility='visible';
    }else {
      this.projectile.style.visibility='hidden';
    }
  }

  get left() {
    return this.projectile.style.left;
  }

  set left(value){
    this.projectile.style.left=value;
  }
  get top() {
    return this.projectile.style.top;
  }

  get x() {
    return this.projectile.getBoundingClientRect().x;
  }
  
  get y(){
    return this.projectile.getBoundingClientRect().y;
  }

  set top(value){
    this.projectile.style.top=value;
  } 

  get width(){
    return this.projectile.offsetWidth;
  }

  get height(){
    return this.projectile.offsetHeight;
  }

  stop(){
    clearInterval(this.moveProjectileInterval);
  }

  //moves projectile in the specified direction (1 for up or -1 for down) from the x,y position specified
  shoot(direction,xPos,yPos,speed){   
    this.projectile.style.left = xPos;//
    this.projectile.style.top = yPos; //
    this.projectile.style.visibility ='visible';
    this.moveProjectileInterval=setInterval(this.move,projectileMoveFreq,direction,this,speed);
    setTimeout(this.recycleProjectile,2000,this);
  }

  move(direction,projectile,speed){
    projectile.top = toPercentage(parseInt(projectile.top) + speed *-direction); 
    //direction is passed so the function knows if it was shot by a player or an enemy
    projectile.detectCollision(direction,projectile);
  }

  recycleProjectile(projectile){
    projectile.setVisibility(false);
    projectile.stop();
    projectiles.push(projectile);    
  }

  detectCollision(direction,projectile){
    if(direction>0){
      enemyShips.forEach(function(element){
      if (isColliding(projectile,element)) return;
      })
    }else{
      if (isColliding(projectile,playerShip)) return;
    }
  }
}



function isColliding(a, b) {  
  return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))
);
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