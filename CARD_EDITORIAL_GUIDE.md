# Guide éditorial des cartes

Ce document est la source de vérité pour ajouter ou modifier des cartes.

## Principe général

La difficulté mesure la **probabilité que plusieurs joueurs donnent spontanément exactement la même réponse**, pas la difficulté scolaire de la question.

Toute carte doit être :

- compréhensible immédiatement à l’oral ;
- formulée en français naturel ;
- jouable sans explication du lecteur ;
- suffisamment courte ;
- sans fait douteux ni formulation inventée ;
- classée selon sa convergence réelle ;
- supprimée si son intérêt ou sa formulation est incertain.

## 1 mouton — forte convergence

Objectif : une réponse très dominante.

Formats adaptés : faits élémentaires sans ambiguïté, usages quotidiens très évidents, associations culturelles extrêmement connues, complétions simples.

Exemples de style :

- `Une poule pond des ___`
- `La capitale de la France : ___`
- `Pour couper du papier, on utilise des ___`

À éviter : catégories avec beaucoup de réponses également probables, opinions, estimations.

## 2 moutons — convergence moyenne

Objectif : plusieurs réponses sont plausibles, mais quelques réponses viennent naturellement en premier.

Formats adaptés : habitudes quotidiennes, associations, situations courantes, préférences assez consensuelles.

Exemples de style :

- `Une excuse classique pour être en retard : ___`
- `Un animal qui fait peur à beaucoup de gens : ___`
- `Une chose qu’on oublie souvent en vacances : ___`

À éviter : question quasi certaine (à descendre en 1) ou totalement subjective (à monter en 3).

## 3 moutons — faible convergence

Objectif : provoquer une vraie divergence entre les joueurs.

Formats adaptés : opinions, estimations chiffrées, dilemmes, jugements, associations larges, questions sur les joueurs autour de la table.

Exemples de style :

- `À partir de quel âge est-on vieux ? ___ ans`
- `Le film le plus surcoté : ___`
- `Qui ici survivrait le plus longtemps dans Koh-Lanta ?`

## Éclair — règle stricte

Une Éclair n’est **jamais un quiz ni une question ouverte**.

Chaque item est une **amorce déjà existante à compléter** : expression figée, proverbe, duo connu, titre très connu ou formule populaire. Le mot ou groupe de mots manquant doit venir naturellement.

Exemples de style :

- `Laurel et ___`
- `Un cheveu sur la ___`
- `Du soleil et des ___`
- `Les blagues de ___`
- `Tu me cherches, tu me ___`
- `Un gars, une ___`

Interdits en Éclair :

- `La capitale de l’Italie : ___`
- `La planète aux anneaux : ___`
- `Un animal qui vole : ___`
- `Si je dis « chien » : ___`
- toute formulation inventée pour donner l’impression d’une expression ;
- toute phrase dont plusieurs fins sont aussi naturelles les unes que les autres.

## Processus avant ajout

1. Lire la carte à voix haute.
2. Vérifier qu’elle sonne comme du français naturel.
3. Pour les faits, ne conserver que ceux dont la formulation est fiable et non ambiguë.
4. Estimer la convergence et choisir 1, 2 ou 3 moutons.
5. Pour une Éclair, vérifier qu’il s’agit réellement d’une amorce figée et non d’un quiz déguisé.
6. En cas de doute : ne pas ajouter la carte.
7. Exécuter `node validate-cards.mjs` avant de pousser.
