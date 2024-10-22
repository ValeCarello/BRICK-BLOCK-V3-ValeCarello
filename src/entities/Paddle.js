export class Paddle extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color, alpha) {
      super(scene, x, y, width, height, color, alpha);
  
      // this en este contexto es la instancia de la clase Paleta
      scene.add.existing(this);
  
      // agregar fisica
      scene.physics.add.existing(this);
  
      //hacer la paleta inamovible
      this.body.immovable = true;
  
      //hacer que la paleta no se salga de los limites del mundo
      this.body.setCollideWorldBounds(true);
  
      //agregar cursor
      this.cursor = scene.input.keyboard.createCursorKeys();
      
      //reconocimiento del mouse
      this.pointer = scene.input.activePointer;
    }
  
    update() {
      this.x = this.pointer.x;
      if (this.cursor.left.isDown) {
        this.body.setVelocityX(-300);
      } else if (this.cursor.right.isDown) {
        this.body.setVelocityX(300);
      } else {
        this.body.setVelocityX(0);
      }
    }
  }