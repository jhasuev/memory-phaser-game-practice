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

        this.load.audio("card", "assets/sounds/card.mp3")
        this.load.audio("complete", "assets/sounds/complete.mp3")
        this.load.audio("success", "assets/sounds/success.mp3")
        this.load.audio("theme", "assets/sounds/theme.mp3")
        this.load.audio("timeout", "assets/sounds/timeout.mp3")
    }

    createSounds() {
        this.sounds = {
            "card": this.sound.add("card"),
            "complete": this.sound.add("complete"),
            "success": this.sound.add("success"),
            "theme": this.sound.add("theme"),
            "timeout": this.sound.add("timeout"),
        }

        this.sounds.theme.play({
            volume: .1
        })
    }

    create() {
        this.createSounds()
        this.createTimer()
        this.createBackground()
        this.createText()
        this.createCards()
        this.start()
    }

    start(){
        this.openedCard = undefined
        this.openedCardCount = 0
        this.timeout = config.timeout
        this.initCards()
    }

    initCards(){
        let positions = this.getCardsPositions()

        this.cards.forEach(card => {
            let position = positions.pop()
            card.close()
            this.time.addEvent({
                delay: 400,
                callback: () => {
                    card.setPosition(position.x, position.y)
                },
            })
        })
    }

    createTimer(){
        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.onTimerTick,
            callbackScope: this,
        })
    }

    onTimerTick(){
        this.textTimer.setText(`Time: ${this.timeout}`)
        
        if (this.timeout <= 0) {
            this.sounds.timeout.play()
            this.start()
        } else {
            this.timeout--
        }
    }

    createBackground(){
        this.add.sprite(0, 0, "bg").setOrigin(0)
    }

    createText() {
        this.textTimer = this.add.text(10, 330, "", {
            font: "36px CurseCasual",
            fill: "#fff",
        })
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
                this.sounds.success.play()
            } else {
                // неодинаковые карты
                this.openedCard.close()
                this.openedCard = card
                this.sounds.card.play()
            }
        } else {
            // нет открытой карты
            this.openedCard = card
            this.sounds.card.play()
        }

        card.open()

        if (this.openedCardCount === this.cards.length / 2) {
            this.sounds.complete.play()
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