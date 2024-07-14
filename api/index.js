const URI = "mongodb+srv://matzsolutions:2VVG2QxBAMub9Oaz@cluster0.gyal2.mongodb.net";
const DB_NAME = "healthcare";

const CATEGORY_MAPPINGS = {
    "nursing-homes": "nursingHomenew",
    "memory-care": "memoryCare",
    "in-home-care": "inHomeCare",
    "inpatient-rehabilitations": "inpatientrehabilitiations",
};

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
const client = new MongoClient(URI);
client.connect();

const database = client.db(DB_NAME);
console.log("Connected to MongoDB!");

// const getSortedData = async (collection, query, top) => {
//     if (top) {
//         query.scrapedAverageRating = { $exists: true };
//     }
//     const sortCriteria = top ? { scrapedAverageRating: -1, name: 1 } : { name: 1 };
//     const data = await collection.find(query).sort(sortCriteria).limit(5).toArray();
//     return data;
// };

// app.get("/api/:collectionKeyword", async (req, res) => {
//     try {
//         const { collectionKeyword } = req.params;
//         const { top } = req.query;
//         const collection = database.collection(collectionKeyword);
//         const sortCriteria = top ? { scrapedAverageRating: -1, name: 1 } : { name: 1 };
//         const data = await collection.find().sort(sortCriteria).limit(5).toArray();

//         res.json(data);
//     } catch (err) {
//         console.error(`Something went wrong trying to find the documents: ${err}\n`);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // Route to fetch by zip code
// app.get("/api/:collectionKeyword/zipCode/:zipCode", async (req, res) => {
//     try {
//         const { zipCode, collectionKeyword } = req.params;
//         const { top } = req.query;
//         const collection = database.collection(collectionKeyword);
//         const data = await getSortedData(collection, { zipCode }, top);
//         res.json(data);
//     } catch (err) {
//         console.error(`Error fetching ${collectionKeyword} by zip code: ${err}`);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
// app.get("/api/:collectionKeyword/city/:city", async (req, res) => {
//     const { collectionKeyword, city } = req.params;
//     try {
//         const { top } = req.query;
//         const collection = database.collection(collectionKeyword);
//         const data = await getSortedData(collection, { city }, top);
//         res.json(data);
//     } catch (err) {
//         console.error(`Something went wrong trying to find the documents: ${err}\n`);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });
// app.get("/api/:collectionKeyword/state/:state", async (req, res) => {
//     const { collectionKeyword, state } = req.params;
//     try {
//         const { top } = req.query;
//         const collection = database.collection(collectionKeyword);
//         const data = await getSortedData(collection, { state }, top);
//         res.json(data);
//     } catch (err) {
//         console.error(`Something went wrong trying to find the documents: ${err}\n`);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

app.get("/", (req, res) => {
    res.send("Welcome to the Nursing Home API 2.0");
});

app.get("/api/:category/fetch", async (req, res) => {
    try {
        var { category } = req.params;
        category = CATEGORY_MAPPINGS[category];

        const { zipCode, state, city, name, top } = req.query;

        let filters = {};

        console.log("FETCHING ...");
        console.log(zipCode, state, city, name, category);

        if (zipCode) {
            filters.zipCode = zipCode;
        }

        if (state) {
            filters.state = state;
        }

        if (city) {
            filters.city = city;
        }

        if (name) {
            filters.name = name;
        }

        const collection = database.collection(category);
        const data = await collection.find(filters).sort({ name: 1 }).limit(7).toArray();

        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
