const {Router} = require('express');
const Course = require('../models/courseModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.get('/', authMiddleware, (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    });
});

router.post('/', authMiddleware, async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        image: req.body.image,
        userId: req.user
    });
    try {
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
