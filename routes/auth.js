const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "name minimum length should be  2").isLength({ min: 2 }),
    check("email", "email is not valid").isEmail(),
    check("password", "password minimum length should be 6").isLength({
      min: 6,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is not valid").isEmail(),
    check("password", "password is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout);



module.exports = router;
