const router = require("express").Router();
const data = require("./dataprocess");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const { PORT, LOCALHOST, PATH_COMMON } = process.env;

router.get("/get-all-attendances", async (req, res) => {
  let result = await data.getAllAttendances();
  res.json(result);
});

router.post("/add-attendances", async (req, res) => {
  let result = await data.addAttendances(req.body);
  res.json(result);
});



module.exports = router;
