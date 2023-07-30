const taskroute = require('express').Router();
const BodyParser = require('body-parser');
const tasks = require('../task.json');
const TaskValidator = require('../helpers/validator.js')
const path = require('path')
const fs = require('fs');
const { stringify } = require('querystring');

// Invoke BodyParser.json() to get the middleware function
taskroute.use(BodyParser.json());

taskroute.get('/', (req, resp) => {
    return resp.status(200).json(tasks);
});


// taskroute.get('/:id',(req,resp) => {
//     let taskIdPassed = req.params.id;
//     let taskDetails = tasks.mytask;
//     let result = taskDetails.filter(val => val.TaskId == taskIdPassed);
//     if (result == null || result == undefined || result.length == 0){
//         return resp.status(400).json({"Message":"Sorry, the requested TaskID is not in DB"})
//     }else{
//         return resp.status(200).json(result)
//     }
    
// })

//Get updated data everytime without restarting the server
taskroute.get('/:id',(req,resp) => {
    let taskIdPassed = req.params.id;
    const ReadPath = path.join(__dirname,'..','task.json')
    fs.readFile(ReadPath, {encoding: 'utf-8', flag: 'r'} ,(err,data) => {
        if(err){
            resp.status(500).json({"Message":"Internal Server Error occured while reading data"})
        }else{
            let taskDetails = JSON.parse(data);
            // let taskDetails = DataRead.mytask;
            let result = taskDetails.filter(val => val.TaskId == taskIdPassed);
            if (result == null || result == undefined || result.length == 0){
                        return resp.status(400).json({"Message":"Sorry, the requested TaskID is not in DB"})
                    }else{
                        return resp.status(200).json(result)
                    }
        }
    })
})

taskroute.post('/',(req,resp) => {
    const taskDetailPassed = req.body;
    const ValidationResult = TaskValidator.validateTaskInfo(taskDetailPassed,tasks);

    if (ValidationResult.status){
        const writepath = path.join(__dirname,"..","task.json");
        const taskDataModified = JSON.parse(JSON.stringify(tasks));
        taskDataModified.push(taskDetailPassed);
        try{
            fs.writeFileSync(writepath,JSON.stringify(taskDataModified),{encoding:'utf-8',flag:'w'})
            resp.status(200).json({"message":"Task has been added successfully"});
        }catch(err){
            resp.status(500).json({"Meesage":"Some error occured while writing to the file. Please try again"})
        }

    }else{
        resp.status(400).json(ValidationResult)
    }

})

taskroute.put('/',(req,resp) => {
    const taskbodyPassed = req.body;
    const ReadPath = path.join(__dirname, '..', 'task.json');
    fs.readFile(ReadPath,{encoding:'utf-8', flag:'r'},(err,data) => {
        if (err) {
            resp.status(500).json({ "Message": "Internal Server Error occurred while reading data" });
        }else{
            let DataRead = JSON.parse(data);
            let taskDetails = DataRead;
            let result = taskDetails.findIndex(val => val.TaskId == taskbodyPassed.TaskId);
            if (result == -1){
                const ValidationResult = TaskValidator.validateTaskInfo(taskbodyPassed,tasks);
                if (ValidationResult.status){
                    const writepath = path.join(__dirname,"..","task.json");
                    const taskDataModified = JSON.parse(JSON.stringify(tasks));
                    taskDataModified.push(taskDetailPassed);
                    try{
                        fs.writeFileSync(writepath,JSON.stringify(taskDataModified),{encoding:'utf-8',flag:'w'})
                        resp.status(200).json({"message":"Task has been added successfully"});
                    }catch(err){
                        resp.status(500).json({"Meesage":"Some error occured while writing to the file. Please try again"})
                    }
            
                }else{
                    resp.status(400).json(ValidationResult)
                }
            } else {
                const deletedTaskIndex = taskDetails.findIndex(item => item.TaskId == taskbodyPassed.TaskId);
                if (deletedTaskIndex == -1){
                    return resp.status(400).json({"Message":"The task id you provided is not in DB"})
                }else{
                    taskDetails.splice(deletedTaskIndex,1)
                    fs.writeFile(ReadPath, JSON.stringify(taskDetails), {encoding: 'utf-8', flag: 'w'}, (err) => {
                        if (err){
                            resp.status(500).json({"Message":"Delete Operation failed"})
                        }else{
                            const ValidationResult = TaskValidator.validateTaskInfo(taskbodyPassed,tasks);
                if (ValidationResult.status){
                    const writepath = path.join(__dirname,"..","task.json");
                    const taskDataModified = JSON.parse(JSON.stringify(tasks));
                    taskDataModified.push(taskbodyPassed);
                    try{
                        fs.writeFileSync(writepath,JSON.stringify(taskDataModified),{encoding:'utf-8',flag:'w'})
                        resp.status(200).json({"message":"Task has been added successfully"});
                    }catch(err){
                        resp.status(500).json({"Meesage":"Some error occured while writing to the file. Please try again"})
                    }
            
                }else{
                    resp.status(400).json(ValidationResult)
                }
                        }

                    })
                }
            }
        }
    })

})

taskroute.delete('/:id',(req,resp) => {
    const taskIdPassed = req.params.id;
    const ReadPath = path.join(__dirname,'..','task.json')
    fs.readFile(ReadPath, {encoding: 'utf-8', flag: 'r'} ,(err,data) => {
        if(err){
            resp.status(500).json({"Message":"Internal Server Error occured while reading data"})
        }else{
            let DataRead = JSON.parse(data);
            let taskDetails = DataRead;
            let result = taskDetails.filter(val => val.TaskId == taskIdPassed);
            if (result == null || result == undefined || result.length == 0){
                        return resp.status(400).json({"Message":"Sorry, the requested TaskID is not in DB"})
                    }
            else{
                
                const deletedTaskIndex = taskDetails.findIndex(item => item.TaskId == taskIdPassed);
                if (deletedTaskIndex == -1){
                    return resp.status(400).json({"Message":"The task id you provided is not in DB"})
                }else{
                    taskDetails.splice(deletedTaskIndex,1)
                    fs.writeFile(ReadPath, JSON.stringify(taskDetails), {encoding: 'utf-8', flag: 'w'}, (err) => {
                        if (err){
                            resp.status(500).json({"Message":"Delete Operation failed"})
                        }else{
                            resp.status(200).json({"Message":"Delete Operation successfull"})
                        }

                    })
                }
                        
            }

        }
    })
})

module.exports = taskroute