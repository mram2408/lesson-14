class MainController {
  static index(req, res) {
    res.redirect("home.html");
  }
  static about(req, res) {
    res.redirect("about.html");
  }
}

export default MainController;
