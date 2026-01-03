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

  function renderExtras() {
    const list = $("#extras-list");
    if (!list) return;
    list.innerHTML = state.services
      .map(
        (service) =>
          `<div class="extras-item"><div class="extras-left"><strong>${
            service.name
          }</strong></div><div class="extras-price">${format(
            service.price
          )}</div><div class="extras-action"><button data-add-id="${
            service.id
          }">Add</button></div></div>`
      )
      .join("");
  }

  function renderBillItems() {
    const container = $("#bill-items");
    if (!container) return;
    container.innerHTML = state.cart
      .map(
        (item, i) =>
          `<div class="bill-item"><span>${item.name}</span><span>${format(
            item.price
          )}</span><button data-remove-idx="${i}" class="remove">×</button></div>`
      )
      .join("");
    renderTotals();
  }

  function renderTotals() {
    const weight = parseFloat($("#weight")?.value || "0") || 0;
    const service = $("#service-type")?.value || "wash";
    const iron = !!$("#iron")?.checked;
    const rates = { wash: 5, dryclean: 8 };
    const serviceCharge = weight * (rates[service] || rates.wash);
    const extrasTotal = state.cart.reduce((s, x) => s + x.price, 0);
    const ironCost = iron ? 5 : 0;
    const delivery = serviceCharge + extrasTotal < 20 ? 5 : 0;
    const total = serviceCharge + extrasTotal + ironCost + delivery;
    $("#service-charge") &&
      ($("#service-charge").textContent = format(serviceCharge));
    $("#iron-cost") && ($("#iron-cost").textContent = format(ironCost));
    $("#delivery") && ($("#delivery").textContent = format(delivery));
    $("#total") && ($("#total").textContent = format(total));
  }

  function addToCartById(id) {
    const service = state.services.find((e) => e.id === id);
    if (!service) return;
    state.cart.push(service);
    renderBillItems();
  }

  function removeFromCart(index) {
    if (index >= 0 && index < state.cart.length) {
      state.cart.splice(index, 1);
      renderBillItems();
    }
  }

  function attachHandlers() {
    // delegate add / remove buttons
    document.addEventListener("click", (e) => {
      const add = e.target.closest && e.target.closest("button[data-add-id]");
      if (add) {
        addToCartById(add.getAttribute("data-add-id"));
      }
      const rem =
        e.target.closest && e.target.closest("button[data-remove-idx]");
      if (rem) {
        removeFromCart(Number(rem.getAttribute("data-remove-idx")));
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
      renderExtras();
      renderBillItems();
      attachHandlers();
    },
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartials();
  createApp().init();
});
