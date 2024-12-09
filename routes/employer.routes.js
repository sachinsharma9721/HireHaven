const express = require('express');
const router = express.Router();
const { employerProfileCreation, employerProfileUpdation } = require('../controllers/employer.controller');
const authenticate = require('../middlewares/authenticate');
const authorization = require('../middlewares/authorization');

router.post('/profileCreation', authenticate(), authorization(["employer"]), employerProfileCreation);
router.post('/profileUpdation', authenticate(), authorization(["employer"]), employerProfileUpdation);

module.exports = router;