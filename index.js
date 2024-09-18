const {UserModel,TodoModel} = require("./db")
const bcrypt=require("bcrypt")
const{JWT_SECRET,auth}=require("./auth")
const express= require("express")
const {z}=require("zod")

const app=express()
app.use(express.json())


const mongoose=require("mongoose")
const connectionString = 'mongodb+srv://admin:Shreya%402004@cluster0.dnrt8.mongodb.net/todo-app-database'; // Replace with your MongoDB URI
const options = {
  connectTimeoutMS: 30000, // 30 seconds
};

mongoose.connect(connectionString, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// mongoose.connect("mongodb+srv://admin:Shreya%402004@cluster0.dnrt8.mongodb.net/todo-app-database")
//the name of the db is added at the end of the connection string 




app.post("/signup",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    const requiredbody=z.object({
        email:z.string().regex("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/").min(3).max(100).email(),
        passowrd:z.string().min(8).max(15).regex(),
        name:z.string().min(3).max(20)
    })

    const pasrsedDataWithSuccess=requiredbody.safeParse(req.body); //req.body is the input body 
    if(!pasrsedDataWithSuccess.success){
        res.json({
            message:"Incorrect format",
            error:pasrsedDataWithSuccess.error
        })
        return 
    }
    const hashedPassword=await bcrypt.hash(password,5); 
    //its doing smth expensive that is why have to await it 
    //5 is the number of rounds that u eant to hash the password , the hgiher the number the number the harder it is to brute force it and more difficult to computationally run so ensure to have a intermediate number 

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
    })
    if(!response){
        res.status(403).json({
            message:"You are not signed up"
        })
    }
    const matchedPassword=await bcrypt.compare(password,response.password);
    if(matchedPassword){
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
app.post("/todo",auth,async function(req,res,next){
    const userId=req.userId;
    const title=req.body.title;
    const done=req.body.done;

    await TodoModel.create({
        title,
        done,
        userId
    })
    res.json({
        message:"Todo created"
    })    
} 
)
app.get("/todos",auth,async function(req,res,next){
    const userId=req.userId;
    const todos=await TodoModel.find({
        userId:userId
    })
    res.json({
        todos
    })

})


app.listen(3000);