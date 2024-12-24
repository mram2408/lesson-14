import config from "../config/default.mjs";
import mysql from "mysql2/promise";

async function connectToMySQL() {
  try {
    const pool = mysql.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
    });
    console.log("Успішно підключено до MySQL");
    return pool;
  } catch (err) {
    console.error("Помилка підключення до MySQL:", err);
  }
}
const pool = await connectToMySQL();

export default pool;
// -------------- MongoDb---------------------
// // Імпортуємо необхідний модуль
// import mongoose from "mongoose";

// // Встановлюємо глобальні проміси
// mongoose.Promise = global.Promise;

// // Функція для підключення до MongoDB
// export default async function () {
//   try {
//     await mongoose.connect(config.dataBaseUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Успішно підключено до MongoDB");
//   } catch (err) {
//     console.error("Помилка підключення до MongoDB:", err);
//   }
// }
