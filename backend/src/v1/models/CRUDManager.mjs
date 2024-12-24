import pool from "../../../db/connectDB.mjs";

class CRUDManager {
  constructor(table) {
    this.table = table;
  }

  // Вибірка всього списку з бази з фільтрами, projection і populateFields
  async getList() {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${this.table}`);
      return rows;
    } catch (error) {
      console.error("Error retrieving data: " + error.message);
      return [];
    }
  }

  // Створення об'єкта і збереження у базі
  async create(data) {
    try {
      const sql = `INSERT INTO ${this.table} SET ?`;
      const [result] = await pool.query(sql, data);
      return { id: result.insertId, ...data };
    } catch (error) {
      console.error("Error saving data:", error);
      return null;
    }
  }

  // Пошук за id з використанням populateFields
  async getById(id) {
    try {
      const sql = `SELECT * FROM ${this.table} WHERE _id = ?`;
      const [rows] = await pool.query(sql, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching data by ID:", error);
      return null;
    }
  }

  // Оновлення за id
  async update(id, data) {
    try {
      const sql = `UPDATE ${this.table} SET ? WHERE _id = ?`;
      const [result] = await pool.query(sql, [data, id]);
      if (result.affectedRows === 0) {
        return null;
      }
      return { id, ...data };
    } catch (error) {
      console.error("Error updating data:", error);
      return null;
    }
  }

  // Видалення за id
  async deleteById(id) {
    try {
      const sql = `DELETE FROM ${this.table} WHERE _id = ?`;
      const [result] = await pool.query(sql, [id]);
      if (result.affectedRows === 0) {
        return null;
      }
      return { id };
    } catch (error) {
      console.error("Error deleting data:", error);
      return null;
    }
  }
}

export default CRUDManager;
