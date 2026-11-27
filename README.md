# RobRun Roulette PRO

Application web progressive (PWA) installable sur iPhone et PC, avec mode hors ligne après le premier chargement.

## Lancer en local
Un service worker et l'installation PWA nécessitent `localhost` ou un hébergement HTTPS.
- Ouvrir un terminal dans ce dossier.
- Lancer `python3 -m http.server 8000`
- Visiter `http://localhost:8000`

## Publier pour iPhone et PC
Publier **tout le contenu** de ce dossier sur un hébergement HTTPS (par exemple GitHub Pages, Netlify ou un hébergement web classique). Ne pas ouvrir `index.html` directement depuis les fichiers : le service worker ne fonctionnerait pas.

### Installer sur iPhone
1. Ouvrir l'adresse HTTPS dans Safari.
2. Toucher Partager.
3. Choisir « Sur l’écran d’accueil » puis Ajouter.

### Installer sur PC
Dans Chrome ou Edge, ouvrir le site HTTPS et utiliser l'option Installer cette application (icône dans la barre d'adresse ou menu).

## Données
L'historique et le solde de départ sont enregistrés dans le stockage local du navigateur de l'appareil. Ils ne sont pas synchronisés entre iPhone et PC. Exporter régulièrement le CSV pour garder une copie.

## Paiements
Le programme utilise les paiements classiques d'une roulette européenne : plein 35:1 (36x mise totale), cheval 17:1, transversale 11:1, carré 8:1, sixain 5:1, douzaine/colonne 2:1 et chances simples 1:1. Vérifier les règles réelles du mini-jeu RobRun avant de miser. Les statistiques ne prédisent pas les résultats futurs.
