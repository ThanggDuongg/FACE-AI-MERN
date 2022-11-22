const express = require('express');
const {detectOneFace} = require('../controllers/image');

const router = express.Router();

//@route    POST api/image/detect-one-face
//@desc     none
//@asccess  Public
router.post('/detect-one-face', detectOneFace);

module.exports = router;
