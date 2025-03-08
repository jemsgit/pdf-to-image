import express, { Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import bodyParser from "body-parser";
import Stripe from "stripe";
import archiver from "archiver";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import dotenv from "dotenv";
import { parsePdf } from "./utils/pdf-parser";

console.log(parsePdf);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const upload = multer({ dest: "uploads/" });

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const UserSchema = new mongoose.Schema({
//   email: String,
//   conversions: { type: Number, default: 0 },
//   subscriptionActive: { type: Boolean, default: false },
//   stripeCustomerId: String,
// });

// const User = mongoose.model("User", UserSchema);

// app.get("/user-info", async (req, res) => {
//   const { email } = req.query;
//   let user = await User.findOne({ email });

//   if (!user) {
//     user = await User.create({ email });
//   }

//   res.json(user);
// });

app.post(
  "/convert",
  upload.single("pdf"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    //   const { email } = req.body;
    //   const user = await User.findOne({ email });

    try {
      parsePdf(req.file.path, (resPath) => {
        res.download(resPath, "converted-images.zip", () => {
          fs.unlinkSync(resPath); // Cleanup after download
          //fs.removeSync(outputDir); // Cleanup image files
        });
      });
      // return res.status(200).json({ error: "Conversion failed" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Conversion failed" });
    }

    //   if (user.conversions < 5 || user.subscriptionActive) {
    //     user.conversions += 1;
    //     await user.save();
    //     res.json({ success: true });
    //   } else {
    //     res.json({ paywall: true });
    //   }
  },
);

// app.post("/create-checkout-session", async (req, res) => {
//   const { plan } = req.body;
//   const priceId =
//     plan === "basic"
//       ? process.env.STRIPE_PRICE_BASIC
//       : process.env.STRIPE_PRICE_PRO;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "subscription",
//     line_items: [{ price: priceId, quantity: 1 }],
//     success_url:
//       "https://your-extension.com/success?session_id={CHECKOUT_SESSION_ID}",
//     cancel_url: "https://your-extension.com/cancel",
//   });

//   res.json({ url: session.url });
// });

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     try {
//       const event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );

//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         const customer = await stripe.customers.retrieve(session.customer);

//         await User.findOneAndUpdate(
//           { email: customer.email },
//           { subscriptionActive: true, stripeCustomerId: session.customer }
//         );
//       }

//       res.json({ received: true });
//     } catch (err) {
//       res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//   }
// );

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`1Server running on http://localhost:${PORT}`),
);
