# Marshalling prep

### Description

Cette expérience VR nous plonge dans la peau d'un *ground marshaller*, une personne chargée de guider les avions au sol, notamment dans la phase de parking. Après un réveil soudain, il faut rassembler ses affaires avant de pouvoir sortir sur le tarmac pour accomplir sa mission.

#### Déroulé

Au début, un écran noir attend l'utilisateur avec un message sur l'objectif général. Une fois la scène chargée, l'utilisateur peut appuyer sur la touche X ou une touche de son clavier pour démarrer la scène (après un petit décompte).

Pendant le *fade-out*, une sonnerie retentit et le personnage que l'on incarne se lève sur les derniers sons. On se retrouve une pièce avec une grande fenêtre en face de nous (avec un store à lamelles couvrant sa partie supérieure) et une porte sur la gauche. Par la fenêtre, on aperçoit le tarmac d'un aéroport avec une ligne de guidage pour le roulage au sol (*taxiway*). Cette ligne est bordée de guides lumineux, des petites lumières vertes. La ligne se divise sur la gauche avec un virage qui amène derrière le mur de la porte. Parfois, un petit avion passe sur cette ligne et l'on entend le bruit de son moteur.

La pièce est froide et grise, principalement faite de ciment avec une porte en bois. Elle est éclairée par un néon qui a tendance à clignoter et grésiller quelque peu. Le mobilier est sommaire : un bureau, une chaise de bureau, un tabouret, une petite table et un casier contenant une veste jaune fluorescent. Sur la table se trouvent un casque de protection auditive et des baguettes lumineuses servant à guider les avions. Il faut s'emparer du matériel figuré par de petites icônes en haut à droite de l'écran avant d'aller ouvrir la porte pour poursuivre l'aventure...

<img src="/apercu_scene_RVRA_RB.gif">

### Installation / lancement

Pour profiter de cette scène VR, il faut procéder de la façon suivante: 

1. Cloner le repo
2. Connecter un gamepad à son ordinateur (ex. une manette DualShock3 de PS3, mais marche aussi avec la souris).
3. Lancer un serveur local dans le dossier marshalling-prep (à l'aide de l'extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) de Visual Studio Code par ex.)
4. Ouvrir la page web correspondante (localhost:xxxx)
5. Autoriser la lecture de média audio et vidéo, si ce n'est pas déjà fait
6. Réactualiser la page
7. (Facultatif, mais plus agréable) Attendre une petite dizaine de secondes...
8. Profiter de l'expérience (parfois, il est nécessaire de "réveiller" sa manette en appuyant sur un bouton)

### Technologies

Le travail est réalisé à l'aide d'[A-Frame](https://aframe.io/), une librairie destinée au développement 3D/AR/VR pour le web. Les principaux éléments peuvent tous être déclarés en HTML et il est possible d'interagir avec, à l'aide de JavaScript.

### Sources et ressources

Le fichier [sources_ref.md](sources_ref.md) détaille les différents éléments utilisés (*assets*, blogs, tutos, documentation) pendant la conception du travail.

### Contexte de développement

Ce projet a été développé dans le cadre du cours _Réalité virtuelle et augmentée_ dispensé par Isaac Pante (SLI, Lettres, UNIL)

#### Difficultés rencontrées

Pour une première avec de la modélisation 3D web, il y a quelques éléments problématiques qui n'ont pu être réglés (cf. [Issues](https://github.com/Raphbub/marshalling-prep/issues)).

Les différents *assets* audio ont tendance à ne pas charger alors que, malgré leur simplicité, ils donnent du corps à la scène. Le réveil situe un peu l'intrigue et les sons de l'hélice et du néon habillent la scène au niveau du son. (Il paraît tout de même que le bruit fait par l'ordinateur en "rendant" la scène peut faire penser à un avion...) (Il semblerait que ces problèmes n'arrivent pas [tout le temps](https://github.com/Raphbub/marshalling-prep/issues/4).)

Les *assets* 3D sont assez différents les uns des autres et un *downscaling* a été nécessaire sur certains éléments (ex. la veste haute visibilité du vestiaire) qui ralentissaient trop le modèle.

Les interactions avec le curseur ont été plutôt compliquées à saisir et les quelques lumières de la pièce ne sont pas forcément optimalement placées ou orientées.

Finalement, malgré les difficultés et la sobriété du projet, il a permis des apprentissages significatifs du développement de scènes 3D...avec quelques frustrations quand même.

#### Éléments *pour le geste*
Différents éléments sont placés aléatoirement comme les déclenchements et nombre de clignotements du néon et son grésillement. Le passage de l'avion est également déclenché au hasard (à l'exception du premier). En explorant la scène, on peut voir Air Force 1 (en plus petit) dans le brouillard. Dès qu'on a récupéré le casque, les sons d'ambiance sont réduits de moitié ! Le cadre de la porte devient blanc quand les objets ont été ramassés, en miroir des svg en haut à droite.
Petit *easter egg*, si on clique sur la souris posée sur le bureau, Air Force 1 passe devant la fenêtre