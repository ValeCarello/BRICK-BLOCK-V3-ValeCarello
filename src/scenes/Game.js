import { Scene } from "phaser";
import { Paddle } from "../entities/Paddle";
import { Ball } from "../entities/Ball"; 
import { Brick } from "../entities/Brick";
import { WallBrick } from "../entities/WallBrick";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    init(data) {
        this.score = data.score || 0; 
        this.initialBallSpeed = data.initialBallSpeed || 300; 
    }

    create() {
        this.balls = this.add.group().add(new GameBall(this, 400, 300, 10, 0x3498, 1, this.initialBallSpeed)); // Cambiado a GameBall
        this.paddle = new Paddle(this, 200, 650, 200, 20, 0x3498, 1);
        this.wall = new WallBrick(this);
        this.bombs = this.add.group();

        this.setColliders();
        this.createScoreText();
        this.handleWorldBounds();
    }

    setColliders() {
        this.physics.add.collider(this.paddle, this.balls);
        this.physics.add.collider(this.balls, this.wall, this.onBallHitBrick, null, this);
        this.physics.add.collider(this.paddle, this.bombs, this.onPaddleHitBoom, null, this);
    }

    createScoreText() {
        this.scoreText = this.add.text(100, 630, `${this.score}`);
    }

    onBallHitBrick(ball, brick) {
        brick.hit();
        this.incrementScore();

        if (brick.isBallCreator && this.balls.getChildren().length <= 4) {
            this.balls.add(new GameBall(this, ball.x, ball.y, 10, 0x3498, 1, this.initialBallSpeed)); // Cambiado a GameBall
            brick.isBallCreator = false;
        }

        if (brick.isBoomCreator) {
            this.createBoom(ball.x, ball.y);
        }

        if (this.wall.getChildren().every(b => b.destroyed)) {
            this.restartScene();
        }
    }

    onPaddleHitBoom(paddle, boom) {
        this.scene.start("GameOver");
        boom.destroy();
    }

    createBoom(x, y) {
        const boom = this.add.circle(x, y, 15, 0xff5733);
        this.physics.add.existing(boom);
        boom.body.setVelocity(0, 300);
        this.bombs.add(boom);
    }

    restartScene() {
        this.initialBallSpeed *= 1.1; 
        this.scene.restart({ score: this.score, initialBallSpeed: this.initialBallSpeed });
    }

    handleWorldBounds() {
        this.physics.world.on("worldbounds", (body, _, down) => {
            if (down) {
                body.gameObject.destroy();
                if (this.balls.getChildren().length === 0) this.scene.start("GameOver");
            }
        });
    }

    incrementScore() {
        this.score++;
        this.scoreText.setText(`${this.score}`);
    }

    update() {
        this.paddle.update();
    }
}

// Cambiamos el nombre de la clase Ball aquí
export class GameBall extends Phaser.GameObjects.Arc {
    constructor(scene, x, y, radius, color, alpha, initialSpeed) {
        super(scene, x, y, radius, 0, 360, false, color, alpha);

        this.newVelocityX = initialSpeed; 
        this.newVelocityY = initialSpeed;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.setBounce(1, 1);
        this.body.setVelocity(this.newVelocityX, this.newVelocityY);

        this.body.onWorldBounds = true;
    }

    increaseSpeed(multiplier) {
        this.newVelocityX *= multiplier;
        this.newVelocityY *= multiplier;
        this.body.setVelocity(this.newVelocityX, this.newVelocityY);
    }
}
