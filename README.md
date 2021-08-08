### Deploying to Heroku

#### Fork and Configure Project

- In Terminal, navigate to your Brainstation directory
- **Fork** this repo
- Once you have forked the above repo, `git clone <clonedrepourl>`
- `cd protected_routes_cda`
- `cd client && npm i`
- `cd ..`
- `cd server && npm i`
- `cp .env.sample .env`
- In your `.env` file, add a value for your JWT_SECRET env variable, choose any value.

#### Database Configuration, Migration, and Seeding

- In `server/knexfile.js`, ensure your database configuration contains valid values. A sample is shown below.

```js
module.exports = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "rootroot",
    database: "todoheroku",
    charset: "utf8",
  },
};
```

- Update any configuration variables (user, password, etc) to credentials that you use to access MySQL
- In Terminal, `cd server`
- In Terminal, type `mysql -u root -p` to login as root user.
- In the mysql console, type: `CREATE DATABASE todoheroku`
- In the mysql console, type: exit
- In Terminal, run `knex migrate:latest`
- In Terminal, run `knex seed:run`

#### Set Up Tools and Create Heroku App

- Verify you have node installed on your computer with `node -v`
- Visit [heroku.com](https://heroku.com) to log in to your account, or to create one if you did not do so during pre-work
- In Terminal, verify you have the Heroku CLI installed with `heroku -v`
- If you do not have the Heroku CLI installed on your computer, download it [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
- Run `heroku login` and click any key to ensure you are logged in to your Heroku account through the CLI
- Run `heroku create <nameofyourapp>` to create a new, empty Heroku app. Alternatively, run `heroku create` with no app name specified and be amused at Heroku's ridiculous auto-generated app names.
- To view your beautiful (empty) app, run `heroku open` or select the app from your dashboard and click 'Open app'.

#### Prepare Your Project to Deploy to Heroku App

- In Terminal, run `git remote -v` to verify that your local git repo is connected to your GitHub repo
- To push changes to your project to Heroku, you will need a remote that points to your Heroku project, in addition to the `origin` remote. 
- To create this new remote, in Terminal run `heroku git:remote -a <nameofyourherokuapp>`
- Run `git remote -v` in Terminal again. **What do you see?**
- Now, we have the ability to push changes to our Heroku project after we have pushed them up to our GitHub repo. 
- At the **root** of this project directory, run `npm init -y`. This will generate a `package.json` file at the **root** of your project.

#### Update root package.json

- At the **root** directory, `npm i -D concurrently nodemon`
- Add the following scripts to your **root** `package.json` file.

```json
  "scripts": {
    "client": "npm start --prefix client",
    "start": "npm start --prefix server",
    "server": "npm start --prefix server NPM_CONFIG_PREFIX=./server",
    "dev": "concurrently --kill-others \"npm run server\" \"npm run client\"",
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm install --prefix server && npm run build --prefix client"
  },
```

**Check for understanding: BUT WHY???**

#### Update server/package.json

- Update your `server/package.json` scripts with the following:

```json
  "scripts": {
    "migrate": "knex migrate:latest",
    "migrate:down": "knex migrate:down",
    "migrate:rollback": "knex migrate:rollback",
    "seed": "knex seed:run",
    "start": "node index.js",
    "server": "nodemon index.js"
  }
```

- Test out your npm scripts in your root and server directories to ensure they are functional. 

**Check for understanding: BUT WHY???** 

#### Configure Your Production Database, Buildpack, and Environment Variables

- On the Heroku dashboard for your app, click the 'Resources' tab
- In the 'Add-ons' section, search for 'JawsDB MySQL'
- Leave 'Plan name' on 'Kitefin Shared - Free' and click 'Submit Order Form'
- Expand the JawsDB MySQL add-on to view your database connection string
- Go to the 'Settings Tab' and click on the 'Reveal Config Vars' button. Make sure you have a config var entry that is pointing to the JawsDB URL.​
- If not, you can manually add one. JAWSDB_URL & the above connection string will be the key value pair. Enter them in the text box.​
- In your Heroku configuration variables, add a config variable called JWT_SECRET and set it as equal to anything.
- Go to the Buildpacks section under settings tab. Click on 'Add buildpack' and search for nodejs. Add it as your buildpack. You should see Heroku/nodejs once you have it successfully added.
- Update your `.env` file to the following:

```
JWT_SECRET="anything"
JAWSDB_URL="localhost"
DB_USER="root"
DB_PASSWORD="rootroot"
DB_NAME="todoheroku"
```

- Add the additional environment variables (without their values) to your `.env.sample` file.

**Check for understanding: BUT WHY???**

#### Update server/knexfile.js

```js
if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.JAWSDB_URL,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8",
      insecureAuth: true,
    },
  },
  production: {
    client: "mysql",
    connection: process.env.JAWSDB_URL,
  },
};

```

**Check for understanding: BUT WHY???**

#### Update server/bookshelf.js

```js
const knex =
  process.env.NODE_ENV === "production"
    ? require("knex")(require("./knexfile").production)
    : require("knex")(require("./knexfile").development);
const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;

```

**Check for understanding: BUT WHY???**

#### Update the React Front-End Client Application

- Open `client/package.json` and set a proxy: `"proxy": "http://localhost:8080"`
- Update your axios requests in your `Home.js`, `Login.js`, and `SignUp.js` components so that they making requests to the remaining portion of your API endpoint (e.g. `http://localhost:8080/api/users/current` can be changed to `/api/users/current`)
- After making changes to `package.json`, restart your client side server to verify that your proxy is working correctly

**Check for understanding: BUT WHY???**

#### Update server/index.js to include the following

```js
if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/users");
const cors = require("cors");
const path = require("path");
const app = express();
const mysql = require("mysql");
const PORT = process.env.PORT || 8080;
let knex = require("./knexfile");

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("../client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "build", "index.html"));
  });
}

let connection;
// make connection
if (process.env.NODE_ENV === "production") {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection(knex.development);
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

connection.connect((err) => {
  console.log("Connected to MySQL");
});

```

**Check for understanding: BUT WHY???**

#### Pushing to GitHub and Deploying to Heroku 

- `npm run dev` to verify that your project is functioning as expected locally 
- `git add .`
- `git commit -m "prepare for deployment to heroku"`
- `git push origin main` or `git push -u origin main` (the latter if it's your first time pushing to this branch)
- `git push heroku main` to push your changes to your Heroku app 
- `heroku logs` to view any output from pushing to Heroku 
- **READ YOUR HEROKU LOGS IF SOMETHING HAS GONE WRONG WITH YOUR BUILD!!! ACTUALLY JUST READ YOUR HEROKU LOGS EVEN IF EVERYTHING IS SUCCESSFUL!!! THERE IS GOOD STUFF IN THERE!!!** *bangs on the table*
- Before you open your app, click on more dropdowns and click on 'Run Console' and type bash to open a bash terminal.
- This is where you can run your migration and seed commands for your Heroku project (so far we have only migrated and seeded locally).
- From the Heroku terminal, `cd server`
- `npm run migrate` or `knex migrate:latest` or `npx knex migrate:latest`
- `npm run seed` or `knex seed:run` or `npx knex seed:run`
- If everything goes well, you can open your app using the URL or by going to the app on the Heroku webpage and clicking the 'Open App' button.
