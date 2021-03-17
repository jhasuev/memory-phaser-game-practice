import './scss/main.scss'
import "./phaser"

const scene = new Phaser.Scene("Game")

scene.preload = function () {
    // загрузить изображение
    scene.load.image("bg", "assets/img/background.png")
    scene.load.image("card", "assets/img/card.png")
}

scene.create = function () {
    // вывести изображение
    scene.add.sprite(0, 0, "bg").setOrigin(0)

    for (let position of scene.getCardsPositions()) {
        scene.add.sprite(position.x, position.y, "card").setOrigin(0)
    }
}

scene.getCardsPositions = function () {
    const positions = []

    const {width, height} = this.textures.get("card").getSourceImage()
    const offset = 10
    const cardsWidth = (width + offset) * config.col - offset
    const cardsHeight = (height + offset) * config.row - offset

    const leftOffset = (this.sys.game.config.width - cardsWidth) / 2
    const topOffset = (this.sys.game.config.height - cardsHeight) / 2

    for (let rowIndex = 0; rowIndex < config.row; rowIndex++) {
        for (let colIndex = 0; colIndex < config.col; colIndex++) {
            positions.push({
                x: (width + offset) * colIndex + leftOffset,
                y: (height + offset) * rowIndex + topOffset
            })
        }
    }

    return positions
}

const config = {
    scene,
    type: Phaser.AUTO,
    row: 2,
    col: 5,
    width: 1280,
    height: 720,
}

const game = new Phaser.Game(config)