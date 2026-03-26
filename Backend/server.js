const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

/* ========================= MONGOOSE CONNECT ========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => { console.error("❌ MongoDB Error:", err.message); process.exit(1); });

/* ========================= SCHEMAS ========================= */
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  formData: { type: Object, required: true },
}, { timestamps: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const OTP = mongoose.model("OTP", otpSchema);

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  rooms: { type: Number, default: 1 },
  roomType: { type: String, enum: ["deluxe", "suite", "royal"], default: "deluxe" },
  specialRequests: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "confirmed" },
}, { timestamps: true });
const Booking = mongoose.model("Booking", bookingSchema);

/* ========================= GENERATE BOOKING ID ========================= */
const generateBookingId = () => {
  const prefix = "HF";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

/* ========================= GOOGLE SCRIPT EMAIL HELPER ========================= */
const sendEmailViaGoogleScript = async (to, subject, htmlContent) => {
  try {
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: to, subject: subject, html: htmlContent })
    });
    
    if (!response.ok) {
      console.error("Google Script Error:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to trigger Google Script:", error);
  }
};

/* ========================= SEND OTP EMAIL ========================= */
const sendOtpEmail = async (to, name, otp) => {
  const subject = "Hotel Frontier — Verify Your Booking OTP";
  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; background: #111111; }
          .header { background: linear-gradient(135deg, #0a0a0a, #1a1a1a); padding: 48px 40px; text-align: center; border-bottom: 2px solid #C9A84C; }
          .hotel-name { font-size: 32px; font-weight: 300; color: #ffffff; letter-spacing: 2px; }
          .hotel-name span { color: #C9A84C; }
          .tagline { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #C9A84C; margin-top: 8px; }
          .body { padding: 48px 40px; }
          .greeting { font-size: 16px; color: #cccccc; margin-bottom: 24px; line-height: 1.6; }
          .otp-box { background: #1a1a1a; border: 1px solid rgba(201,168,76,0.3); padding: 32px; text-align: center; margin: 32px 0; }
          .otp-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #C9A84C; margin-bottom: 16px; }
          .otp-code { font-size: 48px; font-weight: 700; color: #C9A84C; letter-spacing: 12px; }
          .valid-note { font-size: 12px; color: #666; margin-top: 12px; }
          .warning { font-size: 13px; color: #888; background: rgba(255,255,255,0.03); padding: 16px 20px; border-left: 3px solid rgba(201,168,76,0.4); margin: 24px 0; line-height: 1.6; }
          .footer { background: #0a0a0a; padding: 32px 40px; text-align: center; border-top: 1px solid rgba(201,168,76,0.15); }
          .footer-text { font-size: 12px; color: #444; line-height: 1.8; }
          .footer-hotel { color: #C9A84C; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="hotel-name">Hotel <span>Frontier</span></div>
            <div class="tagline">Kota · Rajasthan</div>
          </div>
          <div class="body">
            <p class="greeting">Dear <strong style="color:#fff">${name}</strong>,<br><br>
            Thank you for choosing Hotel Frontier. Please use the following One-Time Password to complete your booking verification.</p>
            <div class="otp-box">
              <div class="otp-label">Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div class="valid-note">Valid for 10 minutes only</div>
            </div>
            <div class="warning">
              🔒 For your security, never share this OTP with anyone. Hotel Frontier staff will never ask for your OTP.
            </div>
          </div>
          <div class="footer">
            <div class="footer-text">
              <span class="footer-hotel">Hotel Frontier</span><br>
              Station Road, Kota, Rajasthan 324001<br>
              +91 98765 43210 · reservations@hotelfrontier.com
            </div>
          </div>
        </div>
      </body>
      </html>
  `;
  
  await sendEmailViaGoogleScript(to, subject, html);
};

/* ========================= SEND CONFIRMATION EMAIL ========================= */
const sendConfirmationEmail = async (booking) => {
  const roomPrices = { deluxe: 3499, suite: 6999, royal: 12999 };
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const total = (roomPrices[booking.roomType] || 3499) * booking.rooms * Math.max(1, nights);

  const subject = `Booking Confirmed — ${booking.bookingId}`;
  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; background: #111111; }
          .header { background: linear-gradient(135deg, #0a0a0a, #1a1a1a); padding: 48px 40px; text-align: center; border-bottom: 2px solid #C9A84C; }
          .hotel-name { font-size: 32px; font-weight: 300; color: #ffffff; letter-spacing: 2px; }
          .hotel-name span { color: #C9A84C; }
          .booking-id-box { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); padding: 20px 32px; margin: 32px 40px 0; text-align: center; }
          .bid-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #C9A84C; }
          .bid-value { font-size: 24px; font-weight: 700; color: #C9A84C; letter-spacing: 3px; margin-top: 8px; }
          .body { padding: 32px 40px 48px; }
          .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.06); margin: 24px 0; }
          .detail-cell { background: #1a1a1a; padding: 16px 20px; }
          .cell-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; margin-bottom: 6px; }
          .cell-value { font-size: 14px; color: #ffffff; }
          .total-row { background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin: 20px 0; }
          .footer { background: #0a0a0a; padding: 32px 40px; text-align: center; border-top: 1px solid rgba(201,168,76,0.15); }
          .footer-text { font-size: 12px; color: #444; line-height: 1.8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size:36px;margin-bottom:12px">✅</div>
            <div class="hotel-name">Hotel <span>Frontier</span></div>
            <div style="font-size:14px;color:#aaa;margin-top:12px;letter-spacing:1px">Your booking is confirmed!</div>
          </div>
          <div class="booking-id-box">
            <div class="bid-label">Booking ID</div>
            <div class="bid-value">${booking.bookingId}</div>
          </div>
          <div class="body">
            <p style="color:#aaa;font-size:15px;line-height:1.7;margin-bottom:24px">
              Dear <strong style="color:#fff">${booking.guestName}</strong>, we're delighted to confirm your reservation at Hotel Frontier.
            </p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              ${[
                ["Guest Name", booking.guestName],
                ["Email", booking.email],
                ["Mobile", booking.mobile],
                ["Room Type", booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)],
                ["Check-in", booking.checkIn],
                ["Check-out", booking.checkOut],
                ["No. of Rooms", booking.rooms],
                ["Adults", booking.adults],
                ["Children", booking.children],
              ].map(([k, v]) => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
                  <td style="padding:12px 16px;color:#888;font-size:11px;letter-spacing:1px;text-transform:uppercase;width:40%;background:#1a1a1a">${k}</td>
                  <td style="padding:12px 16px;color:#fff;background:#161616">${v}</td>
                </tr>
              `).join("")}
            </table>
            <div class="total-row">
              <span style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C">Estimated Total (${nights} night${nights > 1 ? "s" : ""})</span>
              <span style="font-size:24px;font-weight:700;color:#C9A84C">₹${total.toLocaleString()}</span>
            </div>
            ${booking.specialRequests ? `<p style="font-size:13px;color:#888;background:rgba(255,255,255,0.03);padding:16px;border-left:3px solid rgba(201,168,76,0.3)"><strong style="color:#C9A84C">Special Requests:</strong> ${booking.specialRequests}</p>` : ""}
          </div>
          <div class="footer">
            <div class="footer-text">
              <span style="color:#C9A84C">Hotel Frontier</span><br>
              Station Road, Kota, Rajasthan 324001<br>
              +91 98765 43210 · reservations@hotelfrontier.com
            </div>
          </div>
        </div>
      </body>
      </html>
  `;
  
  await sendEmailViaGoogleScript(booking.email, subject, html);
};

/* ========================= SEND CANCELLATION EMAIL ========================= */
const sendCancellationEmail = async (booking) => {
  const subject = `Booking Cancelled — ${booking.bookingId}`;
  const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; background: #111111; border-top: 4px solid #d93838; }
          .header { padding: 40px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .hotel-name { font-size: 28px; font-weight: 300; color: #ffffff; letter-spacing: 2px; }
          .hotel-name span { color: #C9A84C; }
          .body { padding: 40px; color: #cccccc; line-height: 1.7; }
          .warning-box { background: rgba(217,56,56,0.08); border: 1px solid rgba(217,56,56,0.3); padding: 20px; text-align: center; margin: 24px 0; }
          .footer { background: #0a0a0a; padding: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size:32px;margin-bottom:12px">❌</div>
            <div class="hotel-name">Hotel <span>Frontier</span></div>
          </div>
          <div class="body">
            <p>Dear <strong style="color:#fff">${booking.guestName}</strong>,</p>
            <div class="warning-box">
              <strong style="color:#d93838; font-size:18px; letter-spacing: 1px; text-transform: uppercase;">Booking Cancelled</strong><br>
              <span style="color:#aaa; font-size:13px; margin-top:8px; display:inline-block; letter-spacing: 2px;">ID: ${booking.bookingId}</span>
            </div>
            <p>We are writing to sincerely apologize, but we have had to cancel your upcoming reservation. This was due to an unforeseen issue regarding room availability.</p>
            <p>If you made any pre-payments, they will be automatically refunded to your original payment method shortly.</p>
            <p>We deeply value your understanding and hope to have the opportunity to host you properly in the future under better circumstances.</p>
          </div>
          <div class="footer">
            Hotel Frontier · Station Road, Kota, Rajasthan<br>
            Contact us: +91 98765 43210
          </div>
        </div>
      </body>
      </html>
  `;
  
  await sendEmailViaGoogleScript(booking.email, subject, html);
};

/* ========================= ROUTES ========================= */

// Send OTP
app.post("/api/booking/send-otp", async (req, res) => {
  try {
    const { email, guestName, ...rest } = req.body;
    if (!email || !guestName) return res.status(400).json({ success: false, message: "Email and name are required" });

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OTP.create({ email, otp, expiresAt, formData: req.body });
    await sendOtpEmail(email, guestName, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP. Check email configuration." });
  }
});

// Confirm Booking (verify OTP + save)
app.post("/api/booking/confirm", async (req, res) => {
  try {
    const { otp, email, ...bookingData } = req.body;
    if (!otp || !email) return res.status(400).json({ success: false, message: "OTP and email required" });

    const record = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ success: false, message: "No OTP found. Please request again." });
    if (record.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (new Date() > record.expiresAt) return res.status(400).json({ success: false, message: "OTP expired. Please request again." });

    const bookingId = generateBookingId();
    const booking = await Booking.create({
      bookingId,
      guestName: record.formData.guestName,
      email: record.formData.email,
      mobile: record.formData.mobile,
      address: record.formData.address,
      checkIn: record.formData.checkIn,
      checkOut: record.formData.checkOut,
      adults: parseInt(record.formData.adults) || 1,
      children: parseInt(record.formData.children) || 0,
      rooms: parseInt(record.formData.rooms) || 1,
      roomType: record.formData.roomType || "deluxe",
      specialRequests: record.formData.specialRequests,
      status: "confirmed",
    });

    // Clean up OTP
    await OTP.deleteMany({ email });

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(booking).catch(err => console.error("Confirmation email error:", err));

    res.json({ success: true, bookingId, message: "Booking confirmed!" });
  } catch (err) {
    console.error("Confirm Booking Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ========================= ADMIN ROUTES ========================= */

// Admin login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const validPassword = password === process.env.ADMIN_PASSWORD;
  if (!validPassword) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ success: true, token });
});

// Middleware: verify admin token
const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") throw new Error();
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// Get all bookings
app.get("/api/admin/bookings", authAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get single booking
app.get("/api/admin/bookings/:id", authAdmin, async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, booking });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update booking status
app.patch("/api/admin/bookings/:id/status", authAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.id },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, booking });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete booking & send cancellation email
app.delete("/api/admin/bookings/:id", authAdmin, async (req, res) => {
  try {
    // findOneAndDelete returns the document it just deleted so we can use its data
    const deletedBooking = await Booking.findOneAndDelete({ bookingId: req.params.id });
    
    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Trigger the apology email in the background
    sendCancellationEmail(deletedBooking).catch(err => console.error("Cancel email error:", err));
    
    res.json({ success: true, message: "Deleted successfully and email sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ========================= AUTO-CLEANUP (CRON JOB) ========================= */
const cron = require("node-cron");

// This cron job runs automatically every day at midnight (00:00) server time
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🧹 Running daily cleanup of old bookings...");
    
    // Calculate the exact date for 5 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    
    // Convert it to a "YYYY-MM-DD" string so it perfectly matches your checkOut format
    const cutoffDate = fiveDaysAgo.toISOString().split("T")[0];

    // Find and delete all bookings where the checkOut date is older than the cutoff
    const result = await Booking.deleteMany({ checkOut: { $lt: cutoffDate } });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Auto-Cleanup: Deleted ${result.deletedCount} old bookings.`);
    } else {
      console.log("ℹ️ Auto-Cleanup: No old bookings to delete today.");
    }
  } catch (err) {
    console.error("❌ Auto-cleanup error:", err);
  }
});

/* ========================= START SERVER ========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hotel Frontier Server running on http://localhost:${PORT}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER}`);
  console.log(`🗄️  MongoDB: Connected`);
});