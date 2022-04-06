class Game {
  constructor() {}

  start() {
    form = new Form();
    form.display();
    player = new Player();

    player.getCount();
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

  }
}
