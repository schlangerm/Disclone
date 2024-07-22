# Disclone
Practice webapp

SETUP:

This project uses .env variables for the JWT secret (SECRETKEY) and the database password (DBPASS)

After cloning, you will need to create a postgreSQL database. By default, it should be named 'disclone' and use port 5432 but you can rename it whatever you like, as long as you also rename it in the backend/config/db.js file.

By default, this application uses localhost:3001 for the backend, localhost:5173 for the front.

don't forget to npm install

open two terminal windows, navigate one to backend, the other to discord_clone_frontend

in both, npm run dev

NOTES: 
Creating a chat requires at least two users, so if you want to explore that you'll need to create at least two accounts.
