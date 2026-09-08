const express = require("express");// helps to create your backend server and handle HTTP requests
const cors = require("cors");//CORS = Cross-Origin Resource Sharing.This matters because your frontend and backend are likely running on different origins.
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");//This middleware lets Express read cookies sent by the browser,if later your authentication system stores a JWT inside a cookie

const connectDB = require("./config/db");//"Give me the connectDB function defined in config/db.js.

const authRoutes = require("./routes/authRoutes");//Load all the authentication-related routes from authRoutes.js."
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");
const taskRoutes = require("./routes/taskRoutes");

const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");//importing two functions from: middleware/ errorMiddleware.js..Those are:notFound,errorHandler,They deal with errors.

dotenv.config();//This loads your .env variables into:process.env,...then JavaScript can access:process.env.PORT and:process.env.CLIENT_URL

const app = express();//"Create my Express backend application." app becomes the object you'll use to configure your server.

// Connect MongoDB
connectDB();//This calls the function you imported earlier: const connectDB = require("./config/db");

// Middleware:
app.use(  //"Apply this middleware to incoming requests."You're applying CORS.
  cors({
    origin: process.env.CLIENT_URL,//"Allow requests coming from http://localhost:3000."
    credentials: true,//This is important if you're using cookies for authentication.It allows credentials such as cookies to be included in cross-origin requests when the frontend/backend are configured accordingly.
  })
);
app.use(express.json());//The request body is JSON.express, parses that JSON so your controller can access it through: req.body... Without it, your controller may not be able to properly read the JSON body.
app.use(cookieParser());//This parses incoming cookies.

// Routes:
app.use("/auth", authRoutes);//connects those routes to your server.the actual endpoints become:POST /auth/register,POST /auth/login...Whenever a request starts with /auth, let authRoutes decide what to do."
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler
app.use(notFound);//This comes after your routes.Express processes things in order.If the request doesn't match any route, (notFound) middleware gets a chance to handle it.

// Error handler
app.use(errorHandler);//This is your final error-handling middleware.If something fails somewhere in your backend, this can produce a consistent response.

// Start server
const PORT = process.env.PORT || 5000;//"Use the PORT from .env; if it doesn't exist, use 5000."

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//This actually starts your Express server..If:PORT=5000,your backend is listening at:http://localhost:5000...So now React can make requests to it.

