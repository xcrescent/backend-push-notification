const router = require('express').Router();


router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/register-success', (req, res) => {
    res.render('register-success');
});
module.exports = router;