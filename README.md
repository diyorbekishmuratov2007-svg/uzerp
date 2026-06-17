# UzERP - Zamonaviy ERP/Buxgalteriya Tizimi

**1C:Enterprise alternativasi - O'zbekiston va MDH mamlakatlari uchun**

UzERP - bu zamonaviy texnologiyalar asosida qurilgan to'liq ERP va buxgalteriya tizimi. 54 ta modul, 9 bosqich bo'yicha ishlab chiqilgan.

## Texnologiyalar

| Qatlam | Texnologiya |
|--------|------------|
| Backend | NestJS 10+, TypeScript 5+, Prisma 5+, PostgreSQL 16, Redis 7 |
| Frontend | Next.js 14+, React 18, TypeScript, Tailwind CSS, Shadcn/UI |
| State Management | Zustand, TanStack Query v5 |
| Auth | JWT + Refresh Token, CASL (RBAC), 2FA |
| Infra | Docker Compose, pnpm workspaces, Turbo |
| i18n | O'zbek, Rus, Ingliz tillari |

## Loyiha Strukturasi

```
uzerp/
├── apps/
│   ├── api/                 # NestJS Backend (50+ modullar)
│   │   ├── src/
│   │   │   ├── modules/     # Feature modullar
│   │   │   ├── prisma/      # Prisma service
│   │   │   ├── common/      # Guards, decorators, pipes
│   │   │   ├── main.ts      # Bootstrap (Swagger, CORS)
│   │   │   └── app.module.ts
│   │   └── prisma/
│   │       ├── schema.prisma # 78 model, 60 enum
│   │       └── seed.ts       # Demo data
│   └── web/                 # Next.js 14 Frontend
│       └── src/
│           ├── app/          # App Router pages
│           ├── components/   # UI komponentlar
│           ├── lib/          # API client, utils
│           ├── store/        # Zustand stores
│           └── hooks/        # TanStack Query hooks
├── packages/
│   └── shared/              # Umumiy types, constants
├── docker/                  # Dockerfiles
├── docker-compose.yml       # PostgreSQL, Redis, API, Web
└── package.json             # pnpm workspace root
```

## Modullar (54 ta)

### Bosqich 1: Asosiy Buxgalteriya (MVP)
- Auth (JWT + Refresh Token)
- Users, Organizations
- Accounts (BHMS - Buxgalteriya Hisoblar Metodik Sxemasi)
- Journal (Ikki yoqlama yozuv)
- Transactions, Balance
- Counterparties, Dashboard, Settings
- CASL (Role-based access control)

### Bosqich 2: Soliq va Hisobot
- Tax, VAT (QQS 12%), Profit Tax (Foyda solig'i 15%/20%)
- Didox (Elektron hujjat almashinuvi)
- INPS (Ijtimoiy sug'urta 12%)
- NDFL (Daromad solig'i 12%)
- Soliq.uz integratsiya
- Invoices (Schet-faktura)

### Bosqich 3: Kadrlar va Ish haqi
- Employees, Departments
- Payroll (NDFL + INPS avtomatik)
- Timesheet (Tabel)
- HR Documents (BQ-YYYY-NNNNNN)

### Bosqich 4: Ombor va Savdo
- Products, Warehouse
- Sales (ST-YYYY-NNNNNN), Purchase Orders (KR-YYYY-NNNNNN)
- Raw Materials, Inventory (INV-YYYY-NNNNNN)
- Contracts (SH-YYYY-NNNNNN)
- Receivables/Payables

### Bosqich 5: Bank va To'lovlar
- Bank Statements, Reconciliation
- Payments (Payme, Click, Uzum)
- Payment Calendar
- Cash (PKO/RKO orderlari)

### Bosqich 6: Hisobotlar va Tahlil
- Financial Reports (Balans, Foyda/Zarar)
- Cash Flow (To'g'ridan-to'g'ri/Bilvosita)
- KPI va Tahlil
- Depreciation (Amortizatsiya)
- Consolidation, Currency, Export

### Bosqich 7: Mobil va AI
- Mobile API, Push Notifications
- AI Posting (Avtomatik provodka)
- Cashflow Forecast (Prognoz)
- Fraud Detection

### Bosqich 8: Lokalizatsiya
- Qozog'iston, Qirg'iziston plaginlari
- Localization Framework

### Bosqich 9: Xavfsizlik
- Audit Trail (Hash chain)
- 2FA (TOTP + SMS)
- Session Management
- API Keys

## Ishga tushirish

### Talablar
- Node.js 20+
- pnpm 8+
- Docker va Docker Compose
- PostgreSQL 16 (Docker orqali)
- Redis 7 (Docker orqali)

### Sozlash

```bash
# 1. Reponi klonlash
git clone https://github.com/your-username/uzerp.git
cd uzerp

# 2. Environment faylni yaratish
cp .env.example .env

# 3. Dependencies o'rnatish
pnpm install

# 4. Docker servislari (PostgreSQL, Redis)
docker-compose up -d postgres redis

# 5. Prisma migratsiya
pnpm prisma:migrate

# 6. Demo data yuklash
pnpm prisma:seed

# 7. Development server
pnpm dev
```

### Docker orqali ishga tushirish (to'liq)

```bash
# Barcha servislarni ishga tushirish
docker-compose up -d

# Loglarni ko'rish
docker-compose logs -f api
```

### Portlar
| Servis | Port | URL |
|--------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Backend (NestJS) | 3001 | http://localhost:3001 |
| Swagger API Docs | 3001 | http://localhost:3001/api/docs |
| PostgreSQL | 5432 | - |
| Redis | 6379 | - |

## Demo Login

| Rol | Email | Parol |
|-----|-------|-------|
| Admin | admin@uzerp.uz | password123 |
| Buxgalter | accountant@uzerp.uz | password123 |
| Kuzatuvchi | viewer@uzerp.uz | password123 |

## API Documentation

Swagger UI: http://localhost:3001/api/docs

Asosiy endpointlar:
- `POST /api/auth/login` - Tizimga kirish
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/refresh` - Tokenni yangilash
- `GET /api/accounts` - Hisoblar rejasi
- `POST /api/journal` - Yangi provodka
- `GET /api/transactions` - Tranzaksiyalar
- `GET /api/balance` - Balans hisoboti
- `GET /api/dashboard/stats` - Dashboard statistika

## Prisma Schema

78 ta model, 60 ta enum. Asosiy modellar:
- User, Organization, Account, JournalEntry, JournalLine
- Transaction, Counterparty, Settings
- TaxPeriod, TaxReport, VatEntry, ProfitTaxReport
- DidoxDocument, InpsRecord, NdflRecord, Invoice
- Employee, Department, Payroll, Timesheet, HrDocument
- Product, Warehouse, StockMovement, Contract
- BankAccount, BankStatement, CashOrder, PaymentSchedule
- FinancialReport, CashFlowReport, KpiTarget, FixedAsset
- MobileDevice, Notification, AiSuggestion, FraudAlert
- AuditLog, TwoFactorAuth, ActiveSession, ApiKey

## Rivojlantirish

```bash
# Yangi migratsiya yaratish
pnpm prisma:migrate

# Prisma studio (DB browser)
cd apps/api && npx prisma studio

# Test
pnpm test

# Lint
pnpm lint

# Build
pnpm build
```

## Litsenziya

MIT

---

**UzERP** - O'zbekiston IT sanoati uchun ochiq kodli ERP yechimi.
