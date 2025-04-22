# Notes-App Frontend

This project was generated with [Vite](https://vite.dev/) using the Vite + React + TypeScript template.

### Libraries used:
- `@tanstack/react-query` and `axios` for backend communication and managing cache.
- `lodash` for comparing deep nested arrays and objects.
- `react` and `react-dom` for core logic of the application.
- `react-icons` for the various icons used in the application.
- `react-router-dom` for managing routes.
- `validator` for validating input

## Running the project
Assuming you have the project cloned, navigate to the project folder and run the shown commands:
### Install dependencies
```bash
cd frontend
yarn install
```

### Run the web app
```bash
yarn run dev
```

The app will automatically start listening for requests at `http://127.0.0.1:5173` or `http://localhost:5173`.

## Building the web application
Make sure you have all dependencies installed.

```bash
yarn run build
```
A `dist` folder will be created along with the built HTML, CSS, and JS files, and can be run using a web server such as [Apache](https://www.apache.org/) or [nginx](https://nginx.org/).

## Other Available Scripts
#### `yarn run lint`: Checks for linting errors.
#### `yarn run preview`: Launches the application in preview environment.