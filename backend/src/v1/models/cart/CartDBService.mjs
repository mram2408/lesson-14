import Cart from "./Cart.mjs";
import CarsDBService from "../cars/CarsDBService.mjs";
import mongoose from "mongoose";
import CRUDManager from "../CRUDManager.mjs";

class CartDBService extends CRUDManager {
  /**
   * Отримує інформацію про козину покупця:
   * Отримання інформації про покупця.
   * Отримання списку товарів з деталями про кожен товар і його продавця.
   * Обчислення загальної вартості покупки.
   *
   * @param {ObjectId} userId - id покупця.
   * @returns {PromiseCart>} - Promise, який вирішується об"єктом з відповідними властивостями.
   */
  //============== версія з aggregate ==========
  // async getCartDetails(userId) {
  //   try {
  //     const cartDetails = await Cart.aggregate([
  //       { $match: { customer: new mongoose.Types.ObjectId(`${userId}`) } }, // Збіг по id корзини
  //       {
  //         $lookup: {
  //           from: 'users', // З'єднання з колекцією users для отримання покупця
  //           localField: 'customer',
  //           foreignField: '_id',
  //           as: 'customerInfo',
  //         },
  //       },
  //       { $unwind: '$customerInfo' }, // Розкриття масиву customerInfo
  //       {
  //         $lookup: {
  //           from: 'types', // З'єднання з колекцією types для отримання типу користувача
  //           localField: 'customerInfo.type',
  //           foreignField: '_id',
  //           as: 'customerTypeInfo',
  //         },
  //       },
  //       { $unwind: '$productsList' }, // Розгортання масиву продуктів
  //       {
  //         $lookup: {
  //           from: 'products', // З'єднання з колекцією products для отримання деталей продуктів
  //           localField: 'productsList.product',
  //           foreignField: '_id',
  //           as: 'productDetails',
  //         },
  //       },
  //       { $unwind: '$productDetails' }, // Розгортання масиву productDetails
  //       {
  //         $lookup: {
  //           from: 'users', // З'єднання з колекцією users для отримання деталей продавців
  //           localField: 'productDetails.seller',
  //           foreignField: '_id',
  //           as: 'sellerDetails',
  //         },
  //       },
  //       { $unwind: '$sellerDetails' }, // Розкриття масиву sellerDetails
  //       {
  //         $lookup: {
  //           from: 'types', // З'єднання з колекцією types для отримання типу продавців
  //           localField: 'sellerDetails.type',
  //           foreignField: '_id',
  //           as: 'sellerTypeInfo',
  //         },
  //       },
  //       { $unwind: '$sellerTypeInfo' }, // Розкриття масиву sellerTypeInfo
  //       {
  //         // Збирання всіх продуктів у масив з їх даними
  //         $group: {
  //           _id: '$_id',
  //           customer: { $first: '$customerInfo' }, // Вибір першого (і єдиного) елемента в масиві customerInfo
  //           products: {
  //             $push: {
  //               details: '$productDetails',
  //               seller: {
  //                 name: '$sellerDetails.username',
  //                 _id: '$sellerDetails._id',
  //                 type: '$sellerTypeInfo.title',
  //               },
  //               totalProductsPrice: {
  //                 $multiply: ['$productDetails.price', '$productsList.amount'],
  //               },
  //               amount: '$productsList.amount',
  //             },
  //           },
  //           total: {
  //             $sum: {
  //               $multiply: ['$productDetails.price', '$productsList.amount'],
  //             },
  //           },
  //         },
  //       },
  //     ])

  //     if (!cartDetails.length) {
  //       throw new Error('Cart not found') // Викидання помилки, якщо корзину не знайдено
  //     }

  //     // return cartDetails // Повернення перших деталей корзини
  //     return cartDetails[0] // Повернення перших деталей корзини
  //   } catch (error) {
  //     console.error(error)
  //     throw error
  //   }
  // }
  //============== версія з populate ==========
  async getCartDetails(userId) {
    try {
      // Знаходимо корзину за userId та заповнюємо зв'язані поля
      const cartDetails = await Cart.findOne({
        customer: userId,
      })
        .populate({
          path: "customer",
          select: "-password",
          populate: {
            path: "type", // Заповнюємо тип користувача
          },
        })
        .populate({
          path: "carsList.vehicle",
        });

      if (!cartDetails) {
        throw new Error("Cart not found"); // Викидання помилки, якщо корзину не знайдено
      }

      // Обчислення потрібних полів
      const customer = cartDetails.customer;
      let cars = cartDetails.carsList;
      let total = 0;

      if (cars.length) {
        cars = cartDetails.carsList.map((car) => ({
          details: car.vehicle,
          totalCarsPrice: car.vehicle.price * car.amount,
          amount: car.amount,
        }));

        total = cars.reduce((total, car) => total + car.totalCarsPrice, 0);
      }

      return {
        customer,
        cars,
        total,
      };
    } catch (error) {
      console.error(error); // Виведення помилки в консоль
      throw error; // Викидання помилки для обробки поза функцією
    }
  }

  //--- оновлення кількості проудкту в корзині
  async updateProductAmount({ userId, carId, amount }) {
    try {
      // Оновлення корзини або додавання нового продукту
      const cart = await Cart.findOneAndUpdate(
        {
          // Знаходження корзини та продукту у ній
          customer: userId, // Умова пошуку кошика користувача за userId
          "carsList.vehicle": carId, //Умова пошуку товару у масиві за productId
        },
        {
          // Оновлення кількості існуючого продукту
          $set: { "carsList.$.amount": amount }, //Символ $ є оператором, який вказує на відповідний
          //елемент у масиві, що відповідає умові запиту.
        },
        { new: true }
      );
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //--- додавння  проудкту в корзину
  async addProduct({ userId, carId }) {
    console.log({ userId, carId });

    try {
      let cart = await Cart.findOne({ customer: userId });
      if (cart) {
        // Якщо корзина існує, перевіряємо, чи продукт вже є у корзині
        const productIndex = cart.carsList.findIndex(
          (item) => item.vehicle.toString() === carId
        );

        if (productIndex > -1) {
          // Якщо продукт існує, збільшуємо його кількість
          cart.carsList[productIndex].amount += 1;
        } else {
          // Якщо продукт не існує, додаємо його з кількістю 1
          cart.carsList.push({ vehicle: carId, amount: 1 });
        }
        cart = await cart.save(); // Збереження змін у корзині
      } else {
        // Оновлення корзини або додавання нового продукту
        cart = await Cart.create({
          customer: userId,
          carsList: [{ vehicle: carId, amount: 1 }],
        });
      }
      return cart;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //--- видаленя проудкту з корзини
  async deleteProduct({ userId, carId }) {
    console.log({ userId, carId });

    try {
      // Оновлення корзини або додавання нового продукту
      return await Cart.findOneAndUpdate(
        { customer: userId }, // Знаходження корзини за userId
        {
          // Видалення продукту з масиву productsList
          $pull: { carsList: { vehicle: carId } }, //$pull в MongoDB використовується
          // для видалення елементів з масиву, які відповідають певній умові
        },
        {
          new: true, // Повернення оновленого документу
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new CartDBService(Cart);
