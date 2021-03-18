class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, "card");
        this.scene = scene
        this.value = value
        this.setOrigin(0)
        this.scene.add.existing(this)
        this.setInteractive()
        this.opened = false
    }

    open(){
        this.setTexture("card" + this.value)
        this.opened = true
    }

    close(){
        this.setTexture("card")
        this.opened = false
    }
}

export default Card