class VehicleEnnemy {
  static debug = false;

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.r = 16;
    this.texture = texture; // Texture du véhicule ennemi
    // Pour comportement arrive
    this.rayonZoneDeFreinage = 100;

    // pour comportement wander
    this.wanderTheta = 0;
    this.wanderRadius = 50;
    this.displaceRange = 0.3;
    this.distanceCercleWander = 100;

    this.path = [];
    this.nbMaxPointsChemin = 40;
  }

  wander() {
    // point devant le véhicule
    let wanderPoint = this.vel.copy();
    wanderPoint.setMag(this.distanceCercleWander);
    wanderPoint.add(this.pos);

    if (VehicleEnnemy.debug) {
      // on le dessine sous la forme d'une petit cercle rouge
      fill(255, 0, 0);
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 8);

      // Cercle autour du point
      noFill();
      stroke(255);
      circle(wanderPoint.x, wanderPoint.y, this.wanderRadius * 2);

      // on dessine une ligne qui relie le vaisseau à ce point
      // c'est la ligne blanche en face du vaisseau
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
    }
    // On va s'occuper de calculer le point vert SUR LE CERCLE
    // il fait un angle wanderTheta avec le centre du cercle
    // l'angle final par rapport à l'axe des X c'est l'angle du vaisseau
    // + cet angle
    let theta = this.wanderTheta + this.vel.heading();

    let x = this.wanderRadius * cos(theta);
    let y = this.wanderRadius * sin(theta);

    // maintenant wanderPoint c'est un point sur le cercle
    wanderPoint.add(x, y);

    if (VehicleEnnemy.debug) {
      // on le dessine sous la forme d'un cercle vert
      fill("green");
      noStroke();
      circle(wanderPoint.x, wanderPoint.y, 16);

      // on dessine le vecteur desiredSpeed qui va du vaisseau au point vert
      stroke("yellow");
      line(this.pos.x, this.pos.y, wanderPoint.x, wanderPoint.y);
    }
    // On a donc la vitesse désirée que l'on cherche qui est le vecteur
    // allant du vaisseau au cercle vert. On le calcule :
    // ci-dessous, steer c'est la desiredSpeed directement !
    let desiredSpeed = wanderPoint.sub(this.pos);

    // Ce que dit Craig Reynolds, c'est que uniquement pour ce
    // comportement, la force à appliquer au véhicule est
    // desiredSpeed et pas desiredSpeed - vitesse actuelle !
    let force = desiredSpeed;

    force.setMag(this.maxForce);
    this.applyForce(force);

    // On déplace le point vert sur le cerlcle (en radians)
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
  }
  collision(obstacle) {
    // Vérifier la collision avec l'obstacle
    let distance = p5.Vector.dist(this.pos, obstacle.pos);
    if (distance < this.r + obstacle.r) {
      // Il y a une collision, réagir en conséquence
      // Par exemple, changer la direction, la vitesse, etc.
      // Ici, nous allons simplement inverser la direction de vélocité

      // Inverser la vélocité (c'est un exemple, ajustez selon votre logique)
      this.vel.mult(-1);
    }
  }

  /* Poursuite d'un point devant la target !
      cette methode renvoie la force à appliquer au véhicule
   */
  pursue(target, evade = false) {
    // TODO
    // 1 - calcul de la position future de la cible
    // on fait une copie de la position de la target
    // 2 - On calcule un vecteur colinéaire au vecteur vitesse de la cible,
    let prediction = target.vel.copy();
    // et on le multiplie par 10 (10 frames)
    // 3 - prediction dans 10 frames = 10 fois la longueur du vecteur

    // target.distancePrediction varie en fonction de
    // la distance entre le véhicule et la cible
    // plus la cible est loin, plus on prédit loin

    prediction.mult(target.distancePrediction);
    // 4 - on positionne de la target au bout de ce vecteur
    prediction.add(target.pos);

    console.log("target distance prediction", target.distancePrediction);
    // dessin du vecteur prediction
    let v = p5.Vector.sub(prediction, target.pos);
    this.drawVector(target.pos, v);

    // 2 - dessin d'un cercle vert de rayon 20 pour voir ce point
    fill("green");
    circle(prediction.x, prediction.y, 20);

    // 3 - appel à seek avec ce point comme cible
    let force = this.seek(prediction, evade);

    // n'oubliez pas, on renvoie la force à appliquer au véhicule !
    return force;
  }

  /* inverse de pursue
     cette methode renvoie la force à appliquer au véhicule
  */
  evade(target) {
    let evade = true;
    return this.pursue(target, evade);
  }

  arrive(target, distanceVisee = 0) {
    // 2nd argument true enables the arrival behavior
    return this.seek(target, true, distanceVisee);
  }

  flee(target) {
    // recopier code de flee de l'exemple précédent
  }

  seek(target, arrival = false, distanceVisee = 0) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      // On définit un rayon de 100 pixels autour de la cible
      // si la distance entre le véhicule courant et la cible
      // est inférieure à ce rayon, on ralentit le véhicule
      // desiredSpeed devient inversement proportionnelle à la distance
      // si la distance est petite, force = grande
      // Vous pourrez utiliser la fonction P5
      // distance = map(valeur, valeurMin, valeurMax, nouvelleValeurMin, nouvelleValeurMax)
      // qui prend une valeur entre valeurMin et valeurMax et la transforme en une valeur
      // entre nouvelleValeurMin et nouvelleValeurMax
      r;
      // TODO !
      // Approche expérimentale
      // on ajuste le rayon en fonction de la vitesse du véhicule
      //console.log(this.vel.mag());
      this.rayonZoneDeFreinage = this.vel.mag() * 30;

      // 1 - dessiner le cercle de rayon 50 autour du vehicule
      if (VehicleEnnemy.debug) {
        stroke("white");
        noFill();
        circle(this.pos.x, this.pos.y, this.rayonZoneDeFreinage);
      }

      // 2 - calcul de la distance entre la cible et le vehicule
      let distance = p5.Vector.dist(this.pos, target);

      // 3 - si distance < rayon du cercle, alors on modifie desiredSPeed
      // qui devient inversement proportionnelle à la distance.
      // si d = rayon alors desiredSpeed = maxSpeed
      // si d = 0 alors desiredSpeed = 0
      desiredSpeed = map(
        distance,
        distanceVisee,
        this.rayonZoneDeFreinage + distanceVisee,
        0,
        this.maxSpeed
      );
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.wander(); // Appeler la fonction wander à chaque mise à jour du véhicule
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.edges();
    this.path.push(this.pos.copy());
    if (this.path.length > this.nbMaxPointsChemin) {
      this.path.shift();
    }
  }

  show() {
    // dessin du vaisseau ennemi avec texture
    if (this.texture) {
      imageMode(CENTER);
      image(this.texture, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    } else {
      // dessin par défaut si la texture n'est pas définie
      stroke(255);
      strokeWeight(2);
      fill(255);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
      pop();
    }
  }

  edges() {
    let d = 20; // Marge pour éviter que le véhicule ne rebondisse trop près du bord

    if (this.pos.x > width - this.r - d) {
      this.vel.x *= -1; // Inverser la vélocité en X
      this.pos.x = width - this.r - d; // Ajuster la position pour éviter le débordement
    } else if (this.pos.x < this.r + d) {
      this.vel.x *= -1;
      this.pos.x = this.r + d;
    }

    if (this.pos.y > height - this.r - d) {
      this.vel.y *= -1; // Inverser la vélocité en Y
      this.pos.y = height - this.r - d; // Ajuster la position pour éviter le débordement
    } else if (this.pos.y < this.r + d) {
      this.vel.y *= -1;
      this.pos.y = this.r + d;
    }
  }
}
