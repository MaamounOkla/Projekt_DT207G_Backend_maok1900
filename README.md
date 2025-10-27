
# Norra Café – Backend (API)
# Projekt DT207G – Backend-baserad webbutveckling

## Beskrivning
Backend-delen av **Norra Café** fungerar som ett *headless CMS* byggt med **Node.js**, **Express**, och **MongoDB (Atlas)**.  
Systemet hanterar:

- **Autentisering (JWT)** för administratörsinloggning.  
- **CRUD-funktioner** för menyalternativ (skapa, läsa, uppdatera, ta bort).  
- **Filuppladdning** (bilder till `/uploads`).  
- **Publikt API** för frontend-klienter.

---

## Författare
- **Maamoun Okla**

## Senaste uppdatering
- 2025-10-27

## 🌐 Live Demo
[➡️ Norra Café (Live)](https://norra-cafe.netlify.app)
---

## Innehåll
- [Tekniker](#tekniker)
- [Installation](#installation)
- [Miljövariabler](#miljövariabler)
- [Projektstruktur](#projektstruktur)
- [API-ändpunkter](#api-ändpunkter)
- [Autentisering](#autentisering)
- [Exempelanrop](#exempelanrop)
- [Felhantering](#felhantering)
- [Deploy](#deploy)
- [Licens](#licens)

---

## Tekniker
- **Node.js + Express**
- **MongoDB Atlas + Mongoose**
- **jsonwebtoken (JWT)**
- **bcrypt** – lösenordshashning  
- **multer** – filuppladdning  
- **CORS** – tillåter frontend-åtkomst  
- **dotenv** – miljövariabler  

---

## Installation

### Klona repo:
```bash
git clone https://github.com/maamounokla/norra-cafe-backend.git
cd norra-cafe-backend
````

### Installera beroenden:

```bash
npm install
```

### Skapa `.env` i projektroten:

```bash
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/norraCafe
JWT_SECRET_Key=<hemligt_värde>
ADMIN_USER=admin
ADMIN_PASS=dittlösenord
```

### Starta servern lokalt:

```bash
npm run serve
```

Servern körs på:
👉 `http://127.0.0.1:3000`

---

## Projektstruktur

```text
backend/
├─ models/
│  ├─ User.js
│  └─ Menu.js
├─ routes/
│  ├─ auth.js
│  ├─ menu.js
│  └─ messages.js
├─ middleware/
│  └─ auth.js
├─ uploads/                # uppladdade bilder
├─ server.js
├─ package.json
└─ .env
```

---

## API-ändpunkter

| Metod      | Ändpunkt        | Skydd     | Beskrivning                              |
| :--------- | :-------------- | :-------- | :--------------------------------------- |
| **POST**   | `/api/register` | Offentlig | Registrera admin (används bara initialt) |
| **POST**   | `/api/login`    | Offentlig | Logga in och få JWT                      |
| **GET**    | `/api/me`       | Skyddad   | Hämta info om inloggad admin             |
| **GET**    | `/api/menu`     | Offentlig | Hämta alla rätter (grupperas i frontend) |
| **POST**   | `/api/menu`     | Skyddad   | Skapa ny rätt (`multipart/form-data`)    |
| **PUT**    | `/api/menu/:id` | Skyddad   | Uppdatera pris, kategori eller bild      |
| **DELETE** | `/api/menu/:id` | Skyddad   | Ta bort rätt                             |
| **POST**   | `/api/messages` | Offentlig | Spara kontaktformulär-meddelande         |

---

## Autentisering

Autentisering sker med **JWT (JSON Web Token)**.
Efter lyckad inloggning returneras en token:

```json
{
  "message": "Login successful",
  "token": "<jwt-token>"
}
```

Token skickas i varje skyddat anrop via HTTP-header:

```
Authorization: Bearer <jwt-token>
```

Middleware `requireAuth` verifierar token innan CRUD-rutter exekveras.

---

## Exempelanrop (med fetch)

```js
// Skapa ny menyartikel
const formData = new FormData();
formData.append("title", "Falafeltallrik");
formData.append("price", "95");
formData.append("category", "Menyer");
formData.append("description", "Falafel, vitlökssås, hummus, pommes och tomat");
formData.append("image", fileInput.files[0]);

await fetch(`${API}/menu`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData
});
```

---

## Felhantering

API:t returnerar tydliga fel i JSON-format:

```json
{ "error": "Invalid token" }
```

eller

```json
{ "error": "Missing required fields" }
```

Alla valideringar sker både i backend och frontend.

---

## Deploy

### Rekommenderad setup:

* **Backend:** [Render](https://render.com)
* **Frontend:** [Netlify](https://www.netlify.com)

### Tips:

Tillåt frontend-domänen i CORS:

```js
app.use(cors({
  origin: ['https://norra-cafe.netlify.app']
}));
```

Se till att uppladdade bilder mappas statiskt:

```js
app.use('/uploads', express.static('uploads'));
```

Använd miljövariabler i Render-dashboarden.

---

## Licens

© **Norra Café / Maamoun Okla 2025**
All rights reserved.
Endast för utbildningsbruk (DT207G, Miun).

```
```
