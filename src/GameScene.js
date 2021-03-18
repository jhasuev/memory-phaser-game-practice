import config from "./Config";
import Card from "./Card"

class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("bg", "assets/img/background.png")
        this.load.image("card", "assets/img/card.png")

        for (let value of config.cards) {
            this.load.image(`card${value}`, `assets/img/card${value}.png`)
        }
    }

    create() {
        this.createBackground()
        this.createCards()
        this.start()
    }

    start(){
        this.openedCard = undefined
        this.openedCardCount = 0
        this.initCards()
    }

    initCards(){
        let positions = this.getCardsPositions()

        this.cards.forEach(card => {
            let position = positions.pop()
            card.close()
            card.setPosition(position.x, position.y)
        })
    }

    createBackground(){
        this.add.sprite(0, 0, "bg").setOrigin(0)
    }

    createCards(){
        this.cards = []

        for (let value of config.cards) {
            for (let i = 0; i < 2; i++) {
                this.cards.push(new Card(this, value))
            }
        }

        this.input.on("gameobjectdown", this.onCardClicked, this)
    }

    onCardClicked(pointer, card){
        if (card.opened) return;

        if (this.openedCard) {
            // есть открытая карта
            if (this.openedCard.value === card.value) {
                // одинаковые карты
                this.openedCard = null
                this.openedCardCount += 1
            } else {
                // неодинаковые карты
                this.openedCard.close()
                this.openedCard = card
            }
        } else {
            // нет открытой карты
            this.openedCard = card
        }

        card.open()

        if (this.openedCardCount === this.cards.length / 2) {
            this.start()
        }
    }

    getCardsPositions() {
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
                    x: (width + offset) * colIndex + leftOffset + width / 2,
                    y: (height + offset) * rowIndex + topOffset + height / 2
                })
            }
        }

        return Phaser.Utils.Array.Shuffle(positions)
    }
}

export default GameScene