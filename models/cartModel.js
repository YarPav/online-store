const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

class CartModel {
    static async add (newCourse) {
        console.log('newCourse' + newCourse);
        const cart = await CartModel.fetch();
        const foundCourseIndex = cart.courses.findIndex(course => course.id === newCourse.id);
        const candidate = cart.courses[foundCourseIndex];
        if (candidate) {
            candidate.count++;
            cart.courses[foundCourseIndex] = candidate;
        } else {
            newCourse.count = 1;
            cart.courses.push(newCourse);
        }
        cart.price += +newCourse.price;
        return new Promise(((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), e => {
                if (e) {
                    reject(e);
                } else {
                    resolve();
                }
            });
        }));
    }

    static async fetch () {
        return new Promise(((resolve, reject) => {
            fs.readFile(p, "utf-8", (e, content) => {
                if (e) {
                    reject(e);
                } else {
                    resolve(JSON.parse(content));
                }
            });
        }));
    }

    static async remove (id) {
        const cart = await CartModel.fetch();
        const foundCourseIndex = cart.courses.findIndex(course => course.id === id);
        const course = cart.courses[foundCourseIndex];
        if (course.count === 1) {
            cart.courses = cart.courses.filter(c => c.id !== id);
        } else {
            cart.courses[foundCourseIndex].count--;
        }
        cart.price -= course.price;
        return new Promise(((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(cart), e => {
                if (e) {
                    reject(e);
                } else {
                    resolve(cart);
                }
            });
        }));
    }
}

module.exports = CartModel;
