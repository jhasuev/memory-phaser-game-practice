class Card extends Phaser.GameObjects.Sprite {
    constructor(scene, value) {
        super(scene, 0, 0, "card");
        this.scene = scene
        this.value = value
        this.scene.add.existing(this)
        this.setInteractive()
        this.opened = false
    }

    flip(texture){
        let params = {
            targets: this,
            ease: "Linear",
            duration: 150,
        }

        this.scene.tweens.add({
            ...params,
            scaleX: 0,
            onComplete: () => {
                this.setTexture(texture)
                this.scene.tweens.add({ ...params, scaleX: 1 })
            },
        })
    }

    open(){
        this.flip("card" + this.value)
        this.opened = true
    }

    close(){
        this.flip("card")
        this.opened = false
    }
}

export default Card