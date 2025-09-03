# inventory-application

Personal wine collectors face significant challenges managing their collections without proper digital infrastructure. Traditional methods like spreadsheets or paper records become unwieldly as collections grow, making it difficult to track optimal drinking windows, manage inventory levels, and efficiently locate specific wines by their characteristics. Wine enthusiasts need comprehensive tracking systems that can handle complex wine data while providing intuitive search and filtering capabilities.

This project solves these challenges by:

* **Centralized inventory management:** Complete digital catalog with detailed wine information and quantity tracking
* **Intelligent drinking recommendations:** Automated identification of wines at peak maturity or requiring immediate consumption
* **Advanced search capabilities:** Multi-criteria filtering by color, producer, region, appellation, alphabetical sorting
* **Normalized data architecture:** Efficient PostgreSQL database design preventing redundancy while maintaining data integrity
* **Full lifecycle tracking:** Complete CRUD operations with transaction-safe quantity updates and consumption history

Check out my [Wine Cellar App](https://inventory-application-production-b054.up.railway.app/)!

This inventory-application was built as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application) curriculum.

***

## Features

### Backend App

* Full CRUD operations with transaction-safe database management
* Smart wine categorization identifying peak maturity and expiration alerts
* Multi-criteria search and filtering by color, producer, region and appellation
* Normalized PostgreSQL schema preventing data redundancy
* Server-side validation using Express-validator for data integrity
* Quantity tracking with separate full/empty bottle management

### Frontend Interface

* Server-side rendered interface using EJS templating
* Dynamic forms for wine entry and management
* Real-time search and filtering capabilities
* Responsive design for collection overview and detailed views
* Client-side validation for immediate user feedback
* Visual indicators for drinking recommendations and inventory status

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

## Installation

1. Clone the repository: `git clone git@github.com:Meltasy/inventory-application.git` and `cd inventory-application`
2. Install dependencies: `npm install`
3. Configure environment variables with an .env file in the root directory:
    * `DATABASE_PUBLIC_URL="your-database-url"`
4. Create a new postgreSQL database with the name in your .env file
5. Set up the database, including wine data: `npm run start`
6. Start the server: `npm run dev`

## Future Improvements

* Image uploads when editing or adding a wine
* Adding price paid and date bought
* Implementing a responsive layout

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
