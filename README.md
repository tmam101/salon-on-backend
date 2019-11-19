# SalonON

**About:**

This project serves as the backend and API for the stylist booking platform SalonOn. The project is developed for the COMP523 Software Engineering course at the University of North Carolina at Chapel Hill. This repository contains the backend NodeJS source code. For the frontend repo, see https://github.com/talithavanlith/SalonOn

**Summary:**

SalonON is a stylist booking platform designed with convenience in mind. The app aims to be a 3 tiered solution for clients, stylist, and salons, allowing Customers to be able to create profiles detailing their hair type, style interests, and location preferences. All of which is then used to match them with the perfect stylist in their area. The stylist, with a profile of their own, can specify their experience, showcase their work via a photo album, and contact salons with space available to set the appointment, all from within the app. This backend will communicate with the frontend, serving as a mediator between the frontend and the database.  The app has several endpoints that are useful for accessing different kinds of information.

**Getting Started:**

This project is developed using a text editor. Recommended text editors are Atom https://atom.io or Visual Studio Code https://code.visualstudio.com/?wt.mc_id=DX_841432.  It relies on the NodeJS framework.  Navigate to https://nodejs.org/en/download/ and follow the installation instructions.  Once NodeJS is installed properly, navigate via terminal or command line to 'salon-on-backend' and run 'npm start'.  

**Testing:**

The tests are located in 'Project/Tests'.  These files all end with '.test.js'.  To run the tests, navigate to 'salon-on-backend' and run 'npm test'.  This will run the tests and generate a code coverage report.  The tests are also configured to run automatically on the continuous integration platform CircleCI at https://circleci.com/gh/tmam101/salon-on-backend.  The Github repo is configured to not allow merges unless these tests pass.  

**Deployment:**

The codebase of this project lives on two repositories. This one, and the frontend mentioned in the about section. While the backend is hosted by Heroku at https://dashboard.heroku.com/apps/salon-on-backend, the android app is still in development and as such the frontend has not been officially deployed to any platform at the time of this documentation. However a walking skeleton of the app can be accessed from the project website located at https://frosty-tereshkova-9806e1.netlify.com/index.html.

**Technologies Used:**

The technologies actively the project include NodeJS, the Android Platform via Java as an environment, Google Maps for improved location data, Amazon Web Services RDS as a database solution, Jest testing framework, and Heroku Cloud Platform for hosting the backend server.

NodeJS: https://nodejs.org/en/
Google Maps: https://developers.google.com/maps/documentation/android-sdk/intro  
AWS: https://aws.amazon.com  
Jest: https://jestjs.io  
Heroku: https://www.heroku.com  

**Contributing:**

Aside from GitHub, the team utilizes a Trello board for project management as well as engages in weekly face to face meetings. More information on the team, and the style guides used can be found on the project website under the 'Team' section.

**Authors:**

Ethan Bateman - ethanB@unc.edu - Backend Developer and Database Admin   
Key responsibilities have included designing the schema for the SQL database, implementing the database communication with
the Node.js server, and structuring the android classes for storing data locally.

David Moore - d42n81@live.unc.edu - Frontend Developer and Communications Head  
Responsible for integrating Android UI components, specifying the API interface requirements from the backend, and  coordinating schedules between the team, client, and team mentor.

Talitha Van Lith - talitha@live.unc.edu - Frontend Developer, Webmaster and Lead Designer  
Tasked with producing a clickable prototype, designing Android UI elements, integrating google maps functionality, and managing the project website.

Thomas Goss - tpgoss@live.unc.edu - Backend Developer and Network Admin  
Responsible for implementing the network communications between node.js webserver and the android API, as well as managing the deployment of the backend onto heroku and its associated automated test suites.

**License:**
TBD

**Acknowledgements:**

We extend our graditude to our mentor Mike Lake, and Professor Jeff Terrell for providing their insights throughout the duration of this project.
