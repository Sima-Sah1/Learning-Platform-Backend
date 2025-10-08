import express from 'express'
const app = express()
import authRoute from "./route/globals/auth/authRoute"


app.use("/app",authRoute)
export default app
