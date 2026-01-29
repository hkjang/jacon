# Jacon - Enterprise GitOps Platform (Simulation)

Jacon is a mocked, high-fidelity simulation of an Enterprise-grade Kubernetes/GitOps management platform. It demonstrates advanced concepts like multi-cluster management, OPA policy enforcement, edge operations, and real-time observability in a single Next.js applications.

## Key Features

### 🚀 Core Platform

- **Workload Management**: View, edit, and restart simulated Kubernetes workloads.
- **GitOps Integration**: Connect Git repositories and simulate synchronization.
- **Drift Detection**: Automatic detection of configuration drift with 1-click sync.

### 🛡️ Security & Governance

- **Policy as Code (OPA)**: Write Rego policies with a built-in syntax checker simulation.
- **IAM & RBAC**: Manage Users, Roles, and Permissions matrix.
- **Audit Logs**: Comprehensive audit trail of all actions (Create/Update/Delete).

### 🌐 Connectivity

- **Multi-Cluster**: Manage "Production" vs "Staging" clusters.
- **Edge Computing**: Monitor remote edge agents/stores with simulated heartbeats.
- **Endpoint Groups**: Logical grouping of infrastructure resources.

### 📊 Observability

- **Real-time Monitoring**: Simulated CPU/Memory usage charts.
- **Log Streaming**: Live log viewer for workloads.
- **Web Terminal**: Interactive web-based shell simulation.

## Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Run Development Server**

    ```bash
    npm run dev
    ```

3.  **Open Browser**
    Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `src/app`: Next.js App Router pages.
- `src/components`: Reusable UI components (shadcn/ui based).
- `src/lib/db.ts`: **Core Simulation Engine**. This file acts as an in-memory database, storing the state of clusters, users, policies, etc. It resets on server restart.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather)
- **State Management**: React State + In-Memory Singleton (`db.ts`)
