import { query } from "../config/db.js";

export async function upsertSubscriptionForUser({
  userId,
  planType,
  price,
  status,
  renewalDate,
}) {
  await query(
    `
    INSERT INTO subscriptions (user_id, plan_type, price, status, renewal_date)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      plan_type = VALUES(plan_type),
      price = VALUES(price),
      status = VALUES(status),
      renewal_date = VALUES(renewal_date),
      updated_at = CURRENT_TIMESTAMP
    `,
    [userId, planType, price, status, renewalDate],
  );
}
