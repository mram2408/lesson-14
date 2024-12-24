import CartDBService from "../models/cart/CartDBService.mjs";
import CarsDBService from "../models/cars/CarsDBService.mjs";

class CartController {
  // Метод для отримання всіх товарів
  static async getCartDetails(req, res) {
    try {
      if (!req.user) {
        return res.status(403).json({ error: "Access denied" });
      }
      const userId = req.user.id; // Отримання id користувача

      const cartDetails = await CartDBService.getCartDetails(userId);
      res.status(200).json({
        data: cartDetails,
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
    }
  }
  // -------------
  static async addProduct(req, res) {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }

    const userId = req.user.id; // Отримання id користувача

    try {
      const { carId } = req.body; // Отримання id продукту
      // Перевірка чи існує продукт const
      const product = await CarsDBService.getById(carId);
      // console.log(product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" }); // Відправка помилки, якщо продукт не знайдено
      }

      // Оновлення корзини або додавання нового продукту
      const cart = await CartDBService.addProduct({
        userId,
        carId,
      });

      res.status(200).json({ message: "Car added successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ errors: [{ msg: err.message }] });
    }
  }
  static async updateProductAmount(req, res) {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }
    const userId = req.user.id; // Отримання id користувача
    try {
      const { carId, amount } = req.body; // Отримання id продукту та кількості з тіла запиту
      // Перевірка чи існує продукт const
      const car = await CarsDBService.getById(carId);

      if (!car) {
        return res.status(404).json({ message: "Product not found" }); // Відправка помилки, якщо продукт не знайдено
      }

      // Оновлення корзини або додавання нового продукту
      const cart = await CartDBService.updateProductAmount({
        userId,
        carId,
        amount,
      });

      res.status(200).json({ message: "Car amount updated successfully" });
    } catch (err) {
      res.status(500).json({ errors: [{ msg: err.message }] });
    }
  }

  // Метод для видалення товару (доступний тільки для адміністратора)
  static async deleteProduct(req, res) {
    if (!req.user) {
      return res.status(403).json({ error: "Access denied" });
    }
    const userId = req.user.id; // Отримання id користувача

    try {
      const { id } = req.body;
      await CartDBService.deleteProduct({ userId, carId: id });
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting product" });
    }
  }
}

export default CartController;
