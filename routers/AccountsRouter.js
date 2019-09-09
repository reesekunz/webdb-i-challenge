const express = require("express");
// databse access using knex
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (request, response) => {
  //   db.select("*")
  //     .from("accounts")
  //  shortcut is:
  db("accounts")
    .then(accounts => {
      response.status(200).json(accounts);
    })
    .catch(error => {
      response.json(error);
    });
});

module.exports = router;
