import dotenv from "dotenv"

import {app} from './app.js'
import connectDB from "./db/db.js"
import cors from 'cors';


dotenv.config({
    path: './.env'
});

app.use(cors());
app.get("",(req,res)=>{
res.json("hello world")
}
})
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

