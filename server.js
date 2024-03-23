const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const PORT = 3001;

app.use(bodyParser.json());

const uri =
  "mongodb+srv://ahmedrazakhatri27:AP3ayUS55X4QBBZQ@cluster0.lqcdd02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToDatabase();

// Create a collection to keep track of counts
async function createCountCollection() {
  try {
    await client.db().createCollection("counts");
    console.log("Counts collection created");
  } catch (err) {
    console.error("Error creating counts collection:", err);
  }
}

async function createUsersCollection() {
  try {
    await client.db().createCollection("users");
    console.log("users collection created");
  } catch (err) {
    console.error("Error creating counts collection:", err);
  }
}

createCountCollection();

createUsersCollection();

// Function to update count document
async function updateCountDocument(operation, count = 1) {
  try {
    const collection = client.db().collection("counts");
    // Upsert: Update existing document or insert if not exists
    await collection.updateOne(
      { _id: operation },
      { $inc: { count } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Error updating count document:", err);
  }
}

// API to add data
app.post("/api/add", async (req, res) => {
  try {
    const newData = req.body;
    const collection = client.db().collection("users");
    await collection.insertOne(newData);
    // Increment insert count
    await updateCountDocument("insert");
    res.json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error("Error inserting data into MongoDB:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to edit data
app.put("/api/edit/:id", async (req, res) => {
  try {
    const collection = client.db().collection("users");
    const id = req.params.id;
    const newData = req.body;

    // Update the record with the specified ID
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Filter criteria
      { $set: newData } // New data to set
    );

    if (result.modifiedCount === 1) {
      // Increment update count
      await updateCountDocument("update");
      res.json({ message: "Record updated successfully" });
    } else {
      res.status(404).json({ error: "Record not found" });
    }
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API to get the count
app.get("/api/count", async (req, res) => {
  try {
    const collection = client.db().collection("counts");
    // Fetch documents for both insert and update counts
    const insertCountDocument = await collection.findOne({ _id: "insert" });
    const updateCountDocument = await collection.findOne({ _id: "update" });
    // Combine both counts into a single response object
    const countDocuments = {
      insertCount: insertCountDocument ? insertCountDocument.count : 0,
      updateCount: updateCountDocument ? updateCountDocument.count : 0,
    };
    res.json(countDocuments);
  } catch (err) {
    console.error("Error getting count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
