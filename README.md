# Penny's Animal Sanctuary Backend (REST API)
Standalone MongoDB database and REST API which can be used as part of a custom fullstack MERN app (see the animal-sanctuary-frontend repository for more info).

### Table of Contents
- [Introduction](#Introduction)
- [Technologies](#Technologies)
- [Hosting](#Hosting)
- [Author](#Author)

### Introduction
___
This Node.js/Express application connects to a NoSQL (MongoDB) database to store and query information. Documents include animals, users, and applications. I built this API to practise and showcase my backend skills creating database schema documents, handling API routes and performing CRUD operations.

The app features global error handling and security middleware, as well as protected routes for authorized users and site administrators. Users are logged in with a secure JSON web token. Application documents reference both the user who created them and the animal the user is applying for. Schema is verified on the backend.

### Technologies
___
- Node.js
- Express v 4.17.1
- MongoDB v 3.6.3
- Mongoose v 5.11.12
- Bcrypt v 2.4.3
- JSON web token v 8.5.1
- Multer v 1.4.2
- Node Debugger v 1.1.5

### Hosting 
___
This API is hosted on heroku [HERE](https://animal-sanctuary.herokuapp.com).

For a demo of the full MERN-stack website featuring a fronend UI built in React.js, click [HERE](https://pennyssanctuary.web.app/). Refer to frontend Readme for more info.

### Author
___
This is an original app coded from scratch by ME, Claire Smith, a self-taught web developer in Lafayette, Indiana. Much thanks to some great teachers on Udemy: Jonas Schmedtmann and Maximilian Schwarzmuller of Academind for the confidence and techniques!
