let pursuer1, pursuer2;
let hp = 100; // Initialise les points de vie à 100
let target;
let obstacles = [];
let vehicules = [];
let vehicle;
let lasers = []; // Tableau global pour stocker les lasers
let cibles = [];
let demo = "snake";
let enemyVehicles = [];
let imgVaisseau;
let showAlert = false;
let showReinforcements = false;
let formationChanged = false;
let badGuysTexture; // Déclarer la variable pour stocker la texture des véhicules ennemis
function preload() {
  console.log("preload");
  imgVaisseau = loadImage("assets/images/vaisseau.png");
  asteroidTexture = loadImage("assets/images/asteroid.png");
  badGuysTexture = loadImage("assets/images/badguys.png"); // Charger la texture des véhicules ennemis
}

function setup() {
  console.log("setup");
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100, imgVaisseau);
  pursuer2 = new Vehicle(random(width), random(height), imgVaisseau);

  vehicules.push(pursuer1);
  vehicules.push(pursuer2);

  // Créer un obstacle avec texture à une position aléatoire
  obstacles.push(
    new Obstacle(random(width), random(height), 100, asteroidTexture)
  );

  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
}

function draw() {
  // Changer le dernier paramètre (< 100) pour l'effet de trainée
  background(0);

  // Afficher le nombre d'ennemis restants en bas à gauche
  fill("red"); // Couleur du texte en rouge
  textSize(20); // Taille du texte
  textAlign(LEFT, BOTTOM); // Alignement du texte à gauche et en bas
  text(`Nombre d'ennemis : ${enemyVehicles.length}`, 20, height - 20);

  // Vérifier la collision avec chaque obstacle pour chaque véhicule ennemi
  for (let i = 0; i < enemyVehicles.length; i++) {
    for (let j = 0; j < obstacles.length; j++) {
      enemyVehicles[i].collision(obstacles[j]);
    }
  }

  // Dessiner un cercle rouge à la position du curseur
  fill(255, 0, 0);
  noStroke();
  circle(mouseX, mouseY, 30);

  // Dessiner et mettre à jour les lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];
    laser.update();
    laser.show();
    // Supprimer les lasers qui sortent de l'écran pour économiser des ressources
    if (
      laser.pos.x > width ||
      laser.pos.x < 0 ||
      laser.pos.y > height ||
      laser.pos.y < 0
    ) {
      lasers.splice(i, 1);
    }
  }
  // Afficher le niveau en bas à droite
  fill(255); // Couleur du texte en blanc
  textSize(18); // Taille du texte
  textAlign(RIGHT, BOTTOM); // Alignement du texte à droite et en bas
  text("Niveau : trés tres tres debutant", width - 20, height - 20); // Texte pour le niveau

  // Détection de la collision entre les lasers et les ennemis
  for (let i = lasers.length - 1; i >= 0; i--) {
    const laser = lasers[i];

    // Vérifier chaque ennemi pour la collision
    for (let j = enemyVehicles.length - 1; j >= 0; j--) {
      const enemy = enemyVehicles[j];

      // Vérifier si le laser touche l'ennemi
      if (laser.hits(enemy)) {
        // Supprimer le laser et l'ennemi touché
        lasers.splice(i, 1);
        enemyVehicles.splice(j, 1);
      }
    }
  }

  // Afficher les étoiles
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    stroke(255);
    point(x, y);
  }

  // Position initiale du premier texte
  let textY = 30;
  const textSpacing = 20; // Espacement vertical entre chaque ligne de texte

  // Afficher les instructions sur le canvas
  displayInstruction("v : Ajouter un véhicule");
  textY += textSpacing;
  displayInstruction("d : Activer/désactiver le mode débogage");
  textY += textSpacing;
  displayInstruction("w : Générer des ennemis");
  textY += textSpacing;
  displayInstruction("Clic droit : Ajouter un astéroïde");
  textY += textSpacing;
  displayInstruction("f : Pour appeler les renforts");
  textY += textSpacing;
  displayInstruction("T : Tirer (Que si les ennemies sont générés)");
  textY += textSpacing;
  displayInstruction("L : formation sérpent");
  textY += textSpacing;

  // Fonction pour afficher les instructions
  function displayInstruction(instruction) {
    fill(255); // Couleur du texte
    textSize(20); // Taille du texte
    textAlign(LEFT, CENTER); // Alignement du texte
    text(instruction, 20, textY); // Affichage du texte à la position spécifiée
  }

  target = createVector(mouseX, mouseY);

  if (showReinforcements) {
    fill(0, 0, 255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Renforts en approche !", width / 2, height - 50);
  }
  if (formationChanged) {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Formation changée !", width / 2, height - 30);
    setTimeout(() => {
      formationChanged = false;
    }, 2000); // Efface le message après 2 secondes
  }

  if (showAlert) {
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Attention ! Des ennemis arrivent !", width / 2, height - 50);
  }

  // Dessiner tous les obstacles
  obstacles.forEach((o) => {
    o.show();
  });
  switch (demo) {
    case "snake":
      vehicules.forEach((vehicle, index) => {
        let forceArrive;
        vehicle.poidsSeparation = 0;

        if (index == 0) {
          // C'est le 1er véhicule, il suit la cible/souris
          forceArrive = vehicle.applyBehaviors(target, obstacles, vehicules, 0);
        } else {
          // les véhicules suivants suivent le véhicule précédent
          let vehiculePrecedent = vehicules[index - 1];

          forceArrive = vehicle.applyBehaviors(
            vehiculePrecedent.pos,
            obstacles,
            vehicules,
            40
          );
        }

        vehicle.update();
        vehicle.show();
      });
      break;
  }
  // Dessiner tous les véhicules ennemis existants
  for (let i = 0; i < enemyVehicles.length; i++) {
    enemyVehicles[i].update();
    enemyVehicles[i].show();
  }
  // Dans la fonction draw, après la mise à jour et l'affichage des véhicules suivants

  for (let i = 1; i < vehicules.length; i++) {
    let follower = vehicules[i];
    for (let j = enemyVehicles.length - 1; j >= 0; j--) {
      let enemy = enemyVehicles[j];
      let d = dist(follower.pos.x, follower.pos.y, enemy.pos.x, enemy.pos.y);
      if (d < 20) {
        // Si la distance entre le véhicule suiveur et l'ennemi est inférieure à une certaine valeur
        // Supprimer l'ennemi et mettre à jour le tableau des ennemis
        enemyVehicles.splice(j, 1);
      }
    }
  }
  // Dessiner la barre de vie en haut à droite
  let barWidth = 200; // Largeur totale de la barre de vie
  let barHeight = 20; // Hauteur de la barre de vie
  let padding = 10; // Marge entre la barre de vie et les bords de l'écran

  // Position du coin supérieur droit de la barre de vie
  let barX = width - barWidth - padding;
  let barY = padding;

  // Dessiner le contour de la barre de vie
  noFill();
  stroke(255);
  rect(barX, barY, barWidth, barHeight);

  // Dessiner la barre de vie en fonction des points de vie (HP)
  fill(0, 255, 0); // Couleur verte pour représenter la santé
  let hpWidth = map(hp, 0, 100, 0, barWidth); // Calculer la largeur en fonction des points de vie
  rect(barX, barY, hpWidth, barHeight);
}
function mousePressed() {
  // Ajouter un obstacle à la position du clic de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, 100, asteroidTexture)); // 100 est le rayon de l'obstacle, vous pouvez ajuster la taille selon vos besoins
}

function keyPressed() {
  // quand on clique sur la lettre v il nous ajoute une seule vehicule.
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height), imgVaisseau));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }
  if (key == "l") {
    formationChanged = true;
    // Calculer les positions pour la formation de serpent
    for (let i = 0; i < vehicules.length; i++) {
      let spacing = 40; // Espacement entre les véhicules
      let yOffset = height / 2; // Hauteur de la formation

      // Répartir les véhicules horizontalement avec un espacement entre eux
      let x = width / 4 + i * spacing;

      // Appliquer une position verticale pour créer la formation de serpent
      let y = yOffset + sin(i * 0.5) * 100;

      vehicules[i].target = createVector(x, y); // Mettre à jour la cible du véhicule
    }
  }

  //quand on clique sur la lettre f il nous ajoute plusieur vehicules.
  if (key == "f") {
    showReinforcements = true;
    setTimeout(() => {
      showReinforcements = false;
    }, 3000);
    // Je cree 100 vehicules qui partent du bord gauche de l'écran
    // et qui vont vers la cible/souris
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(random(width), random(height), imgVaisseau);
      v.maxSpeed = 10;
      v.color = "purple";
      vehicules.push(v);
    }
  }
  // Si la touche "w" est pressée
  if (key === "w" || key === "W") {
    showAlert = true;
    setTimeout(() => {
      showAlert = false;
    }, 3000); // Affiche l'alerte pendant 3 secondes

    // Générer un nouveau VehicleEnnemy avec la texture spécifique
    let newEnemy = new VehicleEnnemy(random(width), random(height));
    newEnemy.texture = badGuysTexture; // Assigner la texture aux véhicules ennemis
    enemyVehicles.push(newEnemy); // Ajouter le nouvel ennemi au tableau
  }
  console.log("Key pressed:", key);
  if (key === "T" || key === "t") {
    console.log("T key pressed");
    // Créer un laser pour chaque véhicule vers les véhicules ennemis
    for (let i = 0; i < vehicules.length; i++) {
      let vehicle = vehicules[i];
      if (enemyVehicles.length > 0) {
        // Créer un laser vers le premier ennemi pour chaque véhicule
        let enemy = enemyVehicles[0];
        let laser = new Laser(vehicle.pos.x, vehicle.pos.y, enemy.pos);
        lasers.push(laser);
      }
    }
  }
}
