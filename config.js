const pool = require("./database");


async function getSetting(feature) {
  try {
    const res = await pool.query("SELECT status FROM settings WHERE feature = $1", [feature]);
    return res.rows.length ? res.rows[0].status : null;
  } catch (err) {
    console.error(`❌ Error fetching ${feature}:`, err);
    return null;
  }
}


async function toggleSetting(feature) {
  let currentStatus = await getSetting(feature);
  if (currentStatus === null) return null; 

  let newStatus = currentStatus === "true" ? "false" : "true";

  try {
    await pool.query(
      "INSERT INTO settings (feature, status) VALUES ($1, $2) ON CONFLICT (feature) DO UPDATE SET status = $2",
      [feature, newStatus]
    );
    return newStatus;
  } catch (err) {
    console.error(`❌ Error updating ${feature}:`, err);
    return currentStatus;
  }
}

module.exports = { getSetting, toggleSetting };