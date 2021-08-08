const bcrypt = require("bcryptjs");

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

module.exports = [
  {
    first_name: "Leo",
    last_name: "Policastro",
    email: "leo@gmail.com",
    phone: "123-456-7890",
    address: "123 Main St, Coral Gables, FL",
    password: hashPassword("password"),
  },
  {
    first_name: "Ernie",
    last_name: "Hsiung",
    email: "ernie@gmail.com",
    phone: "123-456-7890",
    address: "123 Main St, Miami, FL",
    password: hashPassword("password"),
  },
];
