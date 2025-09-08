# inventory-application

[![License ISC](https://img.shields.io/github/license/Meltasy/inventory-application)](https://opensource.org/licenses/ISC)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-2025-blue.svg)](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
[![Node.js](https://img.shields.io/badge/Node.js-v22.12.0-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v11.3.0-red.svg)](https://www.npmjs.com/)
[![Repo Size](https://img.shields.io/github/repo-size/Meltasy/inventory-application)](https://github.com/Meltasy/inventory-application)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://inventory-application-production-b054.up.railway.app/)

An inventory management system to catalog, track and manage the wine in my cellar, and to remind me when each bottle is ready for enjoying.

This inventory-application was built as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application) curriculum.

Check out my [Wine Cellar App](https://inventory-application-production-b054.up.railway.app/)!

## Features

* 📊 **Smart inventory management:** Digital wine catalog with real-time quantity tracking
* 💡 **Intelligent drinking recommendations:** Automated identification for wines at peak maturity
* 🔎 **Advanced search and filtering:** Find wines instantly by name, color, producer, region or appellation
* 🍾 **Complete wine lifecycle:** Track every bottle from cellar to consumption
* 🍷 **Visual Status Indicators:** At-a-glance inventory health and drinking recommendations
* 💫 **Seamless user experience:** Responsive design with dynamic forms and real-time updates
* 🔒 **Data integrity assurance:** Validated inputs and redundancy-free database architecture

## Future Improvements

* Image uploads when editing or adding a wine
* Adding price paid and date bought
* Implementing a responsive layout

## Tech Stack

### Backend

* Node.js with Express.js framework
* PostgreSql with normalized schema design
* Express-validator for input validation and sanitization
* pg (node-postgres) for database connectivity
* Transaction management for data consistency

### Frontend

* EJS (Embedded JavaScript) templating engine
* HTML5 with semantic markup and form validation
* CSS3 for responsive styling and layout
* Vanilla JavaScript for client-side interactivity

## Local Installation

Prerequisite: Node.js v22.19.0

1. Clone the repository: `git clone git@github.com:Meltasy/inventory-application.git` and `cd inventory-application`
2. Install dependencies: `npm install`
3. Configure environment variables with an `.env` file in the root directory:
    * `DATABASE_PUBLIC_URL="your-database-url"`
    * `PORT="your-port"`
4. Create a new postgreSQL database with the name in your `.env` file
5. Set up the database, including wine data: `npm run start`
6. Start the server: `npm run dev`

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.