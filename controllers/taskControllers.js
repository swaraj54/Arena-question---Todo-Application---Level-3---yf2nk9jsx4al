const Users = require("../models/user.js");
const jwt = require("jsonwebtoken");
const Tasks = require("../models/task.js");
const bcrypt = require('bcrypt');
const { valid } = require("joi");
const JWT_SECRET = "newtonSchool";


const createTask = async (req, res) => {

    //creator_id is user id who have created this task.

    const { heading, description, token } = req.body;
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        res.status(404).json({
            "status": 'fail',
            "message": 'Invalid token'
        });
    }
    const creator_id = decodedToken.userId;

    const newtask = {
        heading,
        description,
        creator_id
    };

    try {
        const task = await Tasks.create(newtask);
        res.status(200).json({
            message: 'Task added successfully',
            task_id: task._id,
            status: 'success'
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    };

}


const getdetailTask = async (req, res) => {

    const task_id = req.body.task_id;

    try {
        const task = await Tasks.findById(task_id);
        res.status(200).json({
            status: 'success',
            data: task
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}


/*

updateTask Controller

In req.body only those field will be given from "heading", "description" and "status" that is being Updated.

req.body = {
    "task_id"    : task_id,
    "token"      : token,
    "heading"    : ... ,
    "description": ... ,
    "status"     : ...
}


1. Middleware isowner is Implemented in ../middleware/taskmiddleware.js (This will also handel if task with given _id doesnot exist).
2. Return the detail of the task with given task_id after update.

Response --> 

1. Success

200 Status code

json = {
  status: 'success',
  data: {
    status: 'pending',
    _id: 'mxcnbxzcn-khscc',
    heading: 'Study Doglapan',
    description: 'Need to study atleast 10 Pages',
    creator_id: 'kdjhgsdjgmsbmbs',
  }
}

2. Fail

404 Status Code
json = {
    "status": 'fail',
    "message": error message
}

*/


const updateTask = async (req, res) => {
    try {
        const task_id = req.body.task_id;
        const token = req.body.token;
        const heading = req.body.heading;
        const description = req.body.description;
        const status = req.body.status;

        const UpdatedData = await Tasks.findByIdAndUpdate(task_id, { heading, description, status }, { returnNewDocument: true })

        return res.status(200).json({
            status: 'success',
            data: {
                status: UpdatedData.status,
                _id: UpdatedData._id,
                heading: UpdatedData.heading,
                description: UpdatedData.description,
                creator_id: UpdatedData.creator_id,
            }
        })

    } catch (error) {
        return res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
    //Write your code here.
}


/*

deleteTask Controller

req.body = {
    "task_id"    : task_id,
    "token"      : token,
}


1. Middleware isowner is Implemented in ../middleware/taskmiddleware.js (This will also handel if task with given _id doesnot exist and invalid token).
2. delete the task with given task_id.

Response --> 

1. Success

200 Status code
json = {
  status: 'success',
  message: 'Task deleted successfully'
}

2. Fail

404 Status Code
json = {
    "status": 'fail',
    "message": error message
}

*/

const deleteTask = async (req, res) => {

    try {
        const task_id = req.body.task_id;

        const deleteTask = await Tasks.findByIdAndDelete(task_id)

        console.log(deleteTask, "deleteTask")

        return res.status(200).json({
            status: 'success',
            message: 'Task deleted successfully'
        })

    } catch (error) {
        return res.status(404).json({
            "status": 'fail',
            "message": error.message
        })
    }
}


module.exports = { createTask, getdetailTask, updateTask, deleteTask };
