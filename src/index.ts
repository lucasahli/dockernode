import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.json({ hello: "World of express works"})
})

const port = Number(process.env.PORT || 8080) 
app.listen(port, "0.0.0.0", () => {
    console.log(`Server listenging at http://localhost:${port}`)
})

console.log("Hello World Luca")