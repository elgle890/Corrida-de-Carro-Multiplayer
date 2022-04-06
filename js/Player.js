class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
  }

  getCount() {
    var playerCountRef = database.ref('playerCount');
    playerCountRef.on('value', function (data) {
      playerCount = data.val();
    })
  }

  updateCount(number) {
    database.ref("/").update({
      playerCount: number
    });
  }

  addPlayer() {
    var playerRef = "players/player"+ player.index;
    if(player.index == 1) {
      player.positionX = width/2 - 100;
    } else {
      player.positionX = width/2 + 100;
    }

    database.ref(playerRef).set({
      name: player.name,
      positionX: player.positionX,
      positionY:  player.positionY
    })
  }

  static getInfosPlayer() {
    var playersRef = database.ref("players");
    playersRef.on("value", function (data) {
      players = data.val();
    });
  }
}
