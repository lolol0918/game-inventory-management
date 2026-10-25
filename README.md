# game-inventory-management

A web-based game inventory management system built with Node.js, Express, and PostgreSQL.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square)
![Express](https://img.shields.io/badge/Express.js-4.x-black?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational-blue?style=flat-square)
![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Overview

game-inventory-management is an MVC web application for managing a collection of games, genres, and publishers. It features CRUD operations for each entity, relational integrity via PostgreSQL, and a user-friendly interface rendered with EJS templates. The project enables easy tracking and organization of game inventories, with robust Express.js routing and middleware support.

## Tech Stack

- **Languages:** JavaScript, EJS, CSS, PLpgSQL
- **Frameworks:** Express.js (MVC)
- **Database:** PostgreSQL
- **Templating:** EJS
- **Key Libraries:**
  - dotenv
  - pg
  - nodemon (development)
  - eslint (linting)

## Prerequisites

- **Node.js** (v14 or later recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (running locally or remotely)
- **Git** (for cloning the repository)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/lolol0918/game-inventory-management.git
   cd game-inventory-management
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the project root.
   - Add your PostgreSQL connection string:
     ```
     DATABASE_URL=postgres://username:password@localhost:5432/game_inventory
     ```

4. **Set up the database:**
   - Create the database and run migrations:

     ```bash
     psql -U your_username -d postgres -f db/schema.sql
     psql -U your_username -d game_inventory -f db/migrations/001_genre_fk_on_delete_set_null.sql
     psql -U your_username -d game_inventory -f db/migrations/002_game_genres_junction.sql
     psql -U your_username -d game_inventory -f db/migrations/003_add_rating_to_games.sql
     ```

   - Seed the database:
     ```bash
     npm run seed
     ```

## Usage

- **Start the application:**

  ```bash
  npm start
  ```

  Or for development with auto-reload:

  ```bash
  npm run dev
  ```

- **Lint code:**

  ```bash
  npm run lint
  npm run lint:fix
  ```

- **Access the web interface:**
  - Open your browser and navigate to `http://localhost:3000` (default port).

## Project Structure

```text
.
├── app.js                  # Main application entry point
├── controllers/            # MVC controllers for games, genres, publishers
│   ├── gameController.js
│   ├── genreController.js
│   └── publisherController.js
├── db/                     # Database schema, migrations, and seed scripts
│   ├── migrations/
│   │   ├── 001_genre_fk_on_delete_set_null.sql
│   │   ├── 002_game_genres_junction.sql
│   │   └── 003_add_rating_to_games.sql
│   ├── pool.js
│   ├── schema.sql
│   └── seed.js
├── eslint.config.js        # ESLint configuration
├── game_inventory.sql      # Additional SQL scripts
├── package.json
├── public/                 # Static assets (CSS)
│   └── style.css
├── routes/                 # Express routers
│   ├── gameRouter.js
│   ├── genreRouter.js
│   └── publisherRouter.js
├── views/                  # EJS templates
│   ├── game-details.ejs
│   ├── game-form.ejs
│   ├── games.ejs
│   ├── genre-details.ejs
│   ├── genres.ejs
│   ├── index.ejs
│   ├── partials/
│   │   ├── head.ejs
│   │   └── header.ejs
│   └── publishers.ejs
└── LICENSE
```

## API Endpoints

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/games`          | List all games                  |
| GET    | `/games/:id`      | Get details of a specific game  |
| POST   | `/games`          | Create a new game               |
| PUT    | `/games/:id`      | Update an existing game         |
| DELETE | `/games/:id`      | Delete a game                   |
| GET    | `/genres`         | List all genres                 |
| GET    | `/genres/:id`     | Get details of a specific genre |
| POST   | `/genres`         | Create a new genre              |
| PUT    | `/genres/:id`     | Update an existing genre        |
| DELETE | `/genres/:id`     | Delete a genre                  |
| GET    | `/publishers`     | List all publishers             |
| GET    | `/publishers/:id` | Get details of a publisher      |

## Contributing

Contributions are welcome!  
To contribute:

1. **Fork** the repository.
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/my-feature
   ```
3. **Commit** your changes and push to your fork.
4. **Open a Pull Request** describing your changes.

## License

This project is licensed under the [MIT License](LICENSE).  
You are free to use, modify, and distribute this software.

---

