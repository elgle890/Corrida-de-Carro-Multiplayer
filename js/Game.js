class Game {
  constructor() {}

  start() {
    form = new Form();
    form.display();
    player = new Player();

    player.getCount();

    car1 = createSprite(width/2-50, height-100);
    car1.addImage(car1Img);
    car1.scale = 0.07;

    car2 = createSprite(width/2+100, height-100);
    car2.addImage(car2Img);
    car2.scale = 0.07;
    
  }

  update(number) {
    database.ref("/").update({
      gameState: number
    })
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on('value', function (data) {
      gameState = data.val();
    })

  }

  play() {
    form.hide();
    Player.getInfosPlayer();

    if(players != undefined) {
      image(trackImg, 0, -height * 5, width, height * 6);
      drawSprites();
    }
  }
}
