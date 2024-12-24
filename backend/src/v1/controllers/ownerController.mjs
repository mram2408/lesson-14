import { validationResult } from "express-validator";
import OwnersDBService from "../models/owner/OwnersDBService.mjs";
class OwnerController {
  static async owners(req, res) {
    const ownersList = await OwnersDBService.getList();

    res.render("owners", { title: "Власники", ownersList: ownersList });
  }
  static createOwnerForm(req, res) {
    res.render("addOwner", {
      title: "Додати нового власника",
      errors: [],
      ownerData: {},
    });
  }
  static async updateOwnerForm(req, res) {
    const ownerData = await OwnersDBService.getById(req.params.id);
    res.render("addOwner", {
      title: "Змінити дані про власника",
      errors: [],
      ownerData: ownerData,
    });
  }
  static async updateOwner(req, res) {
    await OwnersDBService.update(req.params.id, req.body);
    res.redirect("/autopark/owners");
  }
  static async addOwner(req, res) {
    const data = req.body;
    const errors = validationResult(req);
    console.log(data);

    if (!errors.isEmpty()) {
      return res.status(400).render("addOwner", {
        title: "Додати нового власника",
        errors: errors.array(),
        ownerData: data,
      });
    }

    await OwnersDBService.create(data);
    res.redirect("/autopark/owners");
  }
  static async deleteOwner(req, res) {
    try {
      await OwnersDBService.deleteById(req.body.id);
      res.status(200).json({ success: true });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to delete owner" });
    }
  }
}
export default OwnerController;
