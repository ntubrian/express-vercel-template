import express, { NextFunction } from 'express'
import cors from 'cors'
import {neon} from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { InsertActivity, InsertProposal, proposalsTable, activitiesTable } from './schema.js';
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
    const { description, image, author }: InsertProposal = req.body;

    // Validate input
    if (!description || !image || !author) {
      return res.status(400).json({ error: 'Description and image are required' });
    }

    // Insert new proposal
    const newProposal = await db.insert(proposalsTable)
      .values({ description, image, author })
      .returning();

    res.status(201).json(newProposal[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.post('/createActivity', async (req, res) => {
  try {
    const { description, image, proposalId }: InsertActivity = req.body;

    // Validate input
    if (!description || !image || !proposalId) {
      return res.status(400).json({ error: 'Description, image and proposal ID are required' });
    }

    // Insert new user
    const newActivity = await db.insert(activitiesTable)
      .values({ description, image, proposalId })
      .returning();

    res.status(201).json(newActivity[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

app.listen(3000, () => {
  console.info('Server is running on http://localhost:3000')
})