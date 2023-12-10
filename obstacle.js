class Obstacle {
  constructor(x, y, r, texture) {
    this.pos = createVector(x, y);
    this.r = r;
    this.texture = texture; // Texture de l'obstacle
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.01); // Rotation facultative

    // Dessiner la texture sur un cercle
    if (this.texture) {
      imageMode(CENTER);
      image(this.texture, 0, 0, this.r * 2, this.r * 2);
    }

    pop();
  }
}
