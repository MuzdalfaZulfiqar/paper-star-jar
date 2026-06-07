
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 1. DATABASE CONNECTION (Now using Environment Variables for Render)
// // Make sure to add MONGO_URI in your Render Dashboard -> Environment tab
// const dbURI = process.env.MONGO_URI || "mongodb+srv://muzdalfazulfiqar11_db_user:7KHJEwph2IFbcB0O@cluster0.uy5lulp.mongodb.net/retro_archive";

// mongoose.connect(dbURI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => {
//     console.error("❌ MongoDB Connection Error:", err.message);
//     // This helps you see the REAL error in Render logs
//   });


//   // server/server.js  — add these blocks to your existing file

// const nodemailer = require('nodemailer');
// const cron       = require('node-cron');
// const User       = require('./models/User'); // already imported probably

// // ── EMAIL TRANSPORTER ──────────────────────────────────────────────────────
// // Put these four values in your Render Environment tab (never hardcode them)
// const transporter = nodemailer.createTransport({
//   host:   process.env.SMTP_HOST,   // e.g. smtp.gmail.com
//   port:   Number(process.env.SMTP_PORT) || 587,
//   secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
//   auth: {
//     user: process.env.SMTP_USER,   // your email address
//     pass: process.env.SMTP_PASS,   // app password (not your login password)
//   },
// });

// // ── NOTIFICATION HELPER ────────────────────────────────────────────────────
// async function sendUnlockNotification(toEmail, username, letter) {
//   const formattedDate = new Date(letter.deliverAt).toLocaleDateString('en-US', {
//     year: 'numeric', month: 'long', day: 'numeric'
//   });

//   await transporter.sendMail({
//     from:    `"Letter Vault" <${process.env.SMTP_USER}>`,
//     to:      toEmail,
//     subject: `📬 Your letter from the past has arrived`,
//     html: `
//       <div style="font-family:'Courier New',monospace;max-width:600px;margin:0 auto;
//                   background:#f5ead3;padding:48px;border:2px solid #8d7e6c;">
//         <h1 style="font-size:28px;color:#2c1810;letter-spacing:2px;
//                    text-transform:uppercase;border-bottom:2px solid #8d7e6c;
//                    padding-bottom:16px;">Letter Vault</h1>

//         <p style="color:#5e4b3c;font-size:13px;letter-spacing:3px;
//                   text-transform:uppercase;">Dear ${username},</p>

//         <p style="color:#2c1810;font-size:16px;line-height:1.8;">
//           A letter you sealed on
//           <strong>${new Date(letter.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</strong>
//           was set to arrive today — <strong>${formattedDate}</strong>.
//         </p>

//         <div style="background:#2c1810;color:#f5ead3;padding:32px;
//                     margin:32px 0;border-radius:2px;font-style:italic;
//                     font-size:18px;line-height:1.9;white-space:pre-wrap;">
// ${letter.body}
//         </div>

//         <p style="color:#5e4b3c;font-size:12px;opacity:0.6;
//                   border-top:1px solid #8d7e6c;padding-top:16px;">
//           REF: ${String(letter._id).slice(-8).toUpperCase()} ·
//           Archived by Letter Vault
//         </p>
//       </div>
//     `,
//   });
// }

// // ── CRON JOB — runs every hour ─────────────────────────────────────────────
// // Finds letters whose deliverAt just passed and haven't been emailed yet
// cron.schedule('0 * * * *', async () => {
//   console.log('📬 Checking for letters to deliver...');
//   try {
//     const now = new Date();

//     const dueLetters = await Letter.find({
//       deliverAt:  { $lte: now },
//       emailSent:  false,
//     }).populate('userId', 'email username'); // join User for email + username

//     console.log(`   Found ${dueLetters.length} undelivered letter(s)`);

//     for (const letter of dueLetters) {
//       const user = letter.userId; // populated
//       if (!user?.email) continue;

//       try {
//         await sendUnlockNotification(user.email, user.username, letter);
//         letter.emailSent = true;
//         await letter.save();
//         console.log(`   ✅ Sent to ${user.email} — letter ${letter._id}`);
//       } catch (mailErr) {
//         // Don't crash the loop if one email fails
//         console.error(`   ❌ Failed for ${user.email}:`, mailErr.message);
//       }
//     }
//   } catch (err) {
//     console.error('Cron error:', err.message);
//   }
// });

// // 2. IMPORT MODELS & ROUTES
// const authRoutes = require('./routes/auth');
// const authMiddleware = require('./middleware/auth'); 
// const Letter = require('./models/Letter');

// // 3. MOUNT ROUTES
// app.use('/api/auth', authRoutes);

// // Protected Letter Routes
// app.get('/api/letters', authMiddleware, async (req, res) => {
//   try {
//     const letters = await Letter.find({ userId: req.user.id }).sort({ createdAt: -1 });
//     res.json(letters);
//   } catch (err) { 
//     console.error(err);
//     res.status(500).send("Server Error"); 
//   }
// });

// app.post('/api/letters', authMiddleware, async (req, res) => {
//   try {
//     const newLetter = new Letter({ ...req.body, userId: req.user.id });
//     await newLetter.save();
//     res.json(newLetter);
//   } catch (err) { 
//     console.error(err);
//     res.status(500).send("Server Error"); 
//   }
// });

// app.delete('/api/letters/:id', authMiddleware, async (req, res) => {
//   try {
//     await Letter.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//     res.json({ msg: "Letter deleted" });
//   } catch (err) { 
//     console.error(err);
//     res.status(500).send("Server Error"); 
//   }
// });

// // 4. PORT BINDING (Fix for Render 500/502 errors)
// // Render assigns a random port; process.env.PORT captures it.
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const cron       = require('node-cron');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const dbURI = process.env.MONGO_URI || "mongodb+srv://muzdalfazulfiqar11_db_user:7KHJEwph2IFbcB0O@cluster0.uy5lulp.mongodb.net/retro_archive";
mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

// ── MODELS & MIDDLEWARE ────────────────────────────────────────────────────
const authMiddleware = require('./middleware/auth');
const Letter         = require('./models/Letter');
const User           = require('./models/User');

// ── EMAIL TRANSPORTER ──────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const INK_COLORS = {
  sepia:    { bg: '#2c1a0e', text: '#f5e6c8', accent: '#c8956a' },
  midnight: { bg: '#0a0e2a', text: '#c8d8f5', accent: '#6a8ac8' },
  crimson:  { bg: '#1a0a0a', text: '#f5c8c8', accent: '#c86a6a' },
  forest:   { bg: '#0a1a0e', text: '#c8f5d2', accent: '#6ac87a' },
  slate:    { bg: '#0e0e12', text: '#d2d2e0', accent: '#8a8ab0' },
};

async function sendUnlockEmail(toEmail, username, letter, senderName) {
  const ink = INK_COLORS[letter.inkMood] || INK_COLORS.sepia;
  const formattedDate = new Date(letter.deliverAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const sealedDate = new Date(letter.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const isSelf = !letter.recipientId || String(letter.recipientId) === String(letter.userId);
  const fromLine = isSelf
    ? `yourself on ${sealedDate}`
    : letter.isAnonymous ? 'an anonymous sender' : `<strong>${senderName}</strong>`;

  await transporter.sendMail({
    from:    `"Starmail" <${process.env.SMTP_USER}>`,
    to:      toEmail,
    subject: `✦ A letter has arrived for you`,
    html: `
      <div style="font-family:'Courier New',monospace;max-width:580px;margin:0 auto;background:${ink.bg};padding:52px 48px;border-radius:4px;">
        <div style="border-bottom:1px solid ${ink.accent}33;padding-bottom:20px;margin-bottom:32px;">
          <span style="color:${ink.accent};font-size:11px;letter-spacing:4px;text-transform:uppercase;">✦ Starmail</span>
        </div>
        <p style="color:${ink.text}99;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;">
          Dear ${username},
        </p>
        <p style="color:${ink.text};font-size:15px;line-height:1.8;margin-bottom:32px;">
          A letter written to you by ${fromLine} — sealed for <strong>${formattedDate}</strong> — has arrived in your constellation.
        </p>
        <div style="background:${ink.accent}15;border-left:3px solid ${ink.accent};padding:28px 32px;margin:32px 0;font-style:italic;font-size:17px;line-height:1.9;color:${ink.text};white-space:pre-wrap;border-radius:0 4px 4px 0;">
${letter.body}
        </div>
        <p style="color:${ink.text}40;font-size:11px;border-top:1px solid ${ink.accent}22;padding-top:20px;margin-top:32px;letter-spacing:2px;">
          REF ${String(letter._id).slice(-8).toUpperCase()} · STARMAIL CONSTELLATION
        </p>
      </div>
    `,
  });
}

// ── CRON — every hour ──────────────────────────────────────────────────────
cron.schedule('0 * * * *', async () => {
  console.log('✦ Scanning for due letters...');
  try {
    const now = new Date();
    const due = await Letter.find({ deliverAt: { $lte: now }, emailSent: false })
      .populate('userId',      'email username')
      .populate('recipientId', 'email username');

    for (const letter of due) {
      const isSelf = !letter.recipientId;
      const recipient = isSelf ? letter.userId : letter.recipientId;
      const sender    = letter.userId;

      if (!recipient?.email) continue;
      try {
        await sendUnlockEmail(recipient.email, recipient.username, letter, sender?.username);
        letter.emailSent = true;
        await letter.save();
        console.log(`  ✅ Delivered to ${recipient.email}`);
      } catch (e) {
        console.error(`  ❌ Mail failed for ${recipient.email}:`, e.message);
      }
    }
  } catch (err) {
    console.error('Cron error:', err.message);
  }
});

// ── ROUTES ─────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));

// GET /api/letters — own letters (sent by me to myself, OR received by me)
app.get('/api/letters', authMiddleware, async (req, res) => {
  try {
    // Letters I wrote to myself
    const selfLetters = await Letter.find({ userId: req.user.id, recipientId: null });
    // Letters dispatched TO me by others
    const received    = await Letter.find({ recipientId: req.user.id })
      .populate('userId', 'username');
    // Letters I sent to others (outbox)
    const sent        = await Letter.find({ userId: req.user.id, recipientId: { $ne: null } })
      .populate('recipientId', 'username');

    res.json({ selfLetters, received, sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// POST /api/letters — write a letter (to self or dispatch)
app.post('/api/letters', authMiddleware, async (req, res) => {
  try {
    const { body, deliverAt, inkMood, recipientUsername, isAnonymous } = req.body;

    let recipientId = null;
    if (recipientUsername) {
      const recipient = await User.findOne({ username: recipientUsername });
      if (!recipient) return res.status(404).json({ msg: 'Recipient not found' });
      recipientId = recipient._id;
    }

    const letter = new Letter({
      userId: req.user.id,
      body,
      deliverAt,
      inkMood: inkMood || 'sepia',
      recipientId,
      isAnonymous: isAnonymous || false,
    });
    await letter.save();
    res.json(letter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// PATCH /api/letters/:id/read — mark letter as read
app.patch('/api/letters/:id/read', authMiddleware, async (req, res) => {
  try {
    const letter = await Letter.findOne({
      _id: req.params.id,
      $or: [{ userId: req.user.id }, { recipientId: req.user.id }]
    });
    if (!letter) return res.status(404).json({ msg: 'Not found' });
    if (!letter.readAt) {
      letter.readAt = new Date();
      await letter.save();
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE /api/letters/:id
app.delete('/api/letters/:id', authMiddleware, async (req, res) => {
  try {
    await Letter.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ── START ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Starmail server on port ${PORT}`));