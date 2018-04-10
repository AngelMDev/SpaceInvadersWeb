var alienSprites=["assets/blue_alien.png","assets/blue_alien2.png","assets/green_alien.png","assets/red_alien.png"]
var playerSprite="assets/player.png";
var startingPosY=80;
var startingPosX=100;
var horizontalSpacing=75;
var horizontalOffset=40;
var verticalSpacing=50;
var enemyShips = [];
var topRowScore = 100;
var secondRowScore = 50;
var thirdRowScore = 20;
var bottomRowScore = 10;
var userScore=0;
var highScore=0;
var livesRemaining=3;
var allScores=[];
var userName = "";

$(document).ready(function() {
  instantiateEnemies();
  instantiatePlayer();
  gameController();
});


function instantiateEnemies() {
  count = 0;
  for(var j=0;j<4;j++){
    for (var i=0;i<11;i++){
      var div = document.createElement("div");
      document.body.appendChild(div);
      var img = document.createElement("img");
      div.appendChild(img);
      div.style.position = "absolute";
      div.style.top = toPixels(startingPosY + verticalSpacing * j);
      div.classList.add('enemy');
      div.classList.add('row'+j);
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

function instantiatePlayer(){
  var div = document.createElement("div");
  document.body.appendChild(div);
  var img = document.createElement("img");
  div.appendChild(img);
  div.style.position = "absolute";
  div.style.top = "600px";
  div.style.left = "500px";
  img.src=playerSprite;
}

function toPixels(integer){
  return integer+"px";
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