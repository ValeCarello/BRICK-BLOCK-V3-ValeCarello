
import { Brick } from "./Brick";

export class WallBrick extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);
        this.createWall();
    }

    createWall() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 4; j++) {
                const isBallCreator = Phaser.Math.Between(0, 10) > 7;
                const isBoomCreator = Phaser.Math.Between(0, 10) > 5;
                const brick = new Brick(
                    this.scene, 
                    60 + i * 90, 
                    50 + j * 55, 
                    60, 
                    20, 
                    0x3498, 
                    1, 
                    isBallCreator, 
                    isBoomCreator
                );
                this.add(brick);
            }
        }
    }
}
