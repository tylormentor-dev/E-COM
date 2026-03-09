import { query } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getPagination } from "../utils/pagination.js";
import { upsertSubscriptionForUser } from "../services/subscription.service.js";

export const listMechanics = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const { page, limit, offset } = getPagination(req.query);

  const filters = ["m.verified = true", "m.subscription_status = 'active'"];
  const params = [];

  if (city) {
    filters.push("u.city = ?");
    params.push(city);
  }

  const whereSql = `WHERE ${filters.join(" AND ")}`;

  const [rows] = await query(
    `
    SELECT m.id, m.workshop_name, m.service_categories, m.subscription_plan, m.subscription_status, m.rating_avg, m.verified,
           u.id AS user_id, u.name, u.email, u.phone, u.city
    FROM mechanics m
    JOIN users u ON u.id = m.user_id
    ${whereSql}
    ORDER BY m.rating_avg DESC, m.id DESC
    LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  return res.json({ page, limit, data: rows });
});

export const getMechanic = asyncHandler(async (req, res) => {
  const mechanicId = Number(req.params.id);
  const [rows] = await query(
    `
    SELECT m.id, m.workshop_name, m.service_categories, m.subscription_plan, m.subscription_status, m.rating_avg, m.verified,
           u.id AS user_id, u.name, u.email, u.phone, u.city
    FROM mechanics m
    JOIN users u ON u.id = m.user_id
    WHERE m.id = ?
    `,
    [mechanicId],
  );
  if (!rows.length) throw new ApiError(404, "Mechanic not found");
  return res.json(rows[0]);
});

export const updateMechanicProfile = asyncHandler(async (req, res) => {
  const { workshop_name, service_categories, subscription_plan } = req.body;
  const [rows] = await query("SELECT id FROM mechanics WHERE user_id = ?", [
    req.user.id,
  ]);
  if (!rows.length) throw new ApiError(404, "Mechanic profile not found");

  const mechanicId = rows[0].id;
  await query(
    `
    UPDATE mechanics
    SET workshop_name = COALESCE(?, workshop_name),
        service_categories = COALESCE(?, service_categories),
        subscription_plan = COALESCE(?, subscription_plan),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      workshop_name || null,
      service_categories ? JSON.stringify(service_categories) : null,
      subscription_plan || null,
      mechanicId,
    ],
  );

  return res.json({ message: "Profile updated" });
});

export const subscribeMechanic = asyncHandler(async (req, res) => {
  const { plan_type = "pro", price = 499 } = req.body;

  const [rows] = await query("SELECT id FROM mechanics WHERE user_id = ?", [
    req.user.id,
  ]);
  if (!rows.length) throw new ApiError(404, "Mechanic profile not found");

  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);

  await upsertSubscriptionForUser({
    userId: req.user.id,
    planType: plan_type,
    price,
    status: "pending_payment",
    renewalDate,
  });

  await query(
    `
    UPDATE mechanics
    SET subscription_plan = ?, subscription_status = 'inactive', updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
    `,
    [plan_type, req.user.id],
  );

  return res.json({
    message: "Subscription intent stored. Complete payment via Stripe checkout.",
  });
});
