
var alienSprites=["assets/sprites/blue_alien.png","assets/sprites/green_alien.png","assets/sprites/blue_alien2.png","assets/sprites/red_alien.png"];
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
var cannotShoot=true;
var respawnTime=3000;
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
var livesRemaining=3;
var userName='';
var topScore="top_score";



$(document).ready(function() {
  instantiateProjectiles(projectileNumber);
  gameController();
  instantiateEnemies();
  playerShip=new Player(); 
  

});

function startEnemies(){
  console.log("first shot");
  enemyMoveInterval = setInterval(moveEnemies,moveTime); 
  setInterval(randomShoot,2000);  
}

function randomShoot(){
  randomEnemy=Math.floor(Math.random()*(enemyShips.length-1));
  console.log("enemy "+randomEnemy+" shoots");
  if(enemyShips[randomEnemy].alive){
      
      enemyShips[randomEnemy].shoot(); 
  }else{
    randomShoot();
  }
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
  gameObject.style.visibility = "visible"
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

  get alive(){
    debugger
    return this.enemyShip.style.visibility === "visible";  
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

  destroy(){
    this.enemyShip.style.visibility="hidden";

  }
}

class Player {
  constructor() {
    this.playerShip=this.instantiatePlayer();
  }

  instantiatePlayer(){
    var div = createGameObject(playerSprite);
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    return div;
  }

  start(instance=this){
    console.log("start")
    cannotShoot=false;
    instance.playerShip.style.visibility = "visible"
    instance.playerShip.style.top = "85%";
    instance.playerShip.style.left = "50%";
  }

  get alive(){
    if(this.playerShip.style.visibility === "visible") return true;
    return false;
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

  destroy(){
    this.playerShip.style.visibility="hidden";
    cannotShoot=true;
    setTimeout(playerShip.start,respawnTime,this);
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

  get active(){
    if(this.projectile.style.visibility === "visible") return true;
    return false;
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
      if (isColliding(projectile,element)&&element.alive&&projectile.active) {
        element.destroy();
        projectile.destroy();
      }
      })
    }else{
      if (isColliding(projectile,playerShip)&&playerShip.alive&&projectile.active) {
        playerShip.destroy();
        projectile.destroy();
      }
    }
  }

  destroy(){
    this.stop();
    this.setVisibility(false);
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

class gameController {  
  constructor(startingLives){
    this.startingLives=startingLives;
  }

  addScore(row){
  switch(div.className){
      case "row0":
        userScore+=topRowScore
      break
      case "row1":
        userScore+=secondRowScore
      break
      case "row2":
        userScore+=thirdRowScore
      break
      case "row3":
        userScore+=bottomRowScore
      break;
    }
  }
    
  UI() {
  userScore = document.getElementById("user_score");
  document.getElementById("live_score").innerHTML=("Your score: " + userScore); 
  document.getElementById("high_score").innerHTML=("Highest score: " + highScore + " By" + userName);
  document.getElementById("show_lives").innerHTML=("Lives remaining: " + livesRemaining);

  //end game form
  if (livesRemaining === 0) {
    var displayForm = document.getElementById("end_game_display");
    displayForm.style.visibility = "visible";
    var userName = document.getElementById("final_form").sumbit();

    //need to access top 10 scores
    var times = 11;
    //for(var i=1; i < times; i++){
     //var topScores = document.getElementById("top_score" + i);
    }
  }
}

  function toggle_top_ten1() {
    var toggle = document.getElementById("show_top_ten1");
    if (toggle.style.display === "none") {
        toggle.style.display = "block";
    } else {
        toggle.style.display = "none";
    }
  }

  function toggle_top_ten2() {
    var toggle = document.getElementById("show_top_ten2");
    if (toggle.style.display === "none") {
        toggle.style.display = "block";
    } else {
        toggle.style.display = "none";
    }
  }


function initiate_game() {
  playerShip.start();
  startEnemies();
  var display = document.getElementById("initial_buttons")
  display.style.display = "none";
}