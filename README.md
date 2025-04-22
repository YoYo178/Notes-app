# Notes-app

This is a simple to-do notes application built upon the MERN stack, that has advanced features such as Speech Recognition & Transcription, Recording audio, Storing recorded audio and images in AWS S3 buckets, Authentication and Authorization using JWT, input validation using validator, storing data using MongoDB, sending tokens securely to the client using HTTP only cookies, mail verification etc.

This project was initially an assignment for a full stack web developer job role, however due to unrealistic requirements and/or due to me not possessing the required skills at that time, decided to turn this into a learning project instead, through which I have learnt JWT, Authentication & Authorization, Backend<->Frontend communication, Caching, AWS S3, Mailing from code, Backend security against XSS and XSRF, etc.

The project also required to be made using AI in minimal time, however I instead decided to use **minimal AI instead** so that I understand how the technologies/libraries used in the project actually work.

## Preview Link: TODO

## Running the project locally
### Pre-requisites:
Make sure you have the following applications installed on your system.
- [Node.js](https://nodejs.org/en)
- [Git](https://git-scm.com/) or [GitHub Desktop](https://desktop.github.com/download/)
- [MongoDB](https://www.mongodb.com/) (Optional, if you have a MongoDB Atlas token)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (Optional, only required for inspecting the database)

### Cloning the project
Run the following commands on a terminal window:
```bash
git clone https://github.com/YoYo178/Notes-app.git
```
OR if you are using GitHub Desktop:
1. Click on "File" option in the title bar.
2. Click "Clone repository" (or press **Ctrl+Shift+O**)
3. Navigate to the "URL" tab and enter the following URL:
    - `https://github.com/YoYo178/Notes-App.git`
4. Adjust path as required using the "Local Path" option and click "Clone"

### Installing dependencies
Run `yarn install` in both frontend and backend folders.

### Running the project

Frontend:
```yarn
yarn run dev
```
Backend:
```bash
yarn run dev
# OR
yarn run dev:hot
```

For more instructions, view the project-specific README.md files.

## License
This project is licensed under the MIT License.