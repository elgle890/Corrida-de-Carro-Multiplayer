var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState;
var players;
var car1, car2, cars;
var car1Img, car2Img, trackImg;
var obstacle1Img, obstacle2Img, fuelImg, goldCoindImg, lifeImg;
var groupObstacle, groupFuel, groupGoldCoin;
function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  trackImg = loadImage('./assets/track.jpg');
  car1Img = loadImage('./assets/car1.png');
  car2Img = loadImage('./assets/car2.png');
  obstacle1Img = loadImage('./assets/obstacle1.png');
  obstacle2Img = loadImage('./assets/obstacle2.png');
  fuelImg = loadImage('./assets/fuel.png');
  goldCoindImg = loadImage('./assets/goldCoin.png');
  lifeImg = loadImage("./assets/life.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  gameState = game.getState();
  game.start();



}

function draw() {
  background(backgroundImage);

  if(playerCount == 2) {
    game.update(1);
  }
  if(gameState == 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
