//Schema of our project

const mongoose=require("mongoose");

const Schema=mongoose.Schema; //its a class , now make an object
const ObjectId=Schema.ObjectId;

const User=new Schema ({   //User is a collection made on top of this schema object
    email:{type:String,unique:true},
    password:String,
    name:String 
})

const Todo=new Schema({
    userId:ObjectId,
    title:String,
    done:Boolean
})

const UserModel= mongoose.model("users",User); 
//this model has the collection name as "users" and based on User Schema
const TodoModel=mongoose.model("todos",Todo);

module.exports={
    UserModel,
    TodoModel
}