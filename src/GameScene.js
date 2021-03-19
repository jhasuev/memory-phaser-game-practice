import config from "./Config";
import Card from "./Card"

class GameScene extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.image("bg", "assets/img/background.png")
        this.load.image("card", "assets/img/card.png")

        this.load.image("card1", "assets/img/card1.png")
        this.load.image("card2", "assets/img/card2.png")
        this.load.image("card3", "assets/img/card3.png")
        this.load.image("card4", "assets/img/card4.png")
        this.load.image("card5", "assets/img/card5.png")

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
        this.level = 0
        this.scores = 0
        this.scoresWave = 0

        this.createSounds()
        this.createTimer()
        this.createBackground()
        this.createText()
        this.start()
    }

    addScores() {
        this.scores += config.scores[this.scoresWave]
        this.scoresWave += 1
        this.scoresWave = Math.min(this.scoresWave, config.scores.length - 1)
    }

    getCurrentLevel() {
        return config.levels[this.level]
    }

    getLevelCards() {
        return this.getCurrentLevel().cards
    }

    getLevelRow() {
        return this.getCurrentLevel().row
    }

    getLevelCol() {
        return this.getCurrentLevel().col
    }

    getLevelTimeout() {
        return this.getCurrentLevel().timeout
    }

    start() {
        this.createCards()
        this.initCardsPositions()
        this.openedCard = undefined
        this.openedCardCount = 0
        this.timeout = this.getLevelTimeout()
        this.timer.paused = false
        this.initCards()
        this.showCards()
    }

    restart() {
        let count = 0
        const onCardMoveComplete = () => {
            if (++count >= this.cards.length) {
                this.start()
            }
        }

        this.cards.forEach(card => {
            card.move({
                x: config.width + card.width,
                y: config.height + card.height,
                delay: card.position.delay,
                callback: onCardMoveComplete
            })
        })
    }

    initCards(){
        let positions = Phaser.Utils.Array.Shuffle(this.positions)

        this.cards.forEach(card => {
            card.init(positions.pop())
        })
    }

    showCards() {
        this.cards.forEach(card => {
            card.depth = card.position.delay
            card.move({
                x: card.position.x,
                y: card.position.y,
                delay: card.position.delay
            })
        })
    }

    createTimer(){
        this.timer = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.onTimerTick,
            callbackScope: this,
        })
    }

    updateInfo() {
        let info = [
            `Time: ${this.timeout}`,
            `Level: ${this.level + 1}`,
            `Scores: ${this.scores}`,
        ]


        this.infoText.setText(info.join("\n"))
    }

    onTimerTick(){
        this.updateInfo()
        
        if (this.timeout <= 0) {
            this.timer.paused = true
            this.sounds.timeout.play()
            this.restart()
        } else {
            this.timeout--
        }
    }

    createBackground(){
        this.add.sprite(0, 0, "bg").setOrigin(0)
    }

    createText() {
        this.infoText = this.add.text(10, 297, "", {
            font: "36px CurseCasual",
            fill: "#fff",
        })

        this.infoText.depth = 99999
    }

    createCards(){
        this.cards = []

        for (let value of this.getLevelCards()) {
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
                this.addScores()
                this.updateInfo()
            } else {
                // неодинаковые карты
                this.openedCard.close()
                this.openedCard = card
                this.sounds.card.play()
                this.scoresWave = 0
            }
        } else {
            // нет открытой карты
            this.openedCard = card
            this.sounds.card.play()
        }

        card.open(() => {
            if (this.openedCardCount === this.cards.length / 2) {
                this.onComplete()
            }
        })
    }

    onComplete() {
        this.level += 1
        this.level = Math.min(this.level, config.levels.length - 1)

        this.sounds.complete.play()
        this.restart()
    }

    initCardsPositions() {
        const positions = []

        const {width, height} = this.textures.get("card").getSourceImage()
        const offset = 10
        const row = this.getLevelRow()
        const col = this.getLevelCol()
        const cardsWidth = (width + offset) * col - offset
        const cardsHeight = (height + offset) * row - offset
        const leftOffset = (this.sys.game.config.width - cardsWidth) / 2
        const topOffset = (this.sys.game.config.height - cardsHeight) / 2
        
        let id = 0
        for (let rowIndex = 0; rowIndex < row; rowIndex++) {
            for (let colIndex = 0; colIndex < col; colIndex++) {
                positions.push({
                    delay: ++id * 100,
                    x: (width + offset) * colIndex + leftOffset + width / 2,
                    y: (height + offset) * rowIndex + topOffset + height / 2
                })
            }
        }

        this.positions = positions
    }
}

export default GameScene