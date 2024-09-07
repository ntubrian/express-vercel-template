import express, { NextFunction } from "express";
import cors from "cors";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  InsertActivity,
  InsertProposal,
  proposalsTable,
  activitiesTable,
  InsertPost,
  postsTable,
  InsertUser,
  usersTable,
  InsertComment,
  commentsTable,
  InsertLike,
  likesTable,
  InsertVisit,
  visitsTable,
  SelectPost,
  SelectComment,
} from "./schema.js";
import { eq, and, desc } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/v1/users", (req, res) => {
  res.send([{ id: 1, name: "John Doe" }]);
});

app.get("/fetchUserData", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(200).json(existingUser[0]);
    } else {
      res
        .status(404)
        .json({ error: "User not found. Please create an user first." });
    }
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/fetchActivities", async (req, res) => {
  try {
    const proposals = await db
      .select({
        proposal: {
          id: proposalsTable.id,
          description: proposalsTable.description,
          image: proposalsTable.image,
          userId: proposalsTable.userId,
          status: proposalsTable.status,
          createdAt: proposalsTable.createdAt,
        },
        user: {
          id: usersTable.id,
          name: usersTable.name, // Assuming there's a name field in the users table
        },
      })
      .from(proposalsTable)
      .leftJoin(usersTable, eq(proposalsTable.userId, usersTable.id))
      .orderBy(proposalsTable.createdAt)
      .limit(99);

    const canvasDrafts = proposals.map(({ proposal, user }) => ({
      id: proposal.id,
      name: proposal.description,
      introduction: proposal.description,
      address: {
        text: "臺北市中山區圓山里8鄰中山北路三段181號",
        map: "https://maps.app.goo.gl/sQKx4n3WctXuS5Bw8",
        longitude: "123",
        latitude: "132",
      },
      img_url: proposal.image,
      start: proposal.createdAt.toISOString(),
      status: proposal.status,
      author: user?.name || "Unknown",
    }));

    res.status(200).json(canvasDrafts);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/fetchPosts", async (req, res) => {
  try {
    const { activityId }: SelectPost = req.body;
    const posts = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.activityId, activityId))
      .orderBy(desc(postsTable.createdAt))
      .limit(99);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/fetchComments", async (req, res) => {
  try {
    const { postId }: SelectComment = req.body;
    const comments = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.postId, postId))
      .orderBy(desc(commentsTable.createdAt))
      .limit(99);

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createUser", async (req, res) => {
  try {
    const { name, age, email }: InsertUser = req.body;

    // Validate input
    if (!name || !age || !email) {
      return res
        .status(400)
        .json({ error: "Description, image, and activityId are required" });
    }

    // Insert new proposal
    const newUser = await db
      .insert(usersTable)
      .values({ name, age, email })
      .returning();

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createProposal", async (req, res) => {
  try {
    const { description, image, userId }: InsertProposal = req.body;

    // Validate input
    if (!description || !image || !userId) {
      return res
        .status(400)
        .json({ error: "Description and image are required" });
    }

    // Insert new proposal
    const newProposal = await db
      .insert(proposalsTable)
      .values({ description, image, userId })
      .returning();

    res.status(201).json(newProposal[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createActivity", async (req, res) => {
  try {
    const { description, image, proposalId }: InsertActivity = req.body;

    // Validate input
    if (!description || !image || !proposalId) {
      return res
        .status(400)
        .json({ error: "Description, image and proposal ID are required" });
    }

    // Insert new user
    const newActivity = await db
      .insert(activitiesTable)
      .values({ description, image, proposalId })
      .returning();

    res.status(201).json(newActivity[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createPost", async (req, res) => {
  try {
    const { activityId, description, image, userId }: InsertPost = req.body;

    // Validate input
    if (!description || !image || !activityId || !userId) {
      return res
        .status(400)
        .json({ error: "Description, image, and activityId are required" });
    }

    // Insert new post
    const newPost = await db
      .insert(postsTable)
      .values({ activityId, description, image, userId })
      .returning();

    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createComment", async (req, res) => {
  try {
    const { postId, content, userId }: InsertComment = req.body;

    // Validate input
    if (!postId || !content || !userId) {
      return res
        .status(400)
        .json({ error: "Post, content, and userId are required" });
    }

    // Insert new proposal
    const newComment = await db
      .insert(commentsTable)
      .values({ postId, content, userId })
      .returning();

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/like", async (req, res) => {
  try {
    const { userId, postId }: InsertLike = req.body;

    // Validate input
    if (!postId || !userId) {
      return res.status(400).json({ error: "Post and userId are required" });
    }

    const existingLike = await db
      .select()
      .from(likesTable)
      .where(and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)))
      .limit(1);

    if (existingLike.length > 0) {
      // Like exists, so remove it
      await db
        .delete(likesTable)
        .where(
          and(eq(likesTable.userId, userId), eq(likesTable.postId, postId))
        );

      res.status(200).json({ message: "Like removed successfully" });
    } else {
      // Like doesn't exist, so add it
      const newLike = await db
        .insert(likesTable)
        .values({ userId, postId })
        .returning();

      res.status(201).json(newLike[0]);
    }
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/visit", async (req, res) => {
  try {
    const { userId, spotId }: InsertVisit = req.body;

    // Validate input
    if (!spotId || !userId) {
      return res.status(400).json({ error: "Spot and userId are required" });
    }

    const existingVisit = await db
      .select()
      .from(visitsTable)
      .where(
        and(eq(visitsTable.userId, userId), eq(visitsTable.spotId, spotId))
      )
      .limit(1);

    if (existingVisit.length > 0) {
      res.status(200).json({ message: "You have already visited this place." });
    } else {
      // Like doesn't exist, so add it
      const newVisit = await db
        .insert(visitsTable)
        .values({ userId, spotId })
        .returning();

      res.status(201).json(newVisit[0]);
    }
  } catch (error) {
    console.error("Error visiting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/test", async (req, res) => {
  try {
    const [result] = await db
      .select({
        activity: activitiesTable,
        proposal: proposalsTable,
      })
      .from(activitiesTable)
      .innerJoin(
        proposalsTable,
        eq(activitiesTable.proposalId, proposalsTable.id)
      )
      .where(eq(activitiesTable.id, "0ce544f4-14fa-4816-9b2f-510749e35655"))
      .limit(1);

    if (result) {
      res.send([
        {
          Activity: result.activity.description,
          Proposal: result.proposal.description,
        },
      ]);
    } else {
      res.status(404).json({ error: "No activity found with the given ID" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.info("Server is running on http://localhost:3000");
});
