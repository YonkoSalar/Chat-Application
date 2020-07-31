const express = require('express');
const router = express.Router();

router.get('/', (reg, res) =>{
    res.send('Server is up and runnung');

});

module.exports = router;