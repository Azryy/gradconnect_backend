import express from "express";
import cookieParser from "cookie-parser"; 
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import fs from "fs";
import  path from 'path';
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { User } from "./models/user.model.js";


dotenv.config({});



const app = express();



//xml integration
app.get("/api/users/xml", async (req, res) => {
  try {
    // Fetch all user records
    const users = await User.find().populate("profile.company").lean();

    // Convert data to XML
    const builder = new XMLBuilder({ ignoreAttributes: false, format: true, indentBy: "  " });
    const xmlData = builder.build({
      users: users.map((user) => ({
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: {
            bio: user.profile?.bio || "",
            skills: { skill: user.profile?.skills || [] },
            resume: user.profile?.resume || "",
            resumeOriginalName: user.profile?.resumeOriginalName || "",
            profilePhoto: user.profile?.profilePhoto || "",
          },
        },
      })),
    });

    // Save XML to a file
    const filePath = path.resolve("./users.xml");
    fs.writeFileSync(filePath, xmlData, "utf-8");

    // Set headers for download
    res.setHeader("Content-Disposition", "attachment; filename=users.xml");
    res.setHeader("Content-Type", "application/xml");

    // Send the file
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Failed to download XML file");
      } else {
        console.log("File sent successfully");
      }
    });
  } catch (error) {
    console.error("Error generating XML:", error);
    res.status(500).json({ error: "Failed to generate XML file" });
  }
});
  

app.post("/api/users/xml", express.text({ type: "application/xml" }), async (req, res) => {
  try {
    const parser = new XMLParser();
    const jsonData = parser.parse(req.body); // Parse XML to JSON

    // Extract user data
    const users = jsonData.users.user; // Assuming a structure like <users><user>...</user></users>
    const formattedUsers = Array.isArray(users) ? users : [users]; // Ensure it's an array

    // Save users to the database
    const savedUsers = await User.insertMany(formattedUsers);
    res.status(201).json({ message: "Users imported successfully", savedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to import users from XML" });
  }
});

 

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

//xml api
"http://localhost:8000/api/users/xml"



//Port number testing
app.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})