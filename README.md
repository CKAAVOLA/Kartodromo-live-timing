# Kartodromo Live Timing — GPS provvisorio

Prima base del sistema di cronometraggio senza transponder.

## Cosa fa già
- modalità CONTROLLO e PILOTA;
- collegamento di più telefoni via Socket.IO;
- invio posizione GPS dei telefoni sui kart;
- lista live dei kart collegati;
- avvio/stop sessione;
- struttura per tempi sul giro e classifica;
- immagine della pista caricata come riferimento.

## Importante
Il rilevamento automatico della linea del traguardo è volutamente lasciato alla fase di calibrazione GPS sul posto. L'immagine indica il traguardo, ma per il GPS servono le coordinate reali dei due estremi della linea.

## Avvio
1. Installa Node.js 18+.
2. Apri il terminale nella cartella.
3. Esegui `npm install`.
4. Esegui `npm start`.
5. Apri il sito nel browser.

Per usare il GPS da iPhone/Android in una rete reale, il sito deve essere servito in HTTPS. Per la prova iniziale conviene pubblicarlo su un servizio HTTPS.

## Prossimo passaggio
Calibrare i due estremi della linea rossa con GPS e aggiungere:
- rilevamento attraversamento della linea;
- tempo sul giro;
- anti-doppio rilevamento;
- classifica live;
- storico sessioni;
- pagina pilota;
- autenticazione/QR per associare il telefono al kart.