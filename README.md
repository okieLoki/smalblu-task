### Installation Instructions:

1. **Clone the Repository:**
   Clone the project repository from your version control system (e.g., GitHub).

   ```bash
   git clone https://github.com/okieLoki/smalblu-task
   ```

2. **Navigate to the Project Directory:**
   Change your working directory to the project's root folder.

   ```bash
   cd smallblu-task
   ```

3. **Install Dependencies:**
   Use npm (Node Package Manager) to install the project dependencies.

   ```bash
   npm install
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file in the project root directory and set the necessary environment variables. For example:

   ```env
    PORT = <specify PORT>
    JWT_SECRET = <JWT Secret Key>
    MONGO_URI = <MongoDB Connnection URL>
   ```

5. **Start the Application:**
   Start the Express.js development server.

   ```bash
   npm run dev
   ```

6. **Access the Application:**
   The application should now be running and accessible at `http://localhost:PORT` 

#### API Endpoints:

- **User Routes:**
  - `POST /api/user/register`: Register a new user.
  - `POST /api/user/login`: Authenticate and log in a user.
  - `DELETE /api/user/delete`: Delete a user account.

- **Currency Routes (Authenticated):**

    -  **Convert Currency (`GET /api/currency/convert`)**:

        - **Query Parameters**:
            - `from` (string, required): The currency code you want to convert from (e.g., USD).
            - `to` (string, required): The currency code you want to convert to (e.g., EUR).
            - `amount` (number, required): The amount you want to convert.

        - **Example**:
            - `GET /api/currency/convert?from=USD&to=EUR&amount=100`

    -  **Get Live Exchange Rates (`GET /api/currency/live`)**:

        - **Query Parameters**:
            - `base` (string, optional): The base currency for the exchange rates (default: USD).
            - `symbols` (string, optional): Comma-separated list of currency symbols to retrieve exchange rates for (default: USD,EUR,GBP,INR).

        - **Example**:
            - `GET /api/currency/live?base=USD&symbols=EUR,GBP`

    - **Get Historical Exchange Rates (`GET /api/currency/historical`)**:

        - **Query Parameters**:
            - `from` (string, required): The currency code you want to get historical rates for (e.g., USD).
            - `to` (string, required): The currency code you want to convert to (e.g., EUR).

        - **Example**:
            - `GET /api/currency/historical?from=USD&to=EUR`

#### Authentication:

- Authentication is required for currency-related routes (JWT token required).

#### Testing (using Jest and Supertest):

To run tests, run the command
    
```bash
npm run test
```

#### Rate Limiting:

- There is an IP based rate limiter applied which limits to 100 requests per day.
