const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./config/db");
const authRoutes = require('./routes/auth.routes');
const employerRoutes = require('./routes/employer.routes');
const jobSeekerRoutes = require('./routes/jobSeeker.routes');
const userRoutes = require('./routes/user.routes');

dotenv.config();

//Middlewares
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//Port
const PORT = process.env.PORT || 8000;

//Db Connection
db.query("SELECT 1", (err, results) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log(`Connected to MySQL database`);
});

//Context Path
const contextPath = '/api/v1';

//Routes
app.get(`${contextPath}/`, (req, res) =>{
    res.send({ message: 'Application Running' });
})
app.use(`${contextPath}/auth`, authRoutes);
app.use(`${contextPath}/employer`, employerRoutes);
app.use(`${contextPath}/jobSeeker`, jobSeekerRoutes);
app.use(`${contextPath}/user`, userRoutes);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})