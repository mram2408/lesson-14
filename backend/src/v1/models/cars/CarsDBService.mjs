import CRUDManager from "../CRUDManager.mjs";
// import Car from "./Vehicle.mjs";
import pool from "../../../../db/connectDB.mjs";

class CarsDBService extends CRUDManager {
  async getList(
    skipNum = 0,
    limitNum = 4,
    sort = "az",
    yearFrom = 0,
    yearTo = 10000
  ) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM vehicles WHERE year BETWEEN ? AND ? ORDER BY make ${
          sort === "az" ? "ASC" : "DESC"
        } LIMIT ? OFFSET ?`,
        [
          parseInt(yearFrom),
          parseInt(yearTo),
          parseInt(limitNum),
          parseInt(skipNum),
        ]
      );
      // Запит для підрахунку загальної кількості рядків
      const [countRows] = await pool.query(
        `SELECT COUNT(*) as total FROM vehicles WHERE year BETWEEN ? AND ?`,
        [parseInt(yearFrom), parseInt(yearTo)]
      );

      const totalCount = countRows[0].total;

      return { results: rows, count: totalCount };
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  // async getList(
  //   filters = {},
  //   projection = null,
  //   options,
  //   populateFields = [],
  //   skipNum = 0,
  //   limitNum = 4
  // ) {
  //   try {
  //     let query = this.model.find(filters, projection, options);
  //     const count = await this.model.countDocuments(query);
  //     query.skip(skipNum);
  //     query.limit(limitNum);
  //     populateFields.forEach((field) => {
  //       // query = query.populate(field)
  //       if (typeof field === "string") {
  //         // Якщо поле передано як рядок
  //         query = query.populate(field);
  //       } else if (
  //         typeof field === "object" &&
  //         field.fieldForPopulation &&
  //         field.requiredFieldsFromTargetObject
  //       ) {
  //         // Якщо передано об'єкт з полем для заповнення та запитуваними полями
  //         query = query.populate(
  //           field.fieldForPopulation,
  //           field.requiredFieldsFromTargetObject
  //         );
  //       }
  //     });
  //     const results = await query.exec();
  //     return { results, count };
  //   } catch (error) {
  //     throw new Error("Error retrieving data: " + error.message);
  //   }
  // }
}
export default new CarsDBService("vehicles");
