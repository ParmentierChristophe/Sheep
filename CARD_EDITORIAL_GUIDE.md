# Guide éditorial des cartes

Ce document est la source de vérité pour ajouter ou modifier des cartes.

## Principe général : on calibre la convergence, pas la connaissance

Le jeu n'est pas un quiz. La difficulté mesure la **probabilité que plusieurs joueurs donnent spontanément exactement la même réponse**.

Une bonne carte normale doit donc laisser une vraie possibilité de divergence. Si une question n'a pratiquement qu'une seule bonne réponse (`Le sport où l'on marque des paniers`, `La capitale de la France`, `Une semaine a sept...`), elle est trop déterministe pour une carte normale.

À l'inverse, les Éclairs peuvent être quasi déterministes : leur difficulté vient du fait qu'il faut réussir quatre complétions immédiatement et à la suite.

Toute carte doit être :

- compréhensible immédiatement à l'oral ;
- formulée en français naturel ;
- jouable sans explication du lecteur ;
- assez courte pour être lue vite ;
- sans fait douteux ni formulation inventée ;
- intéressante même quand les joueurs échouent à se synchroniser ;
- classée selon le nombre et la force des réponses plausibles ;
- supprimée si son intérêt, son sens ou sa formulation est incertain.

## 1 mouton — faible entropie, mais divergence réelle

Objectif : **forte probabilité de match sans réponse imposée**.

On vise généralement :

- un choix binaire ou quasi binaire ;
- 2 à 5 réponses naturelles avec une ou deux réponses dominantes ;
- une habitude ou association très commune ;
- une préférence assez consensuelle ;
- une situation quotidienne avec peu de réflexes possibles.

Exemples de style :

- `France 98 ou France 2018 ?`
- `Faut-il pisser sous la douche ?`
- `Le meilleur jour de la semaine : ___`
- `Un liquide noir : ___`
- `Un truc qu'on oublie souvent en partant : ___`
- `Si je dis « Paris », vous dites : ___`

### Interdit en 1 mouton

Les questions dont la réponse est essentiellement imposée :

- `Le sport où l'on marque des paniers : ___`
- `La capitale de la France : ___`
- `Une poule pond des ___`
- `Le contraire de chaud : ___`
- `Un triangle a trois ___`

Ces formulations ne testent pas la synchronisation : elles testent seulement si les joueurs connaissent la réponse.

## 2 moutons — entropie moyenne

Objectif : **plusieurs réponses très plausibles, sans réponse dominante évidente**.

On vise généralement :

- 4 à 10 réponses naturelles ;
- une association culturelle ou générationnelle ;
- une estimation raisonnable ;
- une préférence où plusieurs grands classiques s'affrontent ;
- une situation quotidienne avec plusieurs réflexes possibles ;
- une formulation légèrement provocante ou décalée.

Exemples de style :

- `Un synonyme mignon de zizi : ___`
- `C'est tabou : ___`
- `Si je dis « Francis », vous dites : ___`
- `Un film avec Leonardo DiCaprio : ___`
- `Le prix normal d'un kebab : ___ €`
- `Un métier qu'on respecte beaucoup : ___`

Une carte 2 moutons ne doit être ni quasi certaine (elle descendrait en 1), ni totalement ouverte (elle monterait en 3).

## 3 moutons — forte entropie

Objectif : **faire diverger franchement les joueurs** tout en restant compréhensible et amusant.

On vise généralement :

- 10 réponses plausibles ou davantage ;
- une association volontairement large ou bizarre ;
- une estimation chiffrée ;
- un jugement ou une opinion ;
- une référence culturelle moins évidente ;
- une question sur les joueurs autour de la table ;
- un dilemme dont le choix dépend fortement de la personne.

Exemples de style :

- `Une spécialité portugaise : ___`
- `Petit et connu : ___`
- `À Amsterdam, il y a plein de ___`
- `À partir de combien de degrés fait-il froid ? ___ °C`
- `Le film le plus surcoté : ___`
- `Qui ici survivrait le plus longtemps dans Koh-Lanta ?`

## Éclair — complétion stricte

Une Éclair n'est **jamais un quiz ni une question ouverte**.

Chaque item est une **amorce déjà existante à compléter** : expression figée, proverbe, duo connu, titre connu ou formule populaire. Le mot ou groupe de mots manquant doit venir naturellement.

Exemples de style :

- `Laurel et ___`
- `Un cheveu sur la ___`
- `Du soleil et des ___`
- `Les blagues de ___`
- `Tu me cherches, tu me ___`
- `Un gars, une ___`

Interdits en Éclair :

- `La capitale de l'Italie : ___`
- `La planète aux anneaux : ___`
- `Un animal qui vole : ___`
- `Si je dis « chien » : ___`
- toute formulation inventée pour donner l'impression d'une expression ;
- toute phrase dont plusieurs fins sont aussi naturelles les unes que les autres.

## Test éditorial avant ajout

Pour chaque carte normale, imaginer rapidement les **cinq premières réponses plausibles**.

- Si une seule réponse existe réellement : rejeter ou transformer la carte.
- Si 2 à 5 réponses viennent naturellement : candidat 1 mouton.
- Si environ 4 à 10 réponses viennent naturellement : candidat 2 moutons.
- Si les réponses explosent immédiatement en dizaines de possibilités : candidat 3 moutons.

Ce n'est pas une mesure scientifique : c'est un garde-fou éditorial. Le calibrage final se fait en partie réelle.

## Processus avant ajout

1. Lire la carte à voix haute.
2. Vérifier qu'elle sonne comme du français naturel.
3. Vérifier qu'une carte normale n'est pas un quiz à réponse unique.
4. Lister mentalement plusieurs réponses plausibles.
5. Estimer la convergence et choisir 1, 2 ou 3 moutons.
6. Pour une Éclair, vérifier qu'il s'agit réellement d'une amorce figée et non d'un quiz déguisé.
7. Éviter les faits précis inutiles ; s'ils sont nécessaires, les vérifier avant ajout.
8. En cas de doute : ne pas ajouter la carte.
9. Exécuter `node validate-cards.mjs` avant de pousser.
