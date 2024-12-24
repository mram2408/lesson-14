import UsersDBService from "../models/user/UsersDBService.mjs";
import TypesDBService from "../models/type/TypesDBService.mjs";
import { validationResult } from "express-validator";

class UserController {
  static async usersList(req, res) {
    try {
      const filters = {};
      for (const key in req.query) {
        if (req.query[key]) filters[key] = req.query[key];
      }

      const dataList = await UsersDBService.getList(filters);

      res.render("usersList", {
        users: dataList,
        user: req.user,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async registerForm(req, res) {
    try {
      const id = req.params.id;
      let user = null;
      if (id) {
        //отримати об"єкт за id
        user = await UsersDBService.getById(id);
      }
      const types = await TypesDBService.getList();
      console.log(types);

      //відредерити сторінку з формою
      res.render("register", {
        errors: [],
        data: user,
        types,
        user: req.user,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  static async registerUser(req, res) {
    // Якщо валідація пройшла успішно, виконуємо логіку реєстрації
    const errors = validationResult(req);
    const data = req.body;
    const types = await TypesDBService.getList();
    console.log(req.body);

    if (!errors.isEmpty()) {
      if (req.params.id) data.id = req.params.id;
      return res.status(400).json({
        errors: errors.array(),
        data,
        types,
        user: req.user,
      });
    }

    try {
      const dataObj = req.body;
      if (req.file) dataObj.img = req.file.filename;

      if (req.params.id) {
        // Оновлюємо дані про користувача в базі даних
        await UsersDBService.update(req.params.id, dataObj);
      } else {
        // Додаємо користувача в базу даних
        await UsersDBService.create(dataObj);
      }

      res.redirect("/frontend/autopark.html");
    } catch (err) {
      res.status(500).json({
        errors: [{ msg: err.message }],
        data,
        types,
        user: req.user,
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UsersDBService.deleteById(req.body.id);
      res.json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete user" });
    }
  }
}

export default UserController;
