export class Brick extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color, alpha, isBallCreator, isBoomCreator) {
        super(scene, x, y, width, height, color, alpha);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);
        this.isBallCreator = isBallCreator;
        this.isBoomCreator = isBoomCreator;
        this.toches = 0;
        this.maxToches = Phaser.Math.Between(1, 4);  // Determina la cantidad de golpes necesarios
    }

    hit() {
        this.toches++;

        // Cambia el color dependiendo de los golpes recibidos
        switch (this.toches) {
            case 1:
                this.setFillStyle(0xe74c3c);
                break;
            case 2:
                this.setFillStyle(0x2ecc71);
                break;
            case 3:
                this.setFillStyle(0x9b59b6);
                break;
        }

        // Asegúrate de que el ladrillo se destruya al alcanzar los golpes máximos
        if (this.toches >= this.maxToches) {
            this.destroy();  // El ladrillo siempre se destruirá si los toques son iguales o mayores a maxToches
        }
    }
}
