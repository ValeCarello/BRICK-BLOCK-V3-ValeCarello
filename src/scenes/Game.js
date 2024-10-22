import { Scene } from "phaser";

// import class entitities
import { Paddle } from "../entities/Paddle";
import { Ball } from "../entities/Ball";
import { Brick } from "../entities/Brick";
import { WallBrick } from "../entities/WallBrick";

export class Game extends Scene {
  constructor() {
    super("Game");
  }
  init(){
    this.score=0;
  };

  create() {
    
    this.balls= this.add.group();
    this.balls.add(new Ball(this, 400, 300, 10, 0x3498, 1));

    this.paddle = new Paddle(this, 200, 650, 200, 20, 0x3498, 1);
    this.wall = new WallBrick(this);

    this.bombs = this.add.group();
  
   // colisiones
    this.physics.add.collider(this.paddle, this.balls);

      this.physics.add.collider(
        this.balls,
        this.wall,
        (ball, brick) => {
          brick.hit();
          this.puntaje();
          if (brick.isBallCreator && this.balls.getChildren().length<=4) {
            const newBall = new Ball(this, ball.x, ball.y, 10, 0x3498, 1);
            this.balls.add(newBall);

            brick.isBallCreator= false;
          } 
          if(brick.isBoomCreator) {
            
            // Crear el círculo de la bomba
            const boom = this.add.circle(ball.x, ball.y, 15, 0xff5733); // Color rojo para la bomba

            // Añadir físicas al círculo
            this.physics.add.existing(boom);

            // Acceder al cuerpo de físicas de la bomba
            boom.body.setVelocity(0, 300); // Establecer velocidad (y=300 para que baje)

            // Agregar la bomba al grupo de bombas
            this.bombs.add(boom);

            console.log("bomba creada");
          }
          // Verificar si todos los bloques han sido destruidos
          if (this.wall.getChildren().every(brick => brick.destroyed)) {
            
            ball.increaseSpeed(1.1); // Incrementa la velocidad en un 10%
            this.velocidadX = ball.newVelocityX;
            this.velocidadY = ball.newVelocityY;
            this.scene.restart({ newVelocityX: this.velocidadX, newVelocityY: this.velocidadY }); // Reinicia la escena
            console.log (ball.newVelocityX);
            console.log (ball.newVelocityY);
        }
      
        
      },
        null,
        this
      );
    
    this.scoreTextgame = this.add.text(550, 630,`0`)
    this.physics.add.collider(this.paddle, this.bombs, (paddle, boom) => {
      this.scene.start("GameOver"); // Termina el juego
      boom.destroy(); // Destruye la bomba
    }, null, this);
   
    //colision de la pelota con el limite inferior
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      console.log("worldbounds");
      if (down ) {
        body.gameObject.destroy();
        console.log("hit bottom");
        if(this.balls.getChildren().length===0   ){
          this.scene.start("GameOver");
        } 
      }
    });  
  };
  

  puntaje(){
   this.score ++;
   this.scoreTextgame.setText(`${this.score}`);
  };


  update() {
     
    this.paddle.update();
  }
}