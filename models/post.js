// models/post.js
const db = require('./db');

async function getAll() {
  const { rows } = await db.query(`
    SELECT p.*, u.first_name + u.last_name as author
    FROM posts p
    JOIN users u ON p.author_id = u.id
  `);
  return rows;
}

async function insertNew({ title, message, author_id }) {
  const { rows } = await db.query(
    'INSERT INTO posts (title, message, author_id) VALUES ($1, $2, $3) RETURNING *',
    [title, message, author_id]
  );
  return rows[0];
}

async function deleteById(id) {
  const { rowCount } = await db.query(
    'DELETE FROM posts WHERE id=$1',
    [id]
  );
  return rowCount > 0; // Return true if a row was deleted, false otherwise
}

module.exports = {
  getAll,
  insertNew,
  deleteById
};
