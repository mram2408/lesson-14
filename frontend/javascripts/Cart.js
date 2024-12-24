document.addEventListener("DOMContentLoaded", async () => {
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
  const cart = await RequestManager.fetchData("/cart");
  const cartSum = cart.data.total;
  const cartItems = cart.data.cars;

  console.log(cartItems);

  const container = document.querySelector("#cart");

  for (const car of cartItems) {
    container.append(getCard(car));
  }
  console.log(cartSum);

  const summary = document.createElement("h2");
  summary.textContent = `До сплати за оренду: ₴ ${cartSum}`;
  container.append(summary);
});

function getCard(car) {
  const carDetails = car.details;
  console.log();

  function decreaseItem() {
    if (car.amount === 1) {
      RequestManager.deleteRequest("/cart", carDetails._id);
      return;
    }

    RequestManager.putRequest("/cart", {
      carId: carDetails._id,
      amount: car.amount - 1,
    });
  }
  function increaseItem() {
    RequestManager.putRequest("/cart", {
      carId: carDetails._id,
      amount: car.amount + 1,
    });
  }

  const item = document.createElement("div");
  item.className = "cart__item";

  const imgDiv = document.createElement("div");
  imgDiv.className = "cart__item-img";
  const img = document.createElement("img");
  img.setAttribute("src", `data:image;base64,${carDetails.imgSrc}`);
  imgDiv.append(img);
  item.append(imgDiv);

  const about = document.createElement("div");
  about.className = "cart__about";

  const title = document.createElement("div");
  title.className = "cart__about-title";
  title.textContent = `${carDetails.make} ${carDetails.model}`;

  const price = document.createElement("div");
  price.className = "cart__about-price";
  price.textContent = `₴ ${carDetails.price}`;

  const amount = document.createElement("div");
  const btn1 = document.createElement("button");
  console.log(carDetails);
  btn1.onclick = decreaseItem;
  btn1.textContent = "-";
  const btn2 = document.createElement("button");
  btn2.onclick = increaseItem;
  btn2.textContent = "+";
  const displayAmount = document.createElement("div");
  displayAmount.textContent = `${car.amount} (діб)`;

  amount.className = "cart__about-amount";
  amount.append(btn1);
  amount.append(displayAmount);
  amount.append(btn2);

  about.append(title);
  about.append(price);
  about.append(amount);

  item.append(about);

  return item;
}
