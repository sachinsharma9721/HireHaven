const express = require('express');
const router = express.Router();
const { jobSeekerProfileCreation, jobSeekerProfileUpdation} = require('../controllers/jobSeeker.controller');
const authenticate = require('../middlewares/authenticate');
const authorization = require("../middlewares/authorization");

router.post('/profileCreation', authenticate(), authorization(["job_seeker"]), jobSeekerProfileCreation);
router.post('/profileUpdation', authenticate(), authorization(["job_seeker"]), jobSeekerProfileUpdation);


module.exports = router;