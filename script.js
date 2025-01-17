// Actions lorsqu'une touche du clavier est pressée
function removeRectKeyPressed() {
  // On fait disparaître le rectangle
  fadeRectangle();
  // On enlève l'EV équivalent sur le gamepad
  window.removeEventListener('gamepadconnected', gamePadConnected);
}

// Ajout du message relatif au gamepad
function addGamepadMsg() {
  document.getElementById('infos').style.fontSize = '16px';
  document.getElementById('infos').innerHTML = "Manette détectée, attendre la fin du chargement et appuyez sur X pour commencer";
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
  }, 50)
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
      flickerSVGobjectives();
    } else if (countdown <= 0) {
        clearInterval(countdownInterval);
        // Déclencher les éléments de mise en place pendant le fading
        rect.style.opacity = '0';
        startTime = Date.now();
        getUp();
        // Évite de jouer le son si l'Interval par sur un clignotement long
        randomNeonFlickering(noSound=true);
        setTimeout(randomPlaneTaxiing, 10000);
        setTimeout(function() {
          rect.style.zIndex = -1000;
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
function addTaxiwayLights() {
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

addTaxiwayLights();

// Déplace l'avion donné sur une distance, tous les tps millisecondes
function movePlane(dist, tps, planeId = 'plane-model') {
  // Récupérer le modèle de l'avion
  let plane = document.getElementById(planeId);
  let ogPosition = Object.assign({}, plane.getAttribute('position'));
  // Récupérer le son de l'avion
  let propSound = plane.children[0];
  propSound.components.sound.playSound();

  let deplIntvl = setInterval(function() {
    // Bouger l'avion de x dist
    let xPos = movePlaneAlongX(dist, true, planeId);
    // Quand il arrive dans le brouillard, on le repositionne
    if (xPos <= -55) {
      // Arrêt de la boucle intervalle, du son et réinitialisation
      clearInterval(deplIntvl);
      setTimeout(propSound.components.sound.stopSound(), 2000);
      setTimeout(plane.setAttribute('position', ogPosition), 2000);
    }
  }, tps);
}

// Fonction de déplacement de l'avion
function movePlaneAlongX(deltaX, negative = true, planeId = 'plane-model') {
  // Récupérer le modèle de l'avion
  let plane = document.getElementById(planeId);
  // Récupérer la position initiale
  let position = plane.getAttribute('position');
  // Augmenter ou diminuer la position d'une unité
  if (negative) {
    position.x -= deltaX;
  } else {
    position.x += deltaX;
  }
  // Changer la position avec les nouvelles coordonnées
  plane.setAttribute('position', position);
  return(position.x)
}

// Pour tester dans la console
// movePlane(1, 50)

/* Passage aléatoire de l'avion, comme pour le néon, la fonction a
été en partie générée grâce à ChatGPT, prompt How can I have a function
get called repeatedly in a range of time ? */
function randomPlaneTaxiing() {
  movePlane(0.5, 50);
  let nextDelay = Math.random() * (90000 - 60000) + 60000;
  setTimeout(randomPlaneTaxiing, nextDelay);
}

// Jouer le son du néon
function playNeonSound() {
  document.getElementById('neon-sound-ent').components.sound.playSound()
}

// Arrêter le son du néon
function stopNeonSound() {
  document.getElementById('neon-sound-ent').components.sound.stopSound()
}

// Clignotement du néon
function flickerNeonLight(noSound = false) {
  // Récupérer la lumière et son intensité
  let neon = document.getElementById('neon-light');
  let intensiteDepart = neon.getAttribute('light').intensity;
  // Clignoter entre 1 et 3 fois
  let flicker = Math.ceil(Math.random() * 3);
  let soundPlayed = false; // Indicateur pour contrôler la lecture du son

  // Clignotement tout les 200ms
  let countdownInterval = setInterval(function() {
    // Si "long" clignotement et le son n'a pas encore été joué
    if (flicker > 1 && !soundPlayed && !noSound) {
      playNeonSound();
      soundPlayed = true; // Marquer que le son a été joué
    }
    flicker--;
    neon.setAttribute('light', 'intensity', 0);

    setTimeout(function() {
      /* Mettre la condition dans le setTimeout, sinon l'intensité est 
      divisée par 2 après avoir été réinitialisée >.< */
      neon.setAttribute('light', 'intensity', intensiteDepart/2);
      // Vérifier si c'est le dernier clignotement
      if (flicker <= 0) {
        neon.setAttribute('light', 'intensity', intensiteDepart);
        // Arrêter le son seulement après tous les clignotements
        if (soundPlayed) {
          stopNeonSound();
        }
        clearInterval(countdownInterval);
      }
    }, 100);
  }, 200);
}

// Déclenchement aléatoire sur un des deux ou les deux
function randomNeonFlickering(noSound = false) {
  flickerNeonLight(noSound);
  let nextDelay = Math.random() * (80000 - 40000) + 40000;
  setTimeout(randomNeonFlickering, nextDelay);
}

// Animation de se lever au début
function getUp() {
  let rig = document.getElementById('rig');
  // Reset si bougé pendant l'écran noir
  rig.setAttribute('position', {x:0.5, y:1.25, z:2.3})
  // Ajout de l'animation au rig
  let anim = 'property: position; to: 0.1 1.75 2.2; dur: 1100; easing: linear;';
  rig.setAttribute('animation', anim);
}

// Composante objet de "quête" récupérables
AFRAME.registerComponent('quest-item', {
  schema: {
    type: {type: 'string'}
  },

  init: function () {
    let el = this.el;
    let typeObj = this.data.type

    // On compare la position (sans la hauteur) entre le rig et l'objet
    // en dessous d'un certain seuil, on peut "prendre" l'objet
    this.getObject = function () {
      let rigPos = document.getElementById('rig').getAttribute('position');
      let objPos = el.getAttribute('position')
      let successSound = document.getElementById('success-sound-ent')

      // Si suffisamment proche de l'objet
      if (meanAbsDiffAxis(rigPos, objPos, 'x', 'z') < 1.1) {
        // Jouer le son de la victoire
        successSound.components.sound.playSound()
        // Augmenter le son de 0.05
        successSound.components.sound.data.volume += 0.05
        // Colorer le SVG
        changeSvgElement(typeObj);
        // Ajustement des objectifs (baguette ajustée dans la fonction dessus)
        if (typeObj == "casque") {
          objectives.casque = true;
          // Étouffer les sons vu que le casque est porté
          muffleSound();
        } else if (typeObj == "veste") {
          objectives.veste = true;
        }
        // Enlever l'objet de la scène
        el.remove();
  
        let allObjectives = Object.values(objectives).every(value => value === true);
        // Changer le cadre de la porte en blanc, miroir des SVG
        if (allObjectives) {
          let cadres = document.getElementsByClassName('cadre');
          for (let cadre of cadres) {
            cadre.setAttribute('material', 'color: white');
          }
        }
      }
    }
    this.el.addEventListener('click', this.getObject);
  },
  tick: function () {
    // Actuellement, il n'y a pas de vérification de l'élément cliqué et de sa distance.
    // Possible de récupérer trois objets d'un coup.
    /* Choix en partie généré par ChatGPT car je n'arrivais pas à éviter l'erreur
    s'il n'y avait pas de gamepad */
    let gamepad = navigator.getGamepads ? navigator.getGamepads()[0] : null;

    // S'il y a un gamepad et que le bouton principale est appuyé
    if (gamepad && gamepad.buttons[0].pressed) {
      this.getObject();
    }
  },
  remove: function () {
    this.el.removeEventListener('click', this.getObject);
  }
})

// Calcul de la différence moyenne absolue entre 2 positions
function meanAbsDiffAxis(obj1, obj2, axis1, axis2) {
  let diffAxis1 = Math.abs(obj1[axis1] - obj2[axis1]);
  let diffAxis2 = Math.abs(obj1[axis2] - obj2[axis2]);

  return (diffAxis1 + diffAxis2) / 2;
}


// Composante porte ouvrable
AFRAME.registerComponent('openable', {
  init: function() {
    let el = this.el;
    // Fonction d'ouverture de porte / fin du jeu
    this.finishGame = function () {
      let allObjectives = Object.values(objectives).every(value => value === true);
      let rigPos = document.getElementById('rig').getAttribute('position');
      let objPos = el.getAttribute('position')
      let finalSuccessSound = document.getElementById('final-success-sound-ent')
      let rect = document.getElementById('fullscreen-rect');
      // Être proche de la porte et avoir rempli les objectifs
      if (allObjectives && meanAbsDiffAxis(rigPos, objPos, 'x', 'z') > 1.4) {
        let endTime = Date.now();
        displayElapsedTime(startTime, endTime, 'fullscreen-rect');
        // Ouvrir la poignée
        rotateElement('#handle-pivot', { x: 15, y: 0, z: 0 }, 250);
        // Son victoire
        finalSuccessSound.components.sound.playSound();
        // Remettre le fond devant
        rect.style.zIndex = 1200;
        setTimeout(function() {
          rect.style.transition = "opacity 5s ease-in-out";
        }, 500);
        rect.style.opacity = '1';
        // Ouvrir la porte
        setTimeout(rotateElement, 200, '#door-pivot', { x: 0, y: 45, z: 0 }, 2000)
      }
    }
    this.el.addEventListener('click', this.finishGame);
  },
  // Actuellement si cette partie est activée, le jeu se termine au 4ème élément...
  // tick: function () {
  //   /* Choix en partie généré par ChatGPT car je n'arrivais pas à éviter l'erreur
  //   s'il n'y avait pas de gamepad */
  //   let gamepad = navigator.getGamepads ? navigator.getGamepads()[0] : null;

  //   // S'il y a un gamepad et que le bouton principale est appuyé
  //   if (gamepad && gamepad.buttons[0].pressed) {
  //     this.finishGame();
  //   }
  // },
  remove: function () {
      this.el.removeEventListener('click', this.finishGame);
    }
})

// Effectuer une rotation sur un axe
function rotateElement(id, finalPosition, duration) {
  document.querySelector(id).setAttribute('animation', {
    property: 'rotation',
    to: finalPosition,
    dur: duration,
    easing: 'easeInOutQuad'
  });
}

// Diminution du volume des sons d'ambiance
function muffleSound() {
  // Récupérer tous les sons
  let soundEls = document.querySelectorAll('[sound]');
  // On diminue le volume des sons par deux
  soundEls.forEach(function(el) {
    // Seulement les sons d'ambiance
    if (! el.classList.contains('success')) {
      let currentVolume = el.components.sound.data.volume;
      el.setAttribute('sound', 'volume', currentVolume/2);
    }
  });
}

// Modifier le fill des SVG pour qu'ils soient blancs/verts brillants pour "atteint/récupéré"
function changeSvgElement(objectif) {
  let svgVeste = document.getElementById('svg_veste');
  let svgBagGauche = document.getElementById('svg_bag_gauche');
  let svgBagDroite = document.getElementById('svg_bag_droite');
  let svgCasque = document.getElementById('svg_casque');

  if (objectif === 'baguette') {
    // On ne remplit la baguette de droite qui si celle de gauche est déjà "colorée"
    if (svgBagGauche.getAttribute('fill') == 'url(#barGradientWhiteBottom)') {
      svgBagDroite.setAttribute('fill', 'url(#barGradientWhiteBottom)');
      objectives.baguettes = true;
    } else {
      svgBagGauche.setAttribute('fill', 'url(#barGradientWhiteBottom)');
    }
  } else if (objectif === 'casque') {
    svgCasque.style.fill = svgCasque.style.fill == 'white' ? 'black' : 'white';
  } else {
    svgVeste.style.fill = svgVeste.style.fill == 'white' ? 'black' : 'white';
  }
}

// Alterner le fill des SVG du noir au blanc et vice versa
function turnObjOnOff(elId, isBaguette) {
  let element = document.getElementById(elId);
  if (isBaguette) {
    let currentFill = element.getAttribute('fill');
    let newFill = currentFill == 'url(#barGradient)' ? 'url(#barGradientWhiteBottom)' : 'url(#barGradient)';
    element.setAttribute('fill', newFill);
  } else {
    let currentFill = element.style.fill;
    let newFill = currentFill == 'white' ? 'black' : 'white';
    element.style.fill = newFill;
  }
}

// Faire clignoter les objectifs pour attirer l'attention dessus
function flickerSVGobjectives() {
  let flicker = 21; // Impair pour finir éteint
  let intervalId = setInterval(() => {
    // "Allumer/éteindre" les SVG
    turnObjOnOff('svg_veste', false);
    turnObjOnOff('svg_bag_gauche', true);
    turnObjOnOff('svg_bag_droite', true);
    turnObjOnOff('svg_casque', false);

    flicker--;
    if (flicker <= 0) {
      // Le casque et la veste commencent alternés, il faut les rétablir en noir au dernier clignotement
      changeSvgElement('casque');
      changeSvgElement('veste');
      clearInterval(intervalId);
    }
  }, 250);
}

// Sauvegarder la progression des objectifs
let objectives = {
  veste: false,
  baguettes: false,
  casque: false
}

/* Les fonctions ci-dessous ont été générées par ChatGPT (et modifiées) en réponse au prompt
Display the elapsed time between two function calls in a human readable format*/
// Function to format time in a human-readable format
function formatTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  return `${minutes} minutes et ${seconds} seconds`;
}

// Function to display elapsed time
function displayElapsedTime(startTime, endTime, elementId) {
  let elapsedTime = endTime - startTime;
  let formattedTime = formatTime(elapsedTime);
  document.getElementById(elementId).innerHTML = `<p>Bravo! <br><br> Terminé en ${formattedTime}</p>`;
}

// Temps du début de la scène
let startTime;

// Composante bonus
AFRAME.registerComponent('easter-egg', {
  init: function () {
    let el = this.el;
    let typeObj = this.data.type

    // On compare la position (sans la hauteur) entre le rig et l'objet
    // en dessous d'un certain seuil, on peut "prendre" l'objet
    this.launchAF1 = function () {
      let rigPos = document.getElementById('rig').getAttribute('position');
      let objPos = el.getAttribute('position')

      // Si suffisamment proche de l'objet
      if (meanAbsDiffAxis(rigPos, objPos, 'x', 'z') < 1.5) {
        movePlane(1, 75, "af1-ent")
      }
    }
    this.el.addEventListener('click', this.launchAF1);
  },
  tick: function () {
    // Actuellement, il n'y a pas de vérification de l'élément cliqué et de sa distance.
    // Possible de récupérer trois objets d'un coup.
    /* Choix en partie généré par ChatGPT car je n'arrivais pas à éviter l'erreur
    s'il n'y avait pas de gamepad */
    let gamepad = navigator.getGamepads ? navigator.getGamepads()[0] : null;

    // S'il y a un gamepad et que le bouton principale est appuyé
    if (gamepad && gamepad.buttons[0].pressed) {
      this.launchAF1();
    }
  },
  remove: function () {
    this.el.removeEventListener('click', this.launchAF1);
  }
})