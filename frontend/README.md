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
