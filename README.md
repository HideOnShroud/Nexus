
# AWS S3 and DynamoDB CRUD Application

This application provides a set of CRUD operations for managing files in AWS S3 and corresponding records in DynamoDB. It is built using TypeScript and Express.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Logging](#logging)
- [License](#license)

## Features

- Upload, update, and delete files in AWS S3.
- Create, update, and delete records in a DynamoDB table.
- Unit Testing with Jest.
- Logging of operations and error handling using Winston.
- Built with TypeScript for improved type safety.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/HideOnShroud/nexus.git
   cd your-repo-name
   ```

2. **Install dependencies**:

   Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

   ```bash
   npm install
   ```

3. **Create an `.env` file**:

   Copy the `.env.example` to a new file named `.env` and fill in your AWS credentials and configurations:

   ```bash
   cp .env.example .env
   ```

4. **Set environment variables**:

   Add the following environment variables to your `.env` file:

   ```plaintext
   AWS_ACCESS_KEY="This is an access key"
   AWS_SECRET_ACCESS_KEY="This is a secret access key"
   PORT="3000"  # This is the port number where the server will run
   DYNAMODB_TABLE_NAME='files'
   S3_BUCKET_NAME='nexsus'
   REGION='eu-central-1'
   ```

## Usage

1. **Run the server**:

   Start the server using the following command:

   ```bash
   npm run serve
   ```

   The server will be running at `http://localhost:3000` (or the port you specified).

2. **API Endpoints**:

   - **Upload a file to S3 and create a record in DynamoDB**: `POST /files/upload`
   - **Get a file from S3**: `GET /files/:key`
   - **Update a file in S3 and update the record in DynamoDB**: `PUT /files/update/:key`
   - **Delete a file from S3 and delete the record from DynamoDB**: `DELETE /files/:key`

   Replace `:key` with the filename or key of the file in S3.

## Environment Variables

The following environment variables are required for the application to run:

| Variable                        | Description                                                  |
|---------------------------------|--------------------------------------------------------------|
| `AWS_ACCESS_KEY`               | Your AWS access key                                         |
| `AWS_SECRET_ACCESS_KEY`        | Your AWS secret access key                                 |
| `PORT`                          | The port number for the server to run (default is 3000)   |
| `DYNAMODB_TABLE_NAME`           | The name of the DynamoDB table (default is 'files')        |
| `S3_BUCKET_NAME`                | The name of the S3 bucket                                   |
| `REGION`                       | The AWS region for the services (e.g., 'eu-central-1')   |

## Testing

To run tests, you can use the following command:

```bash
npm test
```

This will execute all unit tests using Jest.

## Logging

The application uses [Winston](https://github.com/winstonjs/winston) for logging. Logs are saved in the `logs` directory in JSON format. You can find separate log files for combined logs and error logs:

- `logs/error.log` for error logs
- `logs/combined.log` for general logs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
