const express = require('express');
const router = express.Router();
const { fetchProfileDetail} = require('../controllers/user.controller')
const authenticate = require('../middlewares/authenticate');

router.post('/profileDetail',authenticate(), fetchProfileDetail);

module.exports = router;