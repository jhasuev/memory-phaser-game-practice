import './scss/main.scss'
import "./phaser"

const scene = new Phaser.Scene("Game")

scene.preload = function () {
    // загрузить изображение
    scene.load.image("bg", "assets/img/background.png")
}

scene.create = function () {
    // вывести изображение
    scene.add.sprite(0, 0, "bg").setOrigin(0)
}

const config = {
    scene,
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
}

const game = new Phaser.Game(config)