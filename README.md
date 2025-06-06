# 🎯 FocusField+

**FocusField+** è un'applicazione web e mobile progettata per aiutare l’utente a entrare nello stato mentale ideale per svolgere un’attività, partendo da come si sente. L'app propone una combinazione personalizzata di musica, respirazione, journaling, ambiente e contenuti spirituali per guidare ogni sessione.

🌐 <a href="https://www.focusfield.it" target="_blank"><strong>Demo online</strong></a>  
🔗 <a href="https://github.com/capurrot/focusField_be" target="_blank"><strong>Backend GitHub</strong></a>

## 🌟 Funzionalità principali

- **OpenAI API** per selezionare il mood in base alla sensazione dell'utente espressa in un campo stringa
- Selezione del mood (es. Calmo, Energico, Ansioso, Creativo, ecc.)
- Percorso guidato personalizzato per ogni stato d’animo
- Suggerimenti di musica ambientale o playlist ispirazionali
- Esercizi di respirazione e rilassamento fisico animati
- Diario pre e post sessione (con cifratura AES opzionale)
- Modalità spirituale con contenuti ispirati a valori profondi
- Tracciamento delle sessioni e statistiche utente
- Traduzioni in più lingue (🇮🇹 🇬🇧 🇫🇷 🇪🇸 🇩🇪)

## 📱 Tecnologie utilizzate

### Frontend

- React + Vite
- Redux + Redux Persist
- Bootstrap + FullCalendar
- i18next per la localizzazione
- AES-GCM Web Crypto API
- **OpenAI API** (Ricerca del mood in base all'input dell'utente)
- **Cloudinary API** (Hosting immagini e video)

### Backend

- Spring Boot (Java)
- PostgreSQL
- JWT Authentication
- API RESTful
