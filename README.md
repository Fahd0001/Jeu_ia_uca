# Jeu_ia_uca
Simulation de Véhicules avec Comportements
Ce projet est une simulation simple de véhicules avec des comportements basiques tels que suivre un leader, éviter une zone spécifique et maintenir une distance entre les véhicules mais j'ai aussi ajouter le fait de pouvoir génerer des ennemies et leurs tirer dessus avec des lasers comme dans les jeux arcads.

Fonctionnalités
Chaque véhicule peut interagir avec d'autres véhicules et suivre un leader.
Les véhicules ont des comportements distincts selon leur relation avec le leader.
Les comportements incluent suivre le leader, maintenir une distance avec les autres véhicules.
Les véhicules tentent d'arriver derrière le leader en suivant la souris à la queu le leu.
Ajout de véhicules ennemies qui peuvent etre éliminés en leurs tirant dessus.
Ajout d'obstacle.
(j'ai pas reussi a implémenter la zone d'évitement devant le leader :((( )

Prérequis
P5.js - Une bibliothèque JavaScript pour la création d'arts visuels et interactifs.

Guide d'Utilisation
La simulation démarre avec plusieurs véhicules apparaissant à l'écran.
Le premier véhicule créé est considéré comme le leader.
Le leader suit la position de la souris.

Les autres véhicules ont différents comportements :
Suivre le Leader : Les véhicules tentent de se placer derrière le leader en suivant une cible située derrière lui.
Éviter la Zone Devant le Leader : Les véhicules évitent une zone devant le leader pour éviter toute collision.
Maintenir une Distance : Les véhicules maintiennent une distance minimale avec les autres véhicules pour éviter les regroupements.
Ajustements
Tirer sur des ennemies: en appuyant sur T les véhicules peuvent tirer sur des ennemies qui ont un comportement Wander + collision + rebandire au bord de l'ecran
Les comportements des véhicules peuvent être modifiés en ajustant les valeurs telles que la taille de la zone à éviter, les poids des comportements, etc.
Des nouvelles fonctionnalités peuvent être ajoutées en modifiant les méthodes dans la classe Vehicle dans le fichier script.js.

Tout cela avec l'aide de ChatGPT (il m'a fait n'importe quoi) 
