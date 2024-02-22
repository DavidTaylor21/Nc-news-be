
# Northcoders News API

## Summary
This project entails the development of an API to facilitate seamless communication between the frontend and the database. The API aims to emulate a real-world backend service, like Reddit, by providing essential functionalities required by the frontend architecture.

## Hosted Version
https://nc-news-a2p3.onrender.com/api

## Minimum Requirements
- Node.js version 6.0.0 or higher
- PostgreSQL version 16.1 or higher

## Instructions
To utilize this API effectively, follow these instructions:

1. **Clone the Repository**: 
    ```
    git clone [repository-url]
    cd [project-folder]
    ```

2. **Install Dependencies**: 
    ```
    npm install
    ```

3. **Set Up Local Database**:
    - Create a local PostgreSQL database using the script (`npm run setup-dbs`).
    - Seed the database with sample data using the script (`npm run seed`).

4. **Create .env Files**:
    - Create a `.env` file for development environment and another `.env.test` file for testing environment.
    - Specify the following environment variables in each `.env` file:
        ```
        PGDATABASE=your_database_name
        ```

5. **Run Tests**:
    ```
    npm test
    ```

6. **Start the Server**:
    ```
    npm start
    ```

7. **API Interaction**:
    - Utilize tools like Postman or Insomnia to interact with the API endpoints listed at /api.

## Feedback and Contributions
Feedback and contributions to this project are welcome. If you encounter any issues or have suggestions for improvement, feel free to open an issue or submit a pull request.
