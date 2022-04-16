const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors");
const jwt = require("jsonwebtoken");

const studentModel = require("./models/student");
const courseModel = require("./models/course");
const bcrypt = require("bcryptjs");

app.use(express.json())
app.use(cors())


mongoose.connect("mongodb+srv://saksham:saksham@cluster0.lyhjg.mongodb.net/time-table-planner?retryWrites=true&w=majority")

app.get("/getStudents", (req,res)=>{
    studentModel.find({}, (err,result)=>{
        if(err){
            console.log("ERROR OCCURED!")
            res.json(err)
        }
        else{
            console.log("WORKED SUCCESSFULLY!")
            res.json(result)
        }
    })
})

app.post("/createStudent", async(req,res)=>{
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10);
        const info = {
            name: req.body.name,
            email: req.body.email,
            rollNo: req.body.rollNo,
            password: newPassword
        }
        const newStudent = new studentModel(info);
        await newStudent.save();
        const token = jwt.sign({
            email: req.body.email,
            name: req.body.name,
            password: newPassword,
            rollNo: req.body.rollNo,
            classes: []
        },'secret');
        res.json({ status:"ok" , user:token })
    }catch{
        res.json({ error : "Failed to create new user" ,user:false, status:404 })
    }
})

app.get("/getRollNo" , (req,res)=>{
    studentModel.count({}, (err,count)=>{
        if(err){
            return res.json({ error : error })
        }else{
            return res.json({ count : count })
        }
    })
})

app.post("/login" , async (req,res)=>{
    const user = await studentModel.findOne({
        email : req.body.email,
    });
    if(!user){
        return res.json({ status:404, user:false });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

    if(isPasswordValid){
        const token = jwt.sign({
            email  :user.email,
            name : user.name,
            password : user.password,
            rollNo : user.rollNo,
            classes : user.classes
        } , "secret");
        res.json({ status:"ok" , user:token })
    }else{
        res.json({ status:404 , user:false })
    }
})

app.get("/getCourses", (req,res)=>{
    courseModel.find({}, (err,result)=>{
        if(err){
            console.log("Error occured!")
            res.json(err)
        }else{
            console.log("Worked successfully!")
            res.json(result)
        }
    })
})

app.post("/addCourse" , (req,res)=>{

    studentModel.findOneAndUpdate(
        { email : req.body.email },
        { classes : req.body.classes }
    ).then(()=>{
        res.json({ status : "ok" , updated:true })
    }).catch(()=>{
        res.json({ status:404 , updated:false })
    })
})

app.get("/getClass" , (req,res)=>{
    const courseId = req.headers["course-id"];

    courseModel.findOne({_id:courseId},(err,result)=>{
        if(err){
            console.log("Error occured")
            res.json(err)
        }else{
            console.log("Worked successfully")
            res.json(result);
        }
    })
})

app.get("/api/login", async (req,res)=>{
    const token = req.headers["user-token"];

    try{
        const decoded = jwt.decode(token, "secret");
        const user = await studentModel.findOne({ email:decoded.email });
        if(!user){
            return res.json({ status:404, userExists:false, user:false });
        }

        if(user){
            const newUser = jwt.sign({
                name : user.name,
                email : user.email,
                password : user.password,
                classes : user.classes,
                rollNo : user.rollNo
            },"secret")
            return res.json({ status:"ok" , userExists:true , user:newUser })
        }else{
            return res.json({ status:404 , userExists:false , user:false })
        }
    }catch{
        return res.json({ status:404 , userExists:false , user:false })
    }
})

app.post("/updateUserClasses" , async(req,res)=>{

    const user = await studentModel.findOneAndUpdate(
        { email:req.body.email },
        {classes: req.body.classes}
    )

    if(user){
        return res.json({ status:"ok" , updated:true })
    }else{
        return res.json({ status:404 , updated:false });
    }
})


app.listen(3001, ()=>{
    console.log("Server is running at http://localhost:3001")
})