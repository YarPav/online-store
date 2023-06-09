const {Router, request} = require('express');
const Course = require('../models/courseModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();
router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.render('course', {
        title: course.title,
        course
    });
});

router.get('/:id/edit', authMiddleware, async (req, res) => {
   if (!req.query.allow) {
       return res.redirect('/');
   }
   const course = await Course.findById(req.params.id);
   res.render('course-edit', {
       title: `Edit - ${course.title}`,
       course
   });
});

router.post('/edit', authMiddleware, async (req, res) => {
    const {id} = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
});

router.post('/remove', authMiddleware, async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id});
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
