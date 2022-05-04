class Game {
  constructor() {
    this.resetButton = createButton("");
    this.resetTitle = createElement("h2");

    this.leaderTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    this.leftKeyActive = false;
    this.blast = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();

    player.getCount();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage(car1Img);
    car1.addImage("blast", blastImg);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage(car2Img);
    car2.addImage("blast", blastImg);
    car2.scale = 0.07;

    cars = [car1, car2];

    groupObstacle = new Group();
    groupFuel = new Group();
    groupGoldCoin = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Img },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Img },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Img },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Img },
      { x: width / 2, y: height - 2800, image: obstacle2Img },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Img },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Img },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Img },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Img },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Img },
      { x: width / 2, y: height - 5300, image: obstacle1Img },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Img },
    ];

    this.addSprites(groupGoldCoin, 18, goldCoindImg, 0.09);
    this.addSprites(groupFuel, 4, fuelImg, 0.02);
    this.addSprites(
      groupObstacle,
      obstaclesPositions.length,
      obstacle1Img,
      0.02,
      obstaclesPositions
    );
  }

  addSprites(spriteGroup, spritesNum, spriteImg, scale, positions = []) {
    for (var i = 0; i < spritesNum; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImg = positions[i].image;
      } else {
        x = Math.round(random(width / 2 + 150, width / 2 - 150));
        y = Math.round(random(-height * 4.5, height - 400));
      }

      var sprite = createSprite(x, y);
      sprite.addImage(spriteImg);
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleCoins(index) {
    cars[index].overlap(groupGoldCoin, (collector, collected) => {
      player.score += 1;
      player.update();
      collected.remove();
    });
  }

  update(number) {
    database.ref("/").update({
      gameState: number,
    });
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }

  handleElements() {
    form.hide();
    form.titleImg.position(width / 2 - 150, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.position(width / 2 + 350, 40);
    this.resetTitle.html("reset game");
    this.resetTitle.class("resetTitle");

    this.resetButton.position(width / 2 + 380, 100);
    this.resetButton.class("resetButton");

    this.leaderTitle.position(width / 18, 40);
    this.leaderTitle.html("placar");
    this.leaderTitle.class("resetTitle");

    this.leader1.position(width / 18, 80);
    this.leader1.html("leader1");
    this.leader1.class("leadersText");
    this.leader2.position(width / 18, 130);
    this.leader2.html("leader2");
    this.leader2.class("leadersText");
  }

  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  gameOver() {
    swal({
      title: `fim de jogo!`,
      text: "Oops! Você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "obrigado por jogar!",
    });
  }

  play() {
    this.handleElements();
    this.handleMousePressedResetButton();
    Player.getInfosPlayer();
    player.getCarsAtEnd();

    if (player.positionY > height * 6 - 100) {
      player.rank += 1;
      Player.updateCarsAtEnd(player.rank);
      player.update();
      gameState = 2;
      this.showRank();
    }

    if (players != undefined) {
      image(trackImg, 0, -height * 5, width, height * 6);
      this.showLeaderboard();
      this.showFuelBar();
      this.showLifeBar();
      var index = 0;
      for (var plr in players) {
        var life = players[plr].life;
        var x = players[plr].positionX;
        var y = height - players[plr].positionY;
        cars[index].position.x = x;
        cars[index].position.y = y;

        if (life <= 0) {
          cars[index].changeImage("blast");
          cars[index].scale = 0.3;
        }

        index += 1;

        if (player.index == index) {
          if(player.life <= 0) {
            this.blast = true;
            gameState = 2;
            this.gameOver();
          }
          fill("red");
          ellipse(x, y, 60, 60);
          camera.position.x = width / 2;
          this.handleCoins(index - 1);
          this.handleFuel(index - 1);
          this.obstacleCollision(index - 1);
          if (players[plr].positionY > height) {
            camera.position.y = y;
          }
        }
      }

      this.handlePlayerController();

      drawSprites();
    }
  }

  handlePlayerController() {
    if(!this.blast) {
      if (keyIsDown(38)) {
        player.positionY += 10;
        player.update();
        this.playerMoving = true;
      }

      if (keyIsDown(39)) {
        player.positionX += 10;
        player.update();
        this.leftKeyActive = false;
      }

      if (keyIsDown(37)) {
        player.positionX -= 10;
        player.update();
        this.leftKeyActive = true;
      }
    }
  }

  handleMousePressedResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        CarsAtEnd: 0,
      });
      window.location.reload();
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var player = Object.values(players);
    if (
      (player[0].rank === 0 && player[1].rank === 0) ||
      player[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        player[0].rank + "&emsp;" + player[0].name + "&emsp;" + player[0].score;

      leader2 =
        player[1].rank + "&emsp;" + player[1].name + "&emsp;" + player[1].score;
    }

    if (player[1].rank === 1) {
      leader1 =
        player[1].rank + "&emsp;" + player[1].name + "&emsp;" + player[1].score;

      leader2 =
        player[0].rank + "&emsp;" + player[0].name + "&emsp;" + player[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  showFuelBar() {
    push();
    fill("white");
    rect(player.positionX - 130, height - player.positionY - 100, 185, 20);
    fill("#ffc400");
    rect(
      player.positionX - 130,
      height - player.positionY - 100,
      player.fuel,
      20
    );
    pop();
    image(
      fuelImg,
      player.positionX - 150,
      height - player.positionY - 100,
      20,
      20
    );
  }

  showLifeBar() {
    push();
    fill("white");
    rect(player.positionX - 130, height - player.positionY - 130, 185, 20);
    fill("red");
    rect(
      player.positionX - 130,
      height - player.positionY - 130,
      player.life,
      20
    );
    pop();

    image(
      lifeImg,
      player.positionX - 150,
      height - player.positionY - 130,
      20,
      20
    );
  }

  handleFuel(index) {
    cars[index].overlap(groupFuel, (collector, collected) => {
      player.fuel += 25;
      collected.remove();
    });
    if (this.playerMoving == true) {
      player.fuel -= 1;
      this.playerMoving = false;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  obstacleCollision(index) {
    if (cars[index].collide(groupObstacle)) {
      if (player.life > 0) {
        player.life -= 185 / 4;
      }
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }
      player.update();
    }
  }
}
