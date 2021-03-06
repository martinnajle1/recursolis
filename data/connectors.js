import Mongoose from 'mongoose';
import casual from 'casual';
import rp from 'request-promise';
import _ from 'lodash';

const mongo = Mongoose.connect('mongodb://localhost/recursolis', (err) => {
    if (err) {
        console.error('Could not connect to MongoDB on port 27017');
    }
});
mongo.Promise = require('bluebird');

const ResourceSchema = Mongoose.Schema({
    _dni: { type: String, index: { unique: true } },
    firstName: String,
    lastName: String,
});

const ProjectSchema = Mongoose.Schema({
    title: String,
    contractor: String,
    budget: Number,
    resources: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
});


const Resource = Mongoose.model('resources', ResourceSchema);
const Project = Mongoose.model('projects', ProjectSchema);

// Relations
// 
// 
casual.seed(123);
Project.create({ title: "The project" })
    .then((project) => {
        for (var i = 0; i < 10; i++) {
            Resource.create({
                    _dni: casual.word,
                    firstName: casual.first_name,
                    lastName: casual.last_name
                })
                .then((res) => {
                    console.log("Project:", project.resources);
                    project.resources.push(res);
                    project.save();
                    console.log('RES:', res)
                })
                .catch((err) => console.log(err));
        }
    })
    .catch((err) => console.log(err));

const FortuneCookie = {
    getOne() {
        return rp('http://fortunecookieapi.com/v1/cookie?limit=1')
            .then((res) => JSON.parse(res))
            .then((res) => {
                return res.fortune.message;
            });
    },
};

export { Resource, Project };
