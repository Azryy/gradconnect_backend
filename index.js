import express from "express";
import cookieParser from "cookie-parser"; 
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";


dotenv.config({});



const app = express();

 

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))



const PORT = process.env.PORT || 3000;

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);


//for users
"http://localhost:8000/api/v1/user/register"
"http://localhost:8000/api/v1/user/login"
"http://localhost:8000/api/v1/user/profile/update"

//for companies
"http://localhost:8000/api/v1/company/register"
"http://localhost:8000/api/v1/company/get"
"http://localhost:8000/api/v1/company/get/:id"
"http://localhost:8000/api/v1/company/update/:id"


//for jobs
"http://localhost:8000/api/v1/job/post"
"http://localhost:8000/api/v1/job/get"
"http://localhost:8000/api/v1/job/getadminjobs"
"http://localhost:8000/api/v1/job/get/:id"
"http://localhost:8000/api/v1/job/delete/:id"

//for applications
"http://localhost:8000/api/v1/application/apply/:id"
"http://localhost:8000/api/v1/application/get"
"http://localhost:8000/api/v1/application/:id/applicants"
"http://localhost:8000/api/v1/application/status/:id/update"



//Port number testing
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})