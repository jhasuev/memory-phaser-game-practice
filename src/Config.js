import GameScene from "./GameScene";

export default {
    scene: new GameScene(),
    type: Phaser.AUTO,
    row: 2,
    col: 5,
    cards: [1, 2, 3, 4, 5],
    timeout: 30,
    width: 1280,
    height: 720,
}