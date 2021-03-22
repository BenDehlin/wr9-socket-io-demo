//Require pacakges
require("dotenv").config({ path: __dirname + "/../.env" })
const express = require("express")
const session = require("express-session")
const massive = require("massive")
const app = express()

//Bring in environment variables
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env

//Top level middleware
app.use(express.json())
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
)

//Database connection
massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})
  .then((db) => {
    app.set("db", db)
    console.log("Database connected successfully")

    const io = require("socket.io")(
      app.listen(SERVER_PORT, console.log(`Server listening on ${SERVER_PORT}`)),
      {
          cors: {
              origin: true
          }
      }
    )
    app.set('io', io)
    io.on('connection', (socket) => {
        console.log(`${socket.id} connected`)
        socket.on('disconnect', () => {
            console.log(`${socket.id} disconnected`)
        })

        socket.on('send-message', (body) => {
            console.log(body.message)
            io.emit('receive-message', body)
        })
    })
  })
  .catch((err) => console.log(err))

//ENDPOINTS DOWN HERE
