const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/signup',(req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
    return res.json({ result: false, error: 'Missing or empty fields' });
    }
    User.findOne({username}).then(data => {
        if(data){
            res.json({ result: false, error: 'User already exists' });
        }
        else{
            const newUser = new User({
                username: {username},
                password: {password},
            });
            newUser.save().then(newSavedUser => {
                res.json({result: true, user: newSavedUser});
            })
        }
    })
});

router.post('/signin',(req, res) => {
    if (!username || !password) {
    return res.json({ result: false, error: 'Missing or empty fields' });
    }
    User.findOne({username,password}).then(data => {
        if(data){
            res.json({result: true, user: data});
        }
        else{
            res.json({result: false, error: 'User not found or wrong password'});
        }
    })
});

module.exports = router;
