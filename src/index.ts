import express, { NextFunction } from 'express'
import cors from 'cors'
import {neon} from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { InsertProposal, proposalsTable } from './schema.js';
import dotenv from 'dotenv'

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
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

app.post('/createProposal', async (req, res) => {
  try {
    const { text, image }: InsertProposal = req.body;

    // Validate input
    if (!text || !image) {
      return res.status(400).json({ error: 'Description and image are required' });
    }

    // Insert new user
    const newProposal = await db.insert(proposalsTable)
      .values({ text, image })
      .returning();

    res.status(201).json(newProposal[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(3000, () => {
  console.info('Server is running on http://localhost:3000')
})