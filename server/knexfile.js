if (process.env.NODE_ENV !== "production") require("dotenv").config();

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "rootroot",
      database: "todoapp",
      charset: "utf8",
    },
  },
};
