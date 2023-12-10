class Laser {
  constructor(x, y, target) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.sub(target, createVector(x, y)).setMag(5); // Vitesse du laser
    this.r = 4; // Rayon du laser
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
  // Méthode pour vérifier si le laser touche un ennemi
  hits(enemy) {
    const d = dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y);
    return d < enemy.r / 2; // Adapter cette condition en fonction de la forme et de la taille de l'ennemi
  }
}
