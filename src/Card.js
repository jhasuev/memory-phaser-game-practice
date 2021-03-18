class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, "card");
        this.scene = scene
        this.value = value
        this.scene.add.existing(this)
        this.setInteractive()
        this.opened = false
    }

    flip(){
        let params = {
            targets: this,
            ease: "Linear",
            duration: 150,
        }
        let texture = "card" + (this.opened ? this.value : '')

        this.scene.tweens.add({
            ...params,
            scaleX: 0,
            onComplete: () => {
                this.setTexture(texture)
                this.scene.tweens.add({ ...params, scaleX: 1 })
            },
        })
    }

    open() {
        this.opened = true
        this.flip()
    }

    close() {
        if (this.opened) {
            this.opened = false
            this.flip()
        }
    }
}

export default Card