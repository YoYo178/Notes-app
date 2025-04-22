# Notes-App Backend

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

### Libraries used:
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` for backend communicating with AWS S3 and issuing pre-signed GET and PUT URLs.
- `bcrypt` for hashing passwords.
- `dotenv` and `jet-env` for preparing environmental variables to use in code.
- `express` for core logic of the application.
- `express-async-handler` for asynchronous request handling and basic level error handling.
- `jet-logger` for logging.
- `jet-validators` and `validator` for input validation.
- `jsonwebtoken` for signing, verifying, and decoding JWT.
- `module-alias` for mapping path aliases to paths.
- `mongoose` ORM for managing MongoDB operations.
- `morgan` for logging requests and responses with appropriate colors as their status codes.
- `nodemailer` for sending emails from code for mail verification.
    - When launched in development mode, `nodemailer` uses Ethereal instead of a real SMTP service.

### Middlewares used:
- `cookie-parser` for parsing cookies from incoming requests.
- `cors` for configuring CORS and setting allowed origins.
- `express-rate-limit` for managing rate limits.
- `helmet` for managing security against common attacks/exploits.

## Running the project
Assuming you have the project cloned, navigate to the project folder and run the shown commands:
### Install dependencies
```bash
cd backend
yarn install
```

### Run the web app
```bash
yarn run dev
# OR
yarn run dev:hot # Features hot-reloading
```

The app will automatically start listening for requests at `http://127.0.0.1:3000` or `http://localhost:3000` or as specified in the `PORT` environment variable.

## Building the web application
Make sure you have all dependencies installed.

```bash
yarn run build
```
A `dist` folder will be created along with the built JavaScript files, which can be run using the `start` script (`yarn run start` OR `yarn start`)

## Setting environment variables
### Rename the `.env.example` file to `.env` and add the values accordingly.
- #### Optionally you can also create environment specific .env files such as `.env.development` and `.env.production`.
#### General:
- `NODE_ENV` - The environment to run the application in:
    - `development` or `production`
#### App:
- `APP_NAME` - Application name, used in mails.
- `PORT` - The port at which the application will listen at for incoming requests.
#### MongoDB:
- `MONGODB_URI` - MongoDB URL (Atlas or Local)
#### Token Secrets:
- `ACCESS_TOKEN_SECRET` - Secret string for signing Access Tokens.
- `REFRESH_TOKEN_SECRET`- Secret string for signing Refresh tokens.
- `RESET_PASSWORD_ACCESS_TOKEN_SECRET` - Secret string for signing special, short-lived tokens used only for resetting password in case of account recovery.

#### AWS S3:
- `AWS_REGION` - The region in which the AWS S3 Bucket is created.
- `AWS_BUCKET_NAME` - The AWS S3 bucket name.
- `AWS_ACCESS_KEY_ID` - AWS S3 Access Key ID.
- `AWS_SECRET_ACCESS_KEY` - AWS S3 Secret Access Key.

#### SMTP:
- `SMTP_PROVIDER` - The provider of the SMTP service.
- `SMTP_EMAIL` - The Email address from the SMTP service to use.
- `SMTP_PASS` - The password for the SMTP Email address.

## Other Available Scripts
#### `yarn run clean-install`: Removes the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.
#### `yarn run lint`: Checks for linting errors.
#### `yarn run type-check`: Check for typescript errors.