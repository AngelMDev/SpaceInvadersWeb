var alienSprites=["assets/blue_alien.png","assets/blue_alien2.png","assets/green_alien.png","assets/red_alien.png"]
var playerSprite="assets/player.png";
var startingPosY=100;
var startingPosX=100;
var horizontalSpacing=75;
var horizontalOffset=40;
var verticalSpacing=50;

$(document).ready(function() {
  instantiateEnemies();
  instantiatePlayer();
});

function instantiateEnemies() {
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
    }
  } 
}

function instantiatePlayer(){
  var div = document.createElement("div");
  document.body.appendChild(div);
  var img = document.createElement("img");
  div.appendChild(img);
  div.style.position = "absolute";
  div.style.top = "700px";
  div.style.left = "500px";
  img.src=playerSprite;
}

function toPixels(integer){
  return integer+"px";
}