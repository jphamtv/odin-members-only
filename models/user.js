// models/user.js
const db = require('./db');

async function getByUsername(username) {
  const { rows } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  return rows[0] || null;
}

async function getById(id) {
  const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createNew({ first_name, last_name, username, password, is_admin }) {
  const { rows } = await db.query(
    'INSERT INTO users (first_name, last_name, username, password, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [first_name, last_name, username, password, is_admin]
  );
  return rows[0];
}

async function updateMemberStatusById(id, { is_member }) {
  const { rows } = await db.query(`
    UPDATE users SET is_member = $1
    WHERE id = $2
    RETURNING *
    `, [is_member, id]
  );
  return rows[0] || null;
}

async function deleteById(id) {
  const { rowCount } = await db.query(
    'DELETE FROM users WHERE id=$1',
    [id]
  );
  return rowCount > 0; // Return true if a row was deleted, false otherwise
}

module.exports = {
  getByUsername,
  getById,
  createNew,
  updateMemberStatusById,
  deleteById
};
