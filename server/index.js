// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const Star = require('./models/Star');

// const app = express();
// app.use(cors());
// app.use(express.json());
// // Connect to MongoDB
// mongoose.connect("mongodb+srv://muzdalfazulfiqar11_db_user:7KHJEwph2IFbcB0O@cluster0.uy5lulp.mongodb.net/")
//   .then(() => console.log("Connected to the Star Jar Database"))
//   .catch(err => console.log(err));
// // GET only the letters belonging to the logged-in user
// app.get('/api/letters', auth, async (req, res) => {
//   const letters = await Letter.find({ userId: req.user.id }).sort({ createdAt: -1 });
//   res.json(letters);
// });

// // SAVE a letter linked to the user's ID
// app.post('/api/letters', auth, async (req, res) => {
//   const newLetter = new Letter({
//     ...req.body,
//     userId: req.user.id
//   });
//   await newLetter.save();
//   res.json(newLetter);
// });

// const PORT =  5000;
// app.listen(PORT, () => console.log(`Server floating on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
mongoose.connect("mongodb+srv://muzdalfazulfiqar11_db_user:7KHJEwph2IFbcB0O@cluster0.uy5lulp.mongodb.net/retro_archive")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// 2. IMPORT MODELS & ROUTES
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth'); // Your auth.js middleware
const Letter = require('./models/Letter');

// 3. MOUNT ROUTES
app.use('/api/auth', authRoutes);

// Protected Letter Routes
app.get('/api/letters', authMiddleware, async (req, res) => {
  try {
    const letters = await Letter.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) { res.status(500).send("Server Error"); }
});

app.post('/api/letters', authMiddleware, async (req, res) => {
  try {
    const newLetter = new Letter({ ...req.body, userId: req.user.id });
    await newLetter.save();
    res.json(newLetter);
  } catch (err) { res.status(500).send("Server Error"); }
});

app.delete('/api/letters/:id', authMiddleware, async (req, res) => {
  try {
    await Letter.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: "Letter deleted" });
  } catch (err) { res.status(500).send("Server Error"); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));