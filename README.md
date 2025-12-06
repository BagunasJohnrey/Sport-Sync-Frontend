

# Sport Sync (Balayan Smasher Hub) - Frontend Application

   

## 📋 Project Overview

**Sport Sync Frontend** is the interactive web interface for the *Balayan Smasher Hub* management system. Built with **React** and **Vite**, this Single Page Application (SPA) provides a responsive, user-friendly environment for staff to process sales, manage inventory, and visualize business analytics in real-time.

It connects seamlessly to the Sport Sync Backend API to deliver a cohesive enterprise resource planning experience tailored for sports retail.

-----

## 🎓 Academic Submission Statement

This software project is submitted in partial fulfillment of the requirements for the following courses under the supervision of **Sir TALAOC, IVAN GABRIEL B.** and **Engr. CASTILLO, JEAN KARLA M.**:

| Course Code | Course Title | Requirement Fulfillment |
| :--- | :--- | :--- |
| **IT 314** | **Web Systems and Technologies** | Implements a modern **Component-Based Architecture** using React, client-side routing, state management via Context API, and responsive web design using Tailwind CSS. |
| **IT 312** | **Systems Integration and Architecture** | Demonstrates seamless integration with the Backend API using **Axios Interceptors**, handling JSON data exchange, and integrating third-party libraries for Charting and PDF generation. |
| **IT 313** | **System Analysis and Design** | Features a user-centric Interface Design (UI/UX) that translates business requirements (POS flow, Inventory tracking) into intuitive workflows and visual dashboards. |

-----

## ✨ Key Features

### 🖥️ Interactive Dashboard (IT 313)

  * **Visual Analytics:** Real-time charts (Revenue Trends, Category Performance) powered by `ApexCharts`.
  * **KPI Cards:** Instant view of daily revenue, total transactions, and low stock alerts.
  * **Stock Monitoring:** Color-coded alerts for items reaching critical reorder levels.

### 💰 Point of Sale (POS) Interface

  * **Efficient Workflow:** Fast product lookup via search or barcode scanning simulation.
  * **Dynamic Cart:** Real-time subtotal calculations, change computation, and stock validation before checkout.
  * **Receipts:** Digital receipt previews and transaction history.

### 📦 Inventory Management

  * **CRUD Operations:** Modals for adding, editing, and archiving products without page reloads.
  * **Advanced Filtering:** Filter products by Category, Stock Level, or Price.
  * **Batch Actions:** Quick stock adjustments and price updates.

### 📊 Reporting & Exports (IT 312)

  * **Data Tables:** Sortable and paginated tables for huge datasets.
  * **Client-Side Generation:** Generates professional PDF reports and CSV exports directly in the browser using `jspdf` and `jspdf-autotable`.
  * **Profit Analysis:** Dedicated view for calculating margins and cost-vs-revenue.

### 🔐 Security & Access Control (IT 314)

  * **Protected Routes:** Client-side routing checks user roles (`Admin` vs `Staff`) to restrict access to sensitive pages like Settings or Audit Logs.
  * **Session Management:** Auto-logout on token expiration and secure storage of session state.

-----

## 🛠️ Technology Stack

  * **Core Framework:** React 19 (via Vite)
  * **Styling:** Tailwind CSS v4
  * **Routing:** React Router DOM v6
  * **HTTP Client:** Axios (with Interceptors)
  * **Data Visualization:** React ApexCharts
  * **Utilities:** `date-fns` (Formatting), `lucide-react` (Icons), `jspdf` (PDF generation)

-----

## 🚀 Getting Started

### Prerequisites

  * Node.js (v16 or higher)
  * npm (Node Package Manager)
  * The **Sport Sync Backend** must be running locally on port 3000.

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/sport-sync-frontend.git
    cd sport-sync-frontend
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    The application will typically launch at `http://localhost:5173`.

-----

## ⚙️ Architecture Highlights

### Service Layer (`services/api.js`)

The application uses a centralized API service pattern.

  * **Interceptors:** Automatically attaches JWT tokens to outgoing requests and handles 401 Unauthorized errors by redirecting to login.
  * **Modularity:** API calls are abstracted, keeping UI components clean and focused on rendering.

### State Management (`context/AuthContext.jsx`)

A global Authentication Context wraps the application, managing the user's login state, role permissions, and persisting session data across page reloads.

### Component Reusability

Custom reusable components ensure UI consistency and reduce code duplication:

  * `Table.jsx`: A generic data table with pagination and sorting.
  * `Modal.jsx`: Standardized overlay for forms and alerts.
  * `KpiCard.jsx`: Uniform data presentation widgets.

-----

## 📚 Application Structure

```text
src/
├── assets/         # Static images and global styles
├── components/     # Reusable UI components (Navbar, Sidebar, Charts)
├── context/        # Global State (AuthContext)
├── pages/          # Main View Controllers (Dashboard, POS, Inventory)
├── routes/         # Route definitions and Protection logic
└── services/       # API configuration and endpoints
```

-----

## 👥 Contributors

  * **[Bagunas Johnrey](https://github.com/BagunasJohnrey)** - Project Leader / Manager, Backend Developer
  * **[De Castro Jeric](https://github.com/decastrojeric)** - Backend Developer
  * **[Causapin Ivere Grace](https://github.com/iverene)** - Backend & Frontend Developer
  * **[Manimtim Hazel Ann](https://github.com/Hazelannmanimtim02)** - Frontend Developer
  * **[Pagkaliwagan Noilee](https://github.com/NoileeAnnPagkaliwagan)** - Frontend Developer

> **Note:** All members listed above actively contributed to the **Documentation** and **Quality Assurance (QA)** of this project.

-----

© 2025 Sport Sync Frontend. All Rights Reserved.
