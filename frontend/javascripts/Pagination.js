class Pagination {
  constructor(containerId, itemsCount) {
    this.containerId = containerId;
    this.itemsCount = itemsCount;
  }

  render() {
    const paginationContainer = document.querySelector(this.containerId);

    const list = document.createElement("ul");
    const previous = document.createElement("li");
    previous.textContent = "Попередня";
    list.append(previous);

    const queryParams = new URLSearchParams(window.location.search);
    let page = parseInt(queryParams.get("page")) || 0;
    const perPage = parseInt(queryParams.get("perPage")) || 4;

    const pageCount = Math.ceil(this.itemsCount / perPage);

    for (let i = 0; i < pageCount; ) {
      const li = document.createElement("li");
      li.textContent = ++i;

      if (i - 1 === page) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => {
        this.updateQueryParams(i - 1, perPage);
      });

      list.append(li);
    }

    const next = document.createElement("li");
    next.textContent = "Наступна";
    list.append(next);

    previous.addEventListener("click", () => {
      if (page > 0) {
        this.updateQueryParams(page - 1, perPage);
      }
    });

    next.addEventListener("click", () => {
      if (page < pageCount - 1) {
        this.updateQueryParams(page + 1, perPage);
      }
    });

    paginationContainer.append(list);
  }

  updateQueryParams(page, perPage) {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page);
    queryParams.set("perPage", perPage);
    window.history.pushState({}, "", `${window.location.pathname}?${queryParams.toString()}`);
    window.location.reload();
  }
}
