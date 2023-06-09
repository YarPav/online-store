const {Router} = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError')
    });
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email});
        if (candidate) {
            const comparedPassword = await bcrypt.compare(password, candidate.password);
            if (comparedPassword) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Wrong password');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('registerError', 'User with this email does not exist');
            res.redirect('/auth/login#register');
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/register', async (req, res) => {
    try {
        const {email, password, rePassword, name} = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            req.flash('registerError', 'User with this email already exists');
            res.redirect('/auth/login#register');
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email,
                name,
                password: hashPassword,
                cart: {items: []
                }
            });
            await user.save();
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
