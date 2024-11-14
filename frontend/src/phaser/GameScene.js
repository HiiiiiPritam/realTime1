// import Phaser from 'phaser';
// import io from 'socket.io-client';

// import tileset from '../assets/testmap.json'; // Tilemap JSON file
// import characterImage from '../assets/charactermap.png'; // Character sprite sheet

// // Tileset images
// import object1 from '../assets/Basic_Grass_Biom_things.png';
// import grass from '../assets/Grass.png';
// import hills from '../assets/Hills.png';
// import water from '../assets/Water.png';
// import land from '../assets/Tilled_Dirt_Wide_v2.png';
// import chicken from '../assets/chicken.png';

// class GameScene extends Phaser.Scene {
//   constructor() {
//     super({ key: 'GameScene' });
//     this.players = {};
//     this.socket = null;
//   }

//   preload() {
//     // Load the tilemap JSON
//     this.load.tilemapTiledJSON('map', tileset);

//     // Load each tileset image individually
//     this.load.image('object1Tileset', object1);
//     this.load.image('grassTileset', grass);
//     this.load.image('hillsTileset', hills);
//     this.load.image('waterTileset', water);
//     this.load.image('landTileset', land);
//     this.load.image('chickenTileset', chicken);

//     // Load the character sprite sheet
//     this.load.spritesheet('character', characterImage, {
//       frameWidth: 72,
//       frameHeight: 72
//     });
//   }

//   create() {
//     // Connect to WebSocket server
//     this.socket = io('http://localhost:3000');
//     console.log("hello",this.socket);
    
//     // Handle new player connection
//     this.socket.on('currentPlayers', (players) => {
//       console.log("players",players);
//       Object.keys(players).forEach((id) => {
//         if (id === this.socket.id) {
//           console.log("how are you",players[id]);
          
//           this.addPlayer(players[id]);
//         } else {
//           this.addOtherPlayer(players[id]);
//         }
//       });
//     });

//     // Handle new player addition
//     this.socket.on('newPlayer', (playerInfo) => {
//       this.addOtherPlayer(playerInfo);
//     });

//     // Handle player disconnection
//     this.socket.on('disconnectPlayer', (playerId) => {
//       if (this.players[playerId]) {
//         this.players[playerId].destroy();
//         delete this.players[playerId];
//       }
//     });

// // Updating Other Players
// this.socket.on('playerMoved', (data) => {
//   if (data.id !== this.socket.id && this.players[data.id]) {
//       const otherPlayer = this.players[data.id];
//       otherPlayer.x = data.x;
//       otherPlayer.y = data.y;

//       if (data.direction) {
//           otherPlayer.anims.play(data.direction, true);
//       } else {
//           otherPlayer.anims.stop();
//       }
//   }
// });
    

//     // Create the tilemap
//     const map = this.make.tilemap({ key: 'map' });

//     // Add each tileset image to the map
//     const object1Tileset = map.addTilesetImage('elem1', 'object1Tileset');
//     const grassTileset = map.addTilesetImage('grass', 'grassTileset');
//     const hillsTileset = map.addTilesetImage('hill', 'hillsTileset');
//     const waterTileset = map.addTilesetImage('water', 'waterTileset');
//     const landTileset = map.addTilesetImage('bg', 'landTileset');
//     const chickenTileset = map.addTilesetImage('chr1', 'chickenTileset');

//     // Create layers in the map (make sure layer names match those in Tiled)
//     const groundLayer = map.createLayer('Tile Layer 1', [object1Tileset, grassTileset, hillsTileset, waterTileset, landTileset, chickenTileset], 0, 0);
//     const objectLayer = map.createLayer('el1', [object1Tileset, grassTileset, hillsTileset, waterTileset, landTileset, chickenTileset], 0, 0);
//     const objectLayer2 = map.createLayer('el2', [object1Tileset, grassTileset, hillsTileset, waterTileset, landTileset, chickenTileset], 0, 0);

//     // Set up collision properties (if needed)
//     groundLayer.setCollisionByProperty({ collides: true });

//     // Define animations for character movement
//     this.anims.create({
//       key: 'walk-down',
//       frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
//       frameRate: 10,
//       repeat: -1
//     });
//     this.anims.create({
//       key: 'walk-left',
//       frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
//       frameRate: 10,
//       repeat: -1
//     });
//     this.anims.create({
//       key: 'walk-right',
//       frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
//       frameRate: 10,
//       repeat: -1
//     });
//     this.anims.create({
//       key: 'walk-up',
//       frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
//       frameRate: 10,
//       repeat: -1
//     });

//     // Add cursor input controls
//     this.cursors = this.input.keyboard.createCursorKeys();
//   }

//   update() {
//     if (!this.player) {
//         console.log("No player");
//         return;
//     }

//     let moving = false;

//     if (this.cursors.left.isDown) {
//         this.player.setVelocityX(-100);
//         this.player.anims.play('walk-left', true);
//         moving = 'walk-left';
//     } else if (this.cursors.right.isDown) {
//         this.player.setVelocityX(100);
//         this.player.anims.play('walk-right', true);
//         moving = 'walk-right';
//     } else if (this.cursors.up.isDown) {
//         this.player.setVelocityY(-100);
//         this.player.anims.play('walk-up', true);
//         moving = 'walk-up';
//     } else if (this.cursors.down.isDown) {
//         this.player.setVelocityY(100);
//         this.player.anims.play('walk-down', true);
//         moving = 'walk-down';
//     } else {
//         this.player.setVelocity(0);
//         this.player.anims.stop();
//         moving = null; // "idle" state, if desired
//     }

//     // Emit movement only if state has changed
//     if (moving !== this.lastMoving) {
//         this.socket.emit('playerMove', {
//             id: this.socket.id,
//             x: this.player.x,
//             y: this.player.y,
//             direction: moving
//         });
//         this.lastMoving = moving;
//     }
// }

//   addPlayer(playerInfo) {
//     this.player = this.physics.add.sprite(playerInfo.x, playerInfo.y, 'character');
//     this.player.setCollideWorldBounds(true);
//     this.cameras.main.startFollow(this.player);
//   }

//   addOtherPlayer(playerInfo) {
//     const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'character');
//     otherPlayer.playerId = playerInfo.playerId;
//     this.players[playerInfo.playerId] = otherPlayer;
//   }
// }

// export default GameScene;

import Phaser from 'phaser';
import io from 'socket.io-client';

import tileset from '../assets/testmap.json'; // Tilemap JSON file
import characterImage from '../assets/charactermap.png'; // Character sprite sheet

// Tileset images
import object1 from '../assets/Basic_Grass_Biom_things.png';
import grass from '../assets/Grass.png';
import hills from '../assets/Hills.png';
import water from '../assets/Water.png';
import land from '../assets/Tilled_Dirt_Wide_v2.png';
import chicken from '../assets/chicken.png';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.players = {};
    this.socket = null;
  }

  preload() {
    // Load the tilemap JSON
    this.load.tilemapTiledJSON('map', tileset);

    // Load each tileset image individually
    this.load.image('object1Tileset', object1);
    this.load.image('grassTileset', grass);
    this.load.image('hillsTileset', hills);
    this.load.image('waterTileset', water);
    this.load.image('landTileset', land);
    this.load.image('chickenTileset', chicken);

    // Load the character sprite sheet
    this.load.spritesheet('character', characterImage, {
      frameWidth: 72,
      frameHeight: 72
    });
  }

  create() {
    // Connect to WebSocket server
    this.socket = io('http://localhost:3000');

    // Handle new player connection
    this.socket.on('currentPlayers', (players) => {
      Object.keys(players).forEach((id) => {
        if (id=== this.socket.id) {
          this.addPlayer(players[id]);
        } else {
          this.addOtherPlayer(players[id]);
        }
      });
    });

    // Handle new player addition
    this.socket.on('newPlayer', (playerInfo) => {
      this.addOtherPlayer(playerInfo);
    });

    // Handle player disconnection
    this.socket.on('disconnectPlayer', (playerId) => {
      if (this.players[playerId]) {
        this.players[playerId].destroy();
        delete this.players[playerId];
      }
    });

    // Handle player movement update
    this.socket.on('playerMoved', (playerInfo) => {
      const player = this.players[playerInfo.playerId];
      if (player) {
        player.setPosition(playerInfo.x, playerInfo.y);
      }
    });

    // Create the tilemap
    const map = this.make.tilemap({ key: 'map' });

    // Add each tileset image to the map
    const object1Tileset = map.addTilesetImage('elem1', 'object1Tileset');
    const grassTileset = map.addTilesetImage('grass', 'grassTileset');
    const hillsTileset = map.addTilesetImage('hill', 'hillsTileset');
    const waterTileset = map.addTilesetImage('water', 'waterTileset');
    const landTileset = map.addTilesetImage('bg', 'landTileset');
    const chickenTileset = map.addTilesetImage('chr1', 'chickenTileset');

    // Create layers in the map (make sure layer names match those in Tiled)
    const groundLayer = map.createLayer('Tile Layer 1', [object1Tileset, grassTileset, hillsTileset, waterTileset, landTileset, chickenTileset], 0, 0);
    const objectLayer = map.createLayer('el1', [object1Tileset, grassTileset, hillsTileset, waterTileset, landTileset, chickenTileset], 0, 0);
    const objectLayer2 = map.createLayer('el2', [object1Tileset, grassTileset, hillsTileset, waterTileset, landTileset, chickenTileset], 0, 0);

    // Set up collision properties (if needed)
    groundLayer.setCollisionByProperty({ collides: true });

    // Define animations for character movement
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('character', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('character', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1
    });

    // Add cursor input controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.player) return;

    // Character movement logic
    let moved = false;
    // console.log("hello world");
    

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-100);
      this.player.anims.play('walk-left', true);
      moved = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(100);
      this.player.anims.play('walk-right', true);
      moved = true;
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-100);
      this.player.anims.play('walk-up', true);
      moved = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(100);
      this.player.anims.play('walk-down', true);
      moved = true;
    } else {
      this.player.setVelocity(0);
      this.player.anims.stop();
    }

    if (moved) {
      console.log("hello world");
    }

    // Emit player movement
    if (moved) {
      this.socket.emit('playerMove', {
        x: this.player.x,
        y: this.player.y,
      });
    }
  }

  addPlayer(playerInfo) {
    this.player = this.physics.add.sprite(playerInfo.x, playerInfo.y, 'character');
    this.player.setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player);
  }

  addOtherPlayer(playerInfo) {
    if (!this.add) {
      console.error("Scene is not ready to add a sprite");
      return;
    }
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'character');
    otherPlayer.playerId = playerInfo.playerId;
    this.players[playerInfo.playerId] = otherPlayer;
  }
}

export default GameScene;
