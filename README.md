# Space Invaders API

A RESTful API for storing and managing high scores for the classic game Space Invaders.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Endpoints](#endpoints)
* [Database](#database)
* [Dependencies](#dependencies)
* [Getting Started](#getting-started)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Overview

This API provides a simple way to store and retrieve high scores for the classic game Space Invaders. It uses a SQLite database to store user data and high scores.

## Features

* User authentication using JSON Web Tokens (JWT)
* High score storage and retrieval for individual users
* Support for multiple high score types (e.g. top high scores, personal high scores)

## Endpoints

### Authentication

* `POST /auth/login`: Login with username and password
* `POST /auth/register`: Register a new user
* `POST /auth/refresh`: Refresh access token
* `GET /auth/logout`: Logout

### High Scores

* `GET /highscores/get`: Retrieve high scores for a user
* `POST /highscores/set`: Submit a new high score for a user

## Database

The API uses a SQLite database to store user data and high scores.

## Dependencies

* `express`: Web framework
* `sqlite`: Database driver
* `jsonwebtoken`: JWT library
* `bcrypt`: Password hashing library
* `cookie-parser`: Cookie parsing library

## Getting Started

1. Clone the repository: `git clone https://github.com/your-username/space-invaders-api.git`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open a web browser and navigate to `http://localhost:3000`

## API Documentation

API documentation is available at `http://localhost:3000/api-docs`.

## Contributing

Contributions are welcome! Please submit a pull request with your changes.

## License

This project is licensed under the ISC License.

[![Build Status](https://travis-ci.org/your-username/space-invaders-api.svg?branch=master)](https://travis-ci.org/your-username/space-invaders-api)
[![Code Coverage](https://codecov.io/gh/your-username/space-invaders-api/branch/master/graph/badge.svg)](https://codecov.io/gh/your-username/space-invaders-api)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
