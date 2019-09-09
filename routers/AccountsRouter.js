const express = require("express");
// databse access using knex
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (request, response) => {
  // in SQL the translation is select * from accounts

  //   db.select("*")
  //   .from("accounts")
  //  shortcut is:
  db("accounts")
    .then(accounts => {
      response.status(200).json(accounts);
    })
    .catch(error => {
      response.json(error);
    });
});

router.get("/:id", (request, response) => {
  // in SQL the translation is select * from accounts where id = 1
  const { id } = request.params;
  db("accounts")
    .where({ id })
    // grabbing the first id so data isnt returned as an array
    .first()
    .then(accounts => {
      response.status(200).json(accounts);
      //   response.status(200).json(accounts[0]); - another way to grab first id instead of using first()
    })
    .catch(error => {
      response.json(error);
    });
});

router.post("/", (request, response) => {
  // in SQL the translation is insert into accounts () values ()
  const accountData = request.body;
  // be sure to validate the postData before inserting into the db (using custom middleware)
  db("accounts")
    .insert(accountData, "id")
    .then(accounts => {
      response.status(200).json(accounts);
    })
    .catch(error => {
      response.json(error);
    });
});

router.put("/:id", (request, response) => {
  // in SQL the translation is update account set ... where id = 123
  const changes = request.body;
  const { id } = request.params;
  db("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      response.status(200).json({ message: `updated ${count} account` });
    })
    .catch(error => {
      response.json(error);
    });
});

router.delete("/:id", (request, response) => {
  const { id } = request.params;
  // in SQL the translation is delete from accounts where ...
  db("accounts")
    .where({ id })
    .delete()
    .then(count => {
      response.status(200).json({ message: `deleted ${count} account` });
    })
    .catch(error => {
      response.json(error);
    });
});

module.exports = router;
