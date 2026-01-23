// simple partial loader
async function loadPartials() {
  const nodes = document.querySelectorAll("[data-include]");
  await Promise.all(
    Array.from(nodes).map(async (el) => {
      const url = el.getAttribute("data-include");
      try {
        const r = await fetch(url);
        el.innerHTML = r.ok ? await r.text() : "";
      } catch (e) {
        el.innerHTML = "";
      }
    })
  );
}

const format = (v) => "$" + Number(v).toFixed(2);

function createApp() {
  const state = {
    services: [
      { id: "cleaning", name: "Cleaning", price: 7 },
      { id: "folding", name: "Folding", price: 3 },
      { id: "stain", name: "Stain Removal", price: 12 },
      { id: "leather", name: "Leather & Suede", price: 25 },
      { id: "wedding", name: "Wedding Dress", price: 60 },
      { id: "express", name: "Express Service", price: 10 },
    ],
    cart: [],
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  // render items added to cart inside the bill summary (read-only there)
  function renderBillItems() {
    const container = $("#bill-items");
    if (!container) return;
    container.innerHTML = state.cart
      .map(
        (item) =>
          `<div class="bill-item"><span>${item.name}</span><span>${format(
            item.price
          )}</span></div>`
      )
      .join("");
    renderTotals();
    // update extras buttons to reflect current cart state
    state.services.forEach((s) => setButtonState(s.id, isInCart(s.id)));
  }

  function renderTotals() {
    const extrasTotal = state.cart.reduce((s, x) => s + x.price, 0);
    const total = extrasTotal;
    $("#total") && ($("#total").textContent = format(total));
  }

  function isInCart(id) {
    return state.cart.some((x) => x.id === id);
  }
  function addToCartById(id) {
    const service = state.services.find((e) => e.id === id);
    if (!service) return;
    if (!isInCart(id)) state.cart.push(service);
    renderBillItems();
  }
  function removeFromCartById(id) {
    state.cart = state.cart.filter((x) => x.id !== id);
    renderBillItems();
  }

  function setButtonState(id, added) {
    const btn = document.querySelector(`button[data-add-id="${id}"]`);
    if (!btn) return;
    if (added) {
      btn.classList.add("added");
      btn.textContent = "Remove Item";
    } else {
      btn.classList.remove("added");
      btn.textContent = "Add";
    }
  }

  function attachHandlers() {
    // delegate add button clicks — toggle in cart and update button state
    document.addEventListener("click", (e) => {
      const add = e.target.closest && e.target.closest("button[data-add-id]");
      if (add) {
        const id = add.getAttribute("data-add-id");
        if (isInCart(id)) {
          removeFromCartById(id);
          setButtonState(id, false);
        } else {
          addToCartById(id);
          setButtonState(id, true);
        }
      }
    });

    const calc = $("#calculate");
    calc &&
      calc.addEventListener("click", () => {
        const name = $("#customer-name")?.value?.trim();
        if (!name) {
          alert("Please enter your full name");
          $("#customer-name")?.focus();
          return;
        }
        const weight = parseFloat($("#weight")?.value || "0") || 0;
        if (weight <= 0) {
          alert("Please enter a valid weight");
          $("#weight")?.focus();
          return;
        }
        renderTotals();
      });

    $("#subscribe") &&
      $("#subscribe").addEventListener("click", () =>
        alert("Thanks for subscribing!")
      );
  }

  return {
    init: () => {
      renderBillItems();
      attachHandlers();
    },
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  createApp().init();
});
