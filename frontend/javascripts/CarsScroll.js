let user;
const baseUrl = "https://lesson-14.onrender.com/api/v1/uploads/";
const token = localStorage.getItem("jwt_token");
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

  if (token) user = decodeToken(token);
});
class Cars {
  constructor(containerId, itemsPerPage) {
    this.containerId = containerId;
    this.itemsPerPage = itemsPerPage;
    this.page = 0;
    this.loading = false;
    this.carsCount;
  }
  async loadItems() {
    if (this.itemsPerPage * this.page > this.carsCount) return;
    if (this.loading) return;
    this.loading = true;

    const container = document.querySelector(this.containerId);
    const loading = document.createElement("h3");
    loading.textContent = "Завантаження даних..";
    const loadingContainer = document.querySelector("#loading");
    loadingContainer.append(loading);

    const queryParams = new URLSearchParams(window.location.search);
    const queryString = queryParams.toString() ?? "";
    console.log(queryString);

    const data = await RequestManager.fetchData(
      `/autopark?page=${this.page}&perPage=${this.itemsPerPage}&` + queryString
    );
    this.carsCount = data.count;
    this.loading = false;
    loading.remove();
    for (const car of data.carsList) {
      container.append(this.getCard(car));
    }
    this.page++;
  }
  getCard(carObj) {
    async function onRent() {
      // console.log(carObj._id);
      await RequestManager.postRequest("/cart", { carId: carObj._id });
      window.location.href = "./cart.html";
    }

    const card = document.createElement("div");
    card.className = "car-card";

    const img = document.createElement("img");
    img.setAttribute("src", `${baseUrl}${carObj.imgSrc}`);
    card.append(img);

    const title = document.createElement("h3");
    title.textContent = `${carObj.make} ${carObj.model}`;
    card.append(title);

    const year = document.createElement("div");
    year.className = "car-year";
    year.textContent = `Рік випуску: ${carObj.year}`;
    card.append(year);

    const numberPlate = document.createElement("div");
    numberPlate.className = "number-plate";
    const label = document.createElement("img");
    label.setAttribute("src", "images/image.png");
    numberPlate.append(label);
    const number = document.createElement("div");
    number.textContent = carObj.numberPlate;
    numberPlate.append(number);
    card.append(numberPlate);

    if (carObj.price) {
      const rentPrice = document.createElement("div");
      rentPrice.textContent = `Ціна за оренду: ₴ ${carObj.price} доба`;
      card.append(rentPrice);

      const rentBtn = document.createElement("button");
      if (!token || !user) {
        rentBtn.textContent = "Увійдіть щоб орендувати";
        rentBtn.setAttribute("disabled", "");
      } else {
        rentBtn.textContent = "Орендувати";
        rentBtn.onclick = onRent;
      }
      card.append(rentBtn);
    }

    return card;
  }
  async init() {
    this.loadItems();
    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        this.loadItems();
      }
    });
  }
}

new Cars("#cars-container", 6).init();
