# Disclone
Practice webapp

Setup:

This project uses .env variables for the JWT secret (SECRETKEY) and the database password (DBPASS)

After cloning, you will need to create a postgreSQL database. By default, it should be named 'disclone' and use port 5432 but you can rename it whatever you like, as long as you also rename it in the backend/config/db.js file.

don't forget to npm install

open two terminal windows, navigate one to backend, the other to discord_clone_frontend

in both, npm run dev