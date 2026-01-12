# UrbanFlow - ZTM Gdańsk Tracker 🚌

Aplikacja webowa do śledzenia opóźnień komunikacji miejskiej ZTM Gdańsk. Umożliwia użytkownikom tworzenie spersonalizowanych list ulubionych przystanków i monitorowanie ich w czasie rzeczywistym.

## 📋 Spis treści

- [Funkcjonalności](#-funkcjonalności)
- [Technologie](#-technologie)
- [Architektura](#-architektura)
- [Wymagania](#-wymagania)
- [Instalacja](#-instalacja)
- [Uruchomienie](#-uruchomienie)
- [API Documentation](#-api-documentation)
- [Testowanie](#-testowanie)
- [Struktura projektu](#-struktura-projektu)
- [Konto testowe](#-konto-testowe)

## ✨ Funkcjonalności

### Autentykacja
- ✅ Rejestracja nowych użytkowników z walidacją
- ✅ Logowanie z JWT token
- ✅ Ochrona tras (navigation guards)
- ✅ Automatyczne wylogowanie po wygaśnięciu tokenu

### Zarządzanie przystankami
- ✅ Wyszukiwanie przystanków ZTM
- ✅ Dodawanie/usuwanie przystanków do listy
- ✅ Personalizowany dashboard z kartami przystanków
- ✅ Podgląd opóźnień w czasie rzeczywistym
- ✅ Auto-odświeżanie danych (co 30 sekund)

### Mapa
- ✅ Interaktywna mapa OpenStreetMap z Leaflet
- ✅ Wyróżnione ulubione przystanki
- ✅ Dodawanie przystanków bezpośrednio z mapy
- ✅ Popup z informacjami o przystanku

### Szczegóły przystanku
- ✅ Tabela wszystkich odjazdów
- ✅ Kolorowe oznaczenia opóźnień
- ✅ Mapa z lokalizacją przystanku
- ✅ Możliwość dodania/usunięcia z listy

## 🛠 Technologie

### Backend
| Technologia | Wersja | Opis |
|------------|--------|------|
| Node.js | 20+ | Runtime JavaScript |
| Express.js | 4.x | Framework webowy |
| TypeScript | 5.x | Typowany JavaScript |
| SQLite | 3.x | Baza danych |
| Sequelize | 6.x | ORM |
| JWT | - | Autentykacja |
| Swagger | - | Dokumentacja API |

### Frontend
| Technologia | Wersja | Opis |
|------------|--------|------|
| Vue.js | 3.x | Framework UI |
| Vite | 5.x | Build tool |
| TypeScript | 5.x | Typowany JavaScript |
| Pinia | 2.x | State management |
| Vue Router | 4.x | Routing |
| Tailwind CSS | 3.x | Stylowanie |
| Leaflet | 1.x | Mapy |
| Axios | 1.x | HTTP client |

### Testowanie
| Technologia | Opis |
|------------|------|
| Vitest | Testy jednostkowe |
| Vue Test Utils | Testy komponentów |
| Cypress | Testy E2E |

### DevOps
| Technologia | Opis |
|------------|------|
| Docker | Konteneryzacja |
| Docker Compose | Orkiestracja |

## 🏗 Architektura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │────▶│    Backend      │────▶│    SQLite DB    │
│   (Vue + Vite)  │     │   (Express)     │     │                 │
│    Port: 5173   │     │   Port: 3000    │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 │ (Cache 24h)
                                 ▼
                        ┌─────────────────┐
                        │                 │
                        │   ZTM Gdańsk    │
                        │   Open API      │
                        │                 │
                        └─────────────────┘
```

### Value Objects Pattern
Projekt wykorzystuje wzorzec Value Objects do walidacji danych domenowych:
- `Email` - walidacja adresu email
- `Username` - walidacja nazwy użytkownika
- `Password` / `HashedPassword` - walidacja i hashowanie haseł
- `StopId` - walidacja identyfikatora przystanku
- `StopName` - walidacja nazwy przystanku

## 📦 Wymagania

- Docker & Docker Compose
- lub:
  - Node.js 20+
  - npm 10+

## 🚀 Instalacja

### Docker (zalecane)

```bash
# Klonowanie repozytorium
git clone <repo-url>
cd UrbanFlow

# Uruchomienie z Docker Compose
docker-compose up --build
```

### Manualne

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (nowy terminal)
cd frontend
npm install
npm run dev
```

## ▶️ Uruchomienie

### Z Docker Compose

```bash
docker-compose up
```

Aplikacja będzie dostępna:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs

### Bez Dockera

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Seed bazy danych (testowy użytkownik)

```bash
cd backend
npm run seed
```

## 📚 API Documentation

API jest udokumentowane za pomocą Swagger/OpenAPI.

Po uruchomieniu backendu, dokumentacja dostępna pod:
**http://localhost:3000/api-docs**

### Główne endpointy

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/auth/register` | Rejestracja |
| POST | `/api/auth/login` | Logowanie |
| GET | `/api/auth/me` | Dane użytkownika |
| GET | `/api/stops` | Lista przystanków |
| GET | `/api/stops/search` | Wyszukiwanie przystanków |
| GET | `/api/stops/:id` | Szczegóły przystanku |
| GET | `/api/user-stops` | Przystanki użytkownika |
| POST | `/api/user-stops` | Dodaj przystanek |
| DELETE | `/api/user-stops/:id` | Usuń przystanek |
| GET | `/api/delays/:stopId` | Opóźnienia dla przystanku |

## 🧪 Testowanie

### Testy jednostkowe (Vitest)

```bash
cd frontend

# Uruchom testy
npm run test

# Uruchom z coverage
npm run test:coverage

# Tryb watch
npm run test:watch
```

### Testy E2E (Cypress)

```bash
cd frontend

# Interaktywny tryb
npm run cypress:open

# Headless
npm run cypress:run
```

**Uwaga**: Przed uruchomieniem testów E2E upewnij się, że aplikacja jest uruchomiona!

## 📁 Struktura projektu

```
UrbanFlow/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts              # Entry point
│       ├── config/
│       │   └── database.ts       # Sequelize config
│       ├── middleware/
│       │   └── auth.middleware.ts
│       ├── models/
│       │   ├── User.ts
│       │   └── UserStop.ts
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── stops.routes.ts
│       │   ├── user-stops.routes.ts
│       │   └── delays.routes.ts
│       ├── services/
│       │   ├── stops-cache.service.ts
│       │   └── delays.service.ts
│       ├── seeders/
│       │   └── seed.ts
│       └── value-objects/
│           ├── Email.ts
│           ├── Username.ts
│           ├── Password.ts
│           ├── HashedPassword.ts
│           ├── StopId.ts
│           └── StopName.ts
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── cypress.config.ts
    ├── index.html
    └── src/
        ├── main.ts
        ├── App.vue
        ├── assets/
        │   └── main.css
        ├── components/
        │   ├── common/           # BaseButton, BaseInput, BaseModal
        │   ├── layout/           # AppLayout, NavBar
        │   ├── stops/            # StopCard, StopList, DelayTable
        │   └── map/              # StopMap
        ├── composables/
        │   ├── useFetch.ts
        │   └── useDelays.ts
        ├── directives/
        │   └── focus.ts
        ├── plugins/
        │   └── formatters.ts
        ├── router/
        │   └── index.ts
        ├── stores/
        │   ├── auth.ts
        │   └── userStops.ts
        ├── views/
        │   ├── LoginView.vue
        │   ├── RegisterView.vue
        │   ├── DashboardView.vue
        │   ├── MapView.vue
        │   ├── StopDetailsView.vue
        │   └── NotFoundView.vue
        ├── __tests__/            # Vitest tests
        └── cypress/              # E2E tests
```

## 👤 Konto testowe

Po uruchomieniu seedera dostępne jest konto testowe:

| Pole | Wartość |
|------|---------|
| Email | `test@urbanflow.pl` |
| Hasło | `Test123!` |

Konto ma już dodanych 5 przykładowych przystanków:
- Miszewskiego
- Brama Wyżynna
- Dworzec Główny
- Politechnika
- Oliwa PKP

## 📄 Licencja

MIT License - szczegóły w pliku [LICENSE](LICENSE)

## 👨‍💻 Autor

Projekt stworzony jako laboratorium z przedmiotu Programowanie Interfejsów Webowych 2024/2025.

---

**UrbanFlow** - Śledź komunikację miejską w Trójmieście! 🚌🚋
