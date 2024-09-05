import express from "express"
import cors from "cors"


const app = express()

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions)) 

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))



import userRouter from './routes/user.routes.js'

import customersRouter from './routes/customers.routes.js'
app.use("/api/v1/users", userRouter)
app.use("/api/v1/customers", customersRouter)




export {app}