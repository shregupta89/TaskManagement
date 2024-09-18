const {UserModel,TodoModel} = require("./db")
const express= require("express")
const jwt=require("jsonwebtoken")
const JWT_SECRET="jwtsecret"

const app=express()
app.use(express.json())

// mongodb+srv://admin:Shreya%402004@cluster0.dnrt8.mongodb.net/
const mongoose=require("mongoose")
mongoose.set('debug', true);
const run = async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://admin:Shreya%402004@cluster0.dnrt8.mongodb.net/todo-app-database"
      );
      console.log("Connected to myDB");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
    }
  };
  
  run(); 

// mongoose.connect("mongodb+srv://admin:Shreya%402004@cluster0.dnrt8.mongodb.net/todo-app-database")
//the name of the db is added at the end of the connection string 




app.post("/signup",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;

//if i do not await here and disconnect the mongoose library , i will still get "you are signed up" even though this task was not completed yet ,isliye ye task complete hue bina age nhi bdhna chahiye
    await UserModel.create({
        email:email,
        password:password,
        name:name
    });
    res.json({
        message:"You are signed up"
    })

})


//your backend might crash several times but thats the beauty of db that u dont have to sigin again to  restart  because your data is saved in  db 
app.post("/signin", async function(req,res){
    const email=req.body.email;
    const password=req.body.password;

    const response=await UserModel.findOne({   //all db calls have to be awaited 
        email:email,
        password:password
    })
    if(response){
        const token =jwt.sign({
            id:response._id.toString() // encoding an object is undefined , have to convert to a string before
        },JWT_SECRET)
        res.json({
            message:"you are signed in",
            token:token
        })
    }else{
        res.json({
            message:"Incorrect creds"
        })
    }

})

// function auth(req,res,next){
//     const token =req.headers.token;
//     const decodedData=jwt.verify(token,JWT_SECRET)
//     if(decodedData){
//         req.userId=decodedData.id;
//         next();
//     }else{
//         res.status(403).json({
//             message:"Incorrect Creds"
//         })
//     }
// }
// app.post("/todo",function(req,res,next){


// })
app.listen(3000);