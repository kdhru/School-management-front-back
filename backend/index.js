const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
// const bodyParser = require("body-parser")
const app = express()
const Routes = require("./routes/route.js")
 
const PORT = process.env.PORT || 5000

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json({ limit: '10mb' }))
app.use(cors())

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("NOT CONNECTED TO NETWORK", err));


app.use('/', Routes);

const server = app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or change PORT.`)
        process.exit(1)
    } else {
        console.error('Server error:', err)
    }
})

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...')
    try {
        await mongoose.disconnect()
    } catch (e) {
        console.error('Error during mongoose disconnect', e)
    }
    server.close(() => process.exit(0))
})