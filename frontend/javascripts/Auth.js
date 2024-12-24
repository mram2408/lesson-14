document.addEventListener("DOMContentLoaded", () => {
  function decodeToken(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  const token = localStorage.getItem("jwt_token");

  let user;
  if (token) user = decodeToken(token);
  // console.log(user);

  function logout() {
    RequestManager.onLogout();
    localStorage.removeItem("jwt_token");
    location.reload();
  }

  const navbar = document.querySelector("#navbar");
  const login = document.createElement("a");
  const cart = document.createElement("a");
  if (!token || !user) {
    login.textContent = "Увійти";
    login.setAttribute("href", "./login.html");
  } else {
    login.textContent = `${user.username} (Вийти)`;
    login.onclick = logout;

    cart.textContent = "Перейти до замовлення";
    cart.setAttribute("href", "./cart.html");
    navbar.append(cart);
  }
  navbar.append(login);
});
