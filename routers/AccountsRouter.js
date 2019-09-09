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

router.get("/:id", accountIdValidation, (request, response) => {
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

router.post("/", accountValidation, (request, response) => {
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

router.put(
  "/:id",
  accountIdValidation,
  accountValidation,
  (request, response) => {
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
  }
);

router.delete("/:id", accountIdValidation, (request, response) => {
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

// custom middleware for requirements validation

// name and budget required
function accountValidation(request, response, next) {
  if (!request.body) {
    response.status(400).json({ message: "account data not found" });
  } else if (!request.body.name) {
    response.status(400).json({ message: "name is required" });
  } else if (!request.body.budget) {
    response.status(400).json({ message: "budget is required" });
  }
  next();
}

function accountIdValidation(request, response, next) {
  const { id } = request.params;
  db.get(id)
    .then(accountID => {
      console.log("account id validation success", accountID);
      if (accountID) {
        next();
      } else {
        response.status(400).json({ message: "account id not found" });
      }
    })
    .catch(error => {
      console.log(error);
      response
        .status(500)
        .json({ message: "failed account validation request" });
    });
}

module.exports = router;
