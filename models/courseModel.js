const uuid = require('uuid').v4;
const fs = require('fs');
const path = require('path');

class courseModel {
    constructor(title, price, image) {
        this.id = uuid();
        this.title = title;
        this.price = price;
        this.image = image;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            price: this.price,
            image: this.image
        };
    }

    async save() {
        const courses = await courseModel.getAll();
        courses.push(this.toJSON());
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '../', 'data', 'db.json'),
                JSON.stringify(courses),
                (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '../', 'data', 'db.json'), "utf-8", (error, content) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(JSON.parse(content));
                }
            });
        });
    }
    static async getById(id) {
        const courses = await courseModel.getAll();
        return courses.find(course => course.id === id);
    }
    static async update (newCourse) {
        const courses = await courseModel.getAll();
        const foundCourseIndex = courses.findIndex(course => course.id === newCourse.id);
        courses[foundCourseIndex] = newCourse;
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '../', 'data', 'db.json'),
                JSON.stringify(courses),
                (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
        });
    }
}

module.exports = courseModel;
