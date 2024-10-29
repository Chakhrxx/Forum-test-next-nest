# Forum API

![Redis](https://img.shields.io/badge/Redis-7.4.1-darkred)
![Redis Insight](https://img.shields.io/badge/Redis_Insight-2.58-red)
![Docker Desktop](https://img.shields.io/badge/Docker-27.3.1-blue)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2.29.7-blue)
![PG Pool](https://img.shields.io/badge/Pgpool-4-darkblue)
![Postgres](https://img.shields.io/badge/Postgres-17-darkblue)
![Nodejs](https://img.shields.io/badge/Nodejs-20-green)
![Nestjs](https://img.shields.io/badge/Nestjs-10.4.5-darkred)
![bun](https://img.shields.io/badge/bun-1.1.31-yellow)

## Project Overview

The Forum API is designed for managing forums, topics, and posts. This API enables users to create, read, update, and delete forums, along with their associated topics and posts, facilitating an interactive platform for discussion and engagement.

## Key Features

- **Forums**: Manage various discussion forums.
- **Topics**: Create topics within each forum to facilitate focused discussions.
- **Posts**: Users can create and manage posts within topics.
- **User Interaction**: Users can comment on posts, engage with one another, add comments, and delete their comments.

## Technologies

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Redis**: An in-memory data structure store used as a database, cache, and message broker.
- **Bunn** A modern JavaScript runtime that comes with a built-in package manager and a bundler. Bun is designed to be fast and efficient, offering a streamlined development experience for server-side applications.
- **Docker** A platform that enables developers to automate the deployment of applications in lightweight, portable containers. Docker allows you to package your application along with its dependencies, ensuring consistent environments across development, testing, and production.

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- `bun` package manager
- Node.js (recommended version: 20 or higher)

### Cloning the Repository

First, clone the backend project repository:

```bash
git clone <repository-url>
```

### Navigate to the Backend

To access the frontend of the project, open your terminal and navigate to the `backend` directory using the following command:

```bash
cd Forum/backend
```

## NestJS Application

The backend application is built using NestJS, a progressive Node.js framework that supports modular architecture, making it easier to scale and manage.

### Environment Variables

Create a `.env` file in the backend directory of your project with the following content:

```bash
# NestJS Configuration
HOST=localhost
PORT=3001
API_KEY=X74cJvjeEXRr8K7ETBtcrOquXJoYTfXrVK7Rs1sKS1voKcwrtV9TC52gAyloDm8u

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=RHNVAx7snjaTm2J7IEcc
REDIS_SECRET=forum_secrets

# PostgreSQL Configuration
PG_HOST=localhost
PG_USER=admin
PG_PASSWORD=bm6Qhjx9tmT5S4rhL3mubddY
PG_DATABASE=forum
PG_PORT=5432
```

## PostgreSQL Setup

Create a `.env` file in the `docker/postgres `directory with the following PostgreSQL configuration:

```bash
# PostgreSQL Configuration
PG_USER=admin  # Username for PostgreSQL and replication
PG_PASSWORD=bm6Qhjx9tmT5S4rhL3mubddY  # Password for PostgreSQL and replication user
PG_DATABASE=forum  # Default database to be created

# PostgreSQL Port Configuration
PG_PORT=5432  # Port on which PostgreSQL will listen for connections

# pgAdmin Configuration
PGADMIN_EMAIL=admin@forum.com  # Admin email for pgAdmin access
PGADMIN_PASSWORD=PV3HY5EhpnjIc5DY6yA9Kgrd  # Password for pgAdmin admin user
PGADMIN_PORT=8080  # Port on which pgAdmin will
```

Create a `postgresql.conf` file in the `docker/postgres/config` directory with the following PostgreSQL configuration:

```bash
# Listen on all available IP addresses
listen_addresses = '*'

# Default port for PostgreSQL connections
port = '5432'

# Maximum number of concurrent connections
max_connections = 10000

# Amount of memory allocated for shared memory buffers
shared_buffers = 256MB

# Memory allocated for each query operation
work_mem = 4MB

# Memory allocated for maintenance operations like VACUUM
maintenance_work_mem = 64MB

# Write-ahead logging (WAL) level for replication
wal_level = 'replica'

# Ensure data integrity by flushing data to disk
fsync = 'on'

# Maximum time between automatic checkpoints
checkpoint_timeout = 15min

# Maximum size of WAL files before a checkpoint is triggered
max_wal_size = 1GB

# Number of maximum simultaneous WAL senders for replication
max_wal_senders = '16'

# Size of WAL files to keep for replication
wal_keep_size = '128MB'

# Enable hot standby to allow read-only queries on standby servers
hot_standby = 'on'

# Minimum message level for client logging
client_min_messages = 'error'

# Default transaction behavior (read/write)
default_transaction_read_only = off

# Time zone setting for the database
timezone = 'Asia/Bangkok'

# Preload libraries for auditing
shared_preload_libraries = 'pgaudit'

# Directory for including additional configuration files
include_dir = 'conf.d'
```

## Docker Compose Configuration

The docker-compose.yaml file is located in the `docker/postgres` directory and is used to set up a PostgreSQL primary-standby replication environment, along with pgAdmin for database management.

### Commands

1. Start the PostgreSQL Docker services defined in the docker-compose.yaml file:

   ```bash
   docker-compose -f docker/postgres/docker-compose.yaml -p postgres_database up -d
   ```

2. Grant replication privileges to the admin user:

   ```bash
   docker exec -it postgres-primary bash -c "PGPASSWORD='bm6Qhjx9tmT5S4rhL3mubddY' psql -U postgres -d forum -c \"ALTER USER admin WITH REPLICATION;\""
   ```

3. Restart the PostgreSQL services to apply any changes made:
   ```bash
   docker-compose -f docker/postgres/docker-compose.yaml -p postgres_database restart
   ```

## Redis Setup

Create a `.env` file in the docker/postgres directory with the following PostgreSQL configuration:

```bash
# Redis Configuration
REDIS_PASSWORD=RHNVAx7snjaTm2J7IEcc  # Password for accessing the Redis server
REDIS_PORT=6379  # Port on which Redis will listen for connections (default is 6379)
REDIS_INSIGHT_PORT=5540  # Port for accessing Redis Insight (default is 5540)

```

## Docker Compose Configuration

The docker-compose.yaml file is located in the `docker/redis` directory and is used to set up a Redis cache along with Redis Insight for monitoring.

### Commands

1. Start the Redis cache services defined in the docker-compose.yaml file:

   ```bash
   docker-compose -f docker/redis/docker-compose.yaml -p redis_cache up -d
   ```

## Development

### To install project dependencies, run:

```bash
bun install
```

### To start the development server, run:

```bash
bun dev
```

HTTP server is running on: http://localhost:3001

Access the following services:

- swagger : http://localhost:3001/document

  - x-api-key : `X74cJvjeEXRr8K7ETBtcrOquXJoYTfXrVK7Rs1sKS1voKcwrtV9TC52gAyloDm8u`
  - JwtAuth (http, Bearer) : This authentication method will be used to receive a JSON Web Token (JWT) after you sign in or sign up

- pgAdmin : http://localhost:8080
  - Email:`admin@forum.com`
  - Passwoed:`PV3HY5EhpnjIc5DY6yA9Kgrd`
- redis Insight : http://localhost:5540
  - Host:`localhost`
  - Port: 6379
  - Password:`RHNVAx7snjaTm2J7IEcc`
  - Database Alias:`redis-cache:6379`

# Forum UI

![Nextjs](https://img.shields.io/badge/NextJS-15-black)
![classnames](https://img.shields.io/badge/classnames-2.5.1-black)
![React](https://img.shields.io/badge/React-18-blue)
![Axios](https://img.shields.io/badge/Axios-1.7.7-blue)
![Tailwindcss](https://img.shields.io/badge/tailwindcss-3.4.1-darkgreen)
![Nodejs](https://img.shields.io/badge/Nodejs-20-green)
![bun](https://img.shields.io/badge/bun-1.1.31-yellow)

## Project Overview

This Next.js application allows users to manage their posts within a community platform. Users can create, update, and delete their posts, as well as filter them using a search bar or dropdown selection.

## Key Features

- **User Authentication**: Secure sign-in and sign-up functionality.
- **Post Management**:
  - Create new posts.
  - Update existing posts.
  - Delete posts.
- **Comment Management**:
  - Create new comments.
  - Update existing comments.
  - Delete comments.
- **Filtering Options**:
  - Search bar for quick access to specific posts.
  - Dropdown selection to filter posts by community.
- **Community Engagement**: Users can view and interact with posts from their posts.

## Technologies

- **Next.js**: A React framework that enables server-side rendering and static site generation, providing a powerful environment for building fast and scalable web applications. Next.js allows for seamless routing, API routes, and optimized performance out of the box.

- **Axios**: A promise-based HTTP client for making requests to external APIs. Axios simplifies the process of sending asynchronous HTTP requests, allowing for easy data fetching, error handling, and response transformations.

- **Tailwind CSS**: A utility-first CSS framework that enables rapid UI development. Tailwind CSS allows developers to create custom designs directly in their markup using utility classes, promoting a consistent and responsive design system without the need for writing custom CSS for every component.

## Getting Started

### Prerequisites

- api run in localhost:3001
- `bun` package manager
- Node.js (recommended version: 20 or higher)

## Getting Started

### Prerequisites

- An API running on `localhost:3001` to handle requests.
- The `bun` package manager installed on your system.
- Node.js (recommended version: 20 or higher) for running the application.

Make sure to have these prerequisites set up before proceeding with the installation and running the project.

### Navigate to the Frontend

To access the frontend of the project, open your terminal and navigate to the `frontend` directory using the following command:

```bash
cd Forum/frontend
```

### Environment Variables

Create a `.env` file in the frontend directory of your project with the following content:

```bash
NEXT_PUBLIC_API_KEY=X74cJvjeEXRr8K7ETBtcrOquXJoYTfXrVK7Rs1sKS1voKcwrtV9TC52gAyloDm8u
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Development

### To install project dependencies, run:

```bash
bun install
```

### To start the development server, run:

```bash
bun dev
```

### Access the Following Services

Once the application is running, you can access the following services:

- **HTTP Server**: The main application is accessible at [http://localhost:3000](http://localhost:3000). This is where you can interact with the frontend and navigate through the various features.

- **Sign Up**: Create a new account by visiting [http://localhost:3000/sign-up](http://localhost:3000/sign-up). This page allows you to enter your details to register for a new user account.

- **Sign In**: Access your existing account at [http://localhost:3000/sign-in](http://localhost:3000/sign-in). Here, you can log in using your credentials to manage your posts and access community features.

- **Post ID**: To view a specific post, use the URL pattern [http://localhost:3000/post/id](http://localhost:3000/post/id), replacing `id` with the actual post ID. This will take you to the detailed view of that particular post.

- **Our Blogs**: Explore community blogs at [http://localhost:3000/blogs](http://localhost:3000/blogs). This page showcases various blog posts from users within the community, allowing for engagement and interaction.

Make sure to have the server running to access these endpoints successfully.
