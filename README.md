# Vibe Commerce

Vibe Commerce is a simple e-commerce web application built with **React**, **TypeScript**, and **Express/Prisma** for the backend. It allows users to browse products, add items to a cart, and complete a checkout process with a receipt.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Browse a catalog of products
- Add items to cart and update quantities
- Remove items from cart
- Checkout process with customer details
- Order receipt generation
- Responsive design

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js, Prisma
- **Database:** PostgreSQL
- **Other Libraries:** Lucide Icons, ShadCn, React Hooks, Toast notifications,

---

## Project Structure

backend/
├── prisma/
│ └── schema.prisma
├── src/
│ ├── controllers/
│ │ ├── cartController.ts
│ │ └── productController.ts
│ ├── routes/
│ │ ├── cartRoutes.ts
│ │ └── productRoutes.ts
│ └── index.ts
frontend/
├── src/
│ ├── components/
│ ├── hooks/
│ ├── lib/
│ │ ├── api.ts
│ │ └── types.ts
│ ├── pages/
│ │ └── index.tsx
│ └── App.tsx
├── package.json
README.md

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL (or Docker)

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/EyobSmax/vibe-commerce.git
   cd vibe-commerce/backend
   ```
2. cd backend
3. npm install
4. npx prisma migrate dev --name init
5. npm run server
6. cd ../frontend
7. npm install
8. npm run dev
