import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from '../phaser/GameScene';

function GameCanvas() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,          // Set canvas dimensions
      height: 600,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,    // Enable for debugging character movement
        },
      },
      scene: [GameScene],   // Load the main game scene
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);   // Clean up when component unmounts
    };
  }, []);

  return <div id="game-container" style={{ width: '100%', height: '100%' }} />;
}

export default GameCanvas;
