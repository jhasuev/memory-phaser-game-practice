import GameScene from "./GameScene";

export default {
    scene: new GameScene(),
    type: Phaser.AUTO,
    scores: [
        100,
        250,
        500,
        1000,
        5000,
    ],
    levels: [
        {
            cards: [1, 2],
            row: 2,
            col: 2,
            timeout: 15,
        },
        {
            cards: [1, 2, 3],
            row: 2,
            col: 3,
            timeout: 20,
        },
        {
            cards: [1, 2, 3, 4],
            row: 2,
            col: 4,
            timeout: 25,
        },
        {
            cards: [1, 2, 3, 4, 5],
            row: 2,
            col: 5,
            timeout: 30,
        },
        {
            cards: [1, 2, 3, 4, 5],
            row: 2,
            col: 5,
            timeout: 25,
        },
        {
            cards: [1, 2, 3, 4, 5],
            row: 2,
            col: 5,
            timeout: 20,
        },
        {
            cards: [1, 2, 3, 4, 5],
            row: 2,
            col: 5,
            timeout: 15,
        },
    ],
    width: 1280,
    height: 720,
}
