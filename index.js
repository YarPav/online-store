const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/homeRoute');
const coursesRoutes = require('./routes/coursesRoute');
const addRoutes = require('./routes/addRoute');
const cartRoutes = require('./routes/cartRoute');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const ordersRoutes = require('./routes/ordersRoute');
const authRoutes = require('./routes/authRoute');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/userMiddleware');
const csrf = require('csurf');
const flash = require('connect-flash');

const USER = 'root';
const PASSWORD = 'root';
const DB_URL = `mongodb+srv://root:${PASSWORD}@cluster0.qomorsz.mongodb.net/shop`;
const PORT = process.env.PORT || 3000;
const app = express();

app.engine('hbs', exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const store = new MongoStore({
    collection: 'sessions',
    uri: DB_URL
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

async function start() {
    try {
        await mongoose.connect(DB_URL, { useNewUrlParser: true});
        // const candidate = await User.findOne();
        // if (!candidate) {
        //     const user = new User({
        //         email: 'root@gmail.com',
        //         name: 'root',
        //         cart: {items: []}
        //     });
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}
start();
