const router = require("express").Router();
const auth = require("./authprocess");

router.post("/admin-change-password", async (req, res) => {
  
  let result = await auth.changePassword(req.body);
  res.json(result);
});

router.post('/verify-jwt', async (req, res) => {
  const result = await auth.verifyToken(req.body);
  res.json(result);
});

router.post("/checkValidAdmin", async (req, res) => {
  let result = await auth.checkValidAdmin(req.body);
  res.json(result);
});


module.exports = router;