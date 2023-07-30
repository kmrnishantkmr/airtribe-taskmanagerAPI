const express = require('express');
const BodyParser = require('body-parser');
const tasks = require('./task.json');
const taskInfo = require('./routes/taskhelper.js')
const route = require('express').Router();



const app = express();
app.use(route);
app.use(BodyParser.json());
const PORT = 8000

app.listen(PORT, (error) => {
    if (!error){
        console.log("server started successfully")
    }else{
        console.log("Error occured")
    }
})

app.get('/',(req,resp) => {
    return resp.status(200).send("Congratulation you have successfully logged into TASK manager server");
});


app.use('/tasks', taskInfo);


