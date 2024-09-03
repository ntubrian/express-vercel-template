import express, { NextFunction } from 'express'
import cors from 'cors'

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.get('/api/v1/users', (req, res) => {
  res.send([{ id: 1, name: 'John Doe' }]);
})

app.listen(3000, () => {
  console.info('Server is running on http://localhost:3000')
})