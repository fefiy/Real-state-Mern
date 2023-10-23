const express = require("express")
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser")
const cors = require("cors")
dotenv.config()
const app = express()
const db = require("./config/connectMongo")

// middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json())

// import routes
const userRoute = require("./routes/userRoute")
const resdiencyRoute = require("./routes/residencyRoute")
const refreshTOkenRoute = require("./routes/refreshTOken")
app.use("/api/user", userRoute)
app.use("/api/residency", resdiencyRoute)
app.use("/api", refreshTOkenRoute)



const PORT = process.env.PORT || 4100
app.listen(process.env.PORT || 4100, ()=>{
    console.log("app is running on port",PORT)
})