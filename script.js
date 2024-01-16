// Actions lorsqu'une touche du clavier est pressée
function removeRectKeyPressed() {
  // On fait disparaître le rectangle
  fadeRectangle();
  // On enlève l'EV équivalent sur le gamepad
  window.removeEventListener('gamepadconnected', gamePadConnected);
}

// Ajout du message relatif au gamepad
function addGamepadMsg() {
  document.getElementById('fullscreen-rect').innerHTML += "<p style='font-size: 14px;'>Manette détectée, appuyez sur X pour commencer</p>"
}

// Action pour, de façon répétée, vérifier si le bouton X [0] est pressé
// Repris en partie de StackOverflow, cf sources_ref
function removeRectGpPressed(e) {
    let gp = navigator.getGamepads()[e.gamepad.index];
    // Fonction à exécuter en continu pour saisir l'appui sur la touche
    let intervalID = setInterval(function() {
      if (gp.buttons[0].pressed) {
          // If the button is pressed, clear the interval
          clearInterval(intervalID);
          // On fait disparaître le rectangle
          fadeRectangle();
          // On enlève l'EV équivalent sur le clavier
          document.removeEventListener('keydown', removeRectKeyPressed);
      };
    }, 100)
}

// Actions lors de la connexion du gamepad
function gamePadConnected(e) {
  console.log("Gamepad connected");
  addGamepadMsg();
  removeRectGpPressed(e);
}

/* Fonction pour affichage du décompte et disparition du message d'accueil
Cette fonction a été améliorée avec l'aide de ChatGPT à l'aide du prompt suivant
I want that instead of instantly fading, there is a countdown of 5 seconds (shown on screen)
before it starts fading*/
function fadeRectangle() {
  let countdown = 5;
  let countdownDisplay = document.createElement('p');
  countdownDisplay.id = 'countdown';
  countdownDisplay.innerText = 'Début dans ' + countdown + ' secondes';
  let rect = document.getElementById('fullscreen-rect');
  rect.appendChild(countdownDisplay);

  let countdownInterval = setInterval(function() {
      countdown--;
      if(countdown == 3) {
        document.getElementById('alarm-clock-ent').components.sound.playSound()
        countdownDisplay.innerText = 'Début dans ' + countdown + ' secondes';
      } else if (countdown == 1) {
        countdownDisplay.innerText = 'Début dans ' + countdown + ' seconde';
      } else if (countdown <= 0) {
          clearInterval(countdownInterval);
          // Start fading
          rect.style.opacity = '0';
          setTimeout(function() {
              rect.remove();
          }, 1500);
      } else {
        countdownDisplay.innerText = 'Début dans ' + countdown + ' secondes';
      }
  }, 1000);

}

// Ajouter les deux EL aux évènements respectifs
document.addEventListener('keydown', removeRectKeyPressed, {once: true});
window.addEventListener("gamepadconnected", gamePadConnected);


// Ajout des lumières du taxiway
function addTaxywayLights() {
  // Sélection de la scène
  let sceneEl = document.querySelector('a-scene');
  // Boucle sur la longueur plus ou moins visible du taxiway
  for (let i = -27; i <= 20; i += 5) {
    // Ajout du cylindre
    let cyl = document.createElement('a-cylinder');
    cyl.setAttribute('position', `${i} 0.01 -14.35`);
    cyl.setAttribute('radius', '0.08');
    cyl.setAttribute('height', '0.15');
    cyl.setAttribute('rotation', '90 0 0');
    cyl.setAttribute('material', 'color: green');
    sceneEl.appendChild(cyl);

    // Ajout de la lumière juste au-dessus
    let pointLight = document.createElement('a-light');
    pointLight.setAttribute('type', 'point');
    pointLight.setAttribute('angle', '45');
    pointLight.setAttribute('position', `${i} 0.2 -14.35`);
    pointLight.setAttribute('color', 'green');
    pointLight.setAttribute('intensity', '1');
    pointLight.setAttribute('distance', '1');
    pointLight.setAttribute('decay', '0.1');
    sceneEl.appendChild(pointLight);
  } 
}
        

/* Pour gagner un peu de temps de chargement, on attend que le contenu soit chargé
avant d'ajouter le modèle de l'avion à la scène (en dehors du champ de vision) 
Adapté de la génération par ChatGPT pour le prompt 'In A-Frame, using javascript, write a function
using the loaded event so that a model is added to the scene only when loaded' */
document.addEventListener('DOMContentLoaded', function() {
  addTaxywayLights();

  document.querySelector('#piper-plane').addEventListener('loaded', function () {
    // On sélectionne la scène et on créé un objet
    var sceneEl = document.querySelector('a-scene');
    var modelEl = document.createElement('a-obj-model');

    // Définition des attributs
    modelEl.setAttribute('id', 'plane-model');
    modelEl.setAttribute('src', '#piper-plane');
    modelEl.setAttribute('mtl', '#piper-plane-material');
    modelEl.setAttribute('position', '50 -0.3 -15');
    modelEl.setAttribute('scale', '1 1 1');
    // Pencher légèrement le modèle pour que la roue arrière "touche" le sol
    modelEl.setAttribute('rotation', '-12 -90 0');

    // Ajouter l'élément (avec ses attributs définis) à la scène
    sceneEl.appendChild(modelEl);
  });
});

// Fonction de déplacement de l'avion
function movePlaneAlongX(deltaX, negative = true) {
  // Récupérer le modèle de l'avion
  let plane = document.getElementById('plane-model');

  // Récupérer la position initiale
  let position = plane.getAttribute('position');

  // Augmenter ou diminuer la position d'une unité
  if (negative) {
    position.x -= deltaX;
  } else {
    position.x += deltaX;
  }

  if (position.x < -150) {
    console.log("HEHO");
  }

  // Changer la position avec les nouvelles coordonnées
  plane.setAttribute('position', position);
}

// Pour tester dans la console
// setInterval(movePlaneAlongX, 50, 1)

// Clignotement des néons

// Déclenchement aléatoire sur un des deux ou les deux