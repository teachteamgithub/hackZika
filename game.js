// define variables
let game;
let player;
let platforms;
let badges;
let cursors;
let jumpButton;
let text;
let message;
let won = false;
let currentScore = 0;
let lives = 5;
let level;
let fish = 'assets/loveFish.png';

// barrier randomizer
// function randomItems() {
//   let items = Math.floor(Math.random() * 500) - 1;
// }

// add collectable
function addItems() {
  items = game.add.physicsGroup();
  createItem(375, 400, 'poison');
  createItem(100, 100, 'coin');
  createItem(100, 100, 'coin');
  createItem(225, 200, 'star');
  createItem(575, 300, 'coin');
  createItem(575, 200, 'heart');
  createItem(300, 120, 'fish');
  createItem(100, 510, 'bush');
  createItem(425, 510, 'bush');
}

// add platforms
function addPlatforms() {
  platforms = game.add.physicsGroup();
}

// create a single animated item
function createItem(left, top, image) {
  let item = items.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

// create badge to go to next level

function createBadge() {
  badges = game.add.physicsGroup();
  let badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects an item on the screen

function itemHandler(player, item) {
  item.kill();
  switch (item.key) {
    case 'poison':
      lives -= 1;
      break;
    case 'mist':
      lives -= 2;
      break;
    case 'window':
      lives -= 3;
      break;
    case 'fish':
      lives = lives - lives;
      break;
    case 'coin':
      currentScore += 25;
      break;
    case 'honey':
      currentScore += 50;
      break;
    case 'heart':
      lives += 1;
      break;
    case 'star':
      currentScore += 100;
      break;
    case 'bush':
      currentScore += 5;
      break;
  }
}

// when the player collects the badge
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function() {
  game = new Phaser.Game(900, 550, Phaser.AUTO, 'backgroundImage', {
    preload: preload,
    create: create,
    update: update,
    render: render
  });

  // before the game begins
  function preload() {
    game.load.image('night', 'assets/middleNight.png');
    //load spritesheets
    game.load.spritesheet('bush', 'assets/smallBush.png', 75, 40);
    game.load.spritesheet('player', 'assets/mosquito.png', 40, 40);
    game.load.spritesheet('coin', 'assets/coin.png', 36, 44);
    game.load.spritesheet('poison', 'assets/poison.png', 32, 32);
    game.load.spritesheet('star', 'assets/star.png', 32, 32);
    game.load.spritesheet('heart', 'assets/hearts.png', 16, 14);
    game.load.spritesheet('fish', 'assets/loveFish.png', 24, 37.5);
  }

  //initial game set up
  function create() {
    let backgroundImage = game.add.image(
      game.world.centerX,
      game.world.centerY,
      'night'
    );

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    backgroundImage.anchor.set(0.5);
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 650;

    addItems();

    // addPlatforms();
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, 'SCORE: ' + currentScore, {
      font: 'bold 20px "Press Start 2P"',
      fill: 'white'
    });
    message = game.add.text(game.world.centerX, 275, '', {
      font: 'bold 48px "Press Start 2P"',
      fill: 'white'
    });
    message.anchor.setTo(0.5, 1);
  }

  //while the game is running
  function update() {
    text.text = 'SCORE: ' + currentScore + ' LIVES: ' + lives;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    game.time.events.loop(Phaser.Time.SECOND * 3, fish, this);

    // Player Mechanics
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -350;
      player.scale.x = 1;
    }

    if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 350;
      player.scale.x = -1;
    }

    if (cursors.up.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.y = -350;
      player.scale.y = 1;
    }

    if (cursors.down.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.y = 300;
      player.scale.y = 1;
    }

    if (cursors.down.isDown) {
      player.animations.stop();
    }

    if (
      jumpButton.isDown &&
      (player.body.onFloor() || player.body.touching.down)
    ) {
      player.body.velocity.y = -400;
    }

    if (won) {
      message.text = 'Prepare for the next level!';
    }
    if (lives <= 0) {
      lost = true;
      message.text = 'You LOSE!';
    }
  }

  function render() {}
};
