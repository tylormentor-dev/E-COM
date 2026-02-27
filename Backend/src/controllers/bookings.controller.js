import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const createBooking = asyncHandler(async (req, res) => {
  const buyerId = req.user.id;
  const { mechanic_id, service_category, booking_date, price_offer } = req.body;

  const [mechanicRows] = await query(
    `
    SELECT m.id, m.subscription_status, m.verified
    FROM mechanics m
    WHERE m.id = ?
    `,
    [mechanic_id],
  );

  if (!mechanicRows.length) throw new ApiError(404, "Mechanic not found");
  const mechanic = mechanicRows[0];

  if (!mechanic.verified) {
    throw new ApiError(403, "Mechanic must be admin-verified");
  }
  if (mechanic.subscription_status !== "active") {
    throw new ApiError(
      403,
      "Mechanic needs an active subscription before receiving bookings",
    );
  }

  const [result] = await query(
    `
    INSERT INTO bookings (mechanic_id, buyer_id, service_category, booking_date, price_offer, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
    `,
    [mechanic_id, buyerId, service_category, booking_date, price_offer],
  );

  return res.status(201).json({ id: result.insertId });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const bookingId = Number(req.params.id);
  const { status } = req.body;

  const [bookingRows] = await query(
    `
    SELECT b.id, b.mechanic_id, m.user_id AS mechanic_user_id
    FROM bookings b
    JOIN mechanics m ON m.id = b.mechanic_id
    WHERE b.id = ?
    `,
    [bookingId],
  );
  if (!bookingRows.length) throw new ApiError(404, "Booking not found");

  const booking = bookingRows[0];
  if (booking.mechanic_user_id !== req.user.id) {
    throw new ApiError(403, "Only the assigned mechanic can change status");
  }

  await query("UPDATE bookings SET status = ? WHERE id = ?", [status, bookingId]);
  return res.json({ message: "Booking status updated" });
});

export const getMechanicBookings = asyncHandler(async (req, res) => {
  const [mechanicRows] = await query(
    `
    SELECT m.id, u.city
    FROM mechanics m
    JOIN users u ON u.id = m.user_id
    WHERE m.user_id = ?
    `,
    [req.user.id],
  );
  if (!mechanicRows.length) throw new ApiError(404, "Mechanic profile missing");

  const mechanic = mechanicRows[0];
  const [rows] = await query(
    `
    SELECT b.*, bu.name AS buyer_name, bu.city AS buyer_city
    FROM bookings b
    JOIN users bu ON bu.id = b.buyer_id
    WHERE b.mechanic_id = ? AND bu.city = ?
    ORDER BY b.booking_date DESC
    `,
    [mechanic.id, mechanic.city],
  );

  return res.json(rows);
});

export const getBuyerBookings = asyncHandler(async (req, res) => {
  const [rows] = await query(
    `
    SELECT b.*, m.workshop_name
    FROM bookings b
    JOIN mechanics m ON m.id = b.mechanic_id
    WHERE b.buyer_id = ?
    ORDER BY b.booking_date DESC
    `,
    [req.user.id],
  );
  return res.json(rows);
});
