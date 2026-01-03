async function loadPartials() {
  const includes = document.querySelectorAll("[data-include]");
  for (const el of includes) {
    const url = el.getAttribute("data-include");
    try {
      const res = await fetch(url);
      if (!res.ok) {
        el.innerHTML = "";
        continue;
      }
      const html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      el.innerHTML = "";
    }
  }
}

function format(v) {
  return "$" + Number(v).toFixed(2);
}

function initApp() {
  const calcBtn = document.getElementById("calculate");
  const nameInput = document.getElementById("customer-name");
  const weightInput = document.getElementById("weight");
  const serviceSelect = document.getElementById("service-type");
  const ironCheckbox = document.getElementById("iron");

  calcBtn &&
    calcBtn.addEventListener("click", function () {
      const name = nameInput.value.trim();
      if (!name) {
        alert("Please enter your full name");
        nameInput.focus();
        return;
      }
      const weight = parseFloat(weightInput.value) || 0;
      if (weight <= 0) {
        alert("Please enter a valid weight");
        weightInput.focus();
        return;
      }
      const service = serviceSelect.value;
      const rates = { wash: 5.0, dryclean: 8.0 };
      const ironingFlat = 5.0;
      const subtotal = weight * (rates[service] || rates.wash);
      const ironCost = ironCheckbox && ironCheckbox.checked ? ironingFlat : 0;
      const delivery = subtotal < 20 ? 5.0 : 0.0;
      const total = subtotal + ironCost + delivery;

      const subtotalEl = document.getElementById("subtotal");
      const ironEl = document.getElementById("iron-cost");
      const deliveryEl = document.getElementById("delivery");
      const totalEl = document.getElementById("total");

      subtotalEl && (subtotalEl.textContent = format(subtotal));
      ironEl && (ironEl.textContent = format(ironCost));
      deliveryEl && (deliveryEl.textContent = format(delivery));
      totalEl && (totalEl.textContent = format(total));
    });

  const subscribeBtn = document.getElementById("subscribe");
  subscribeBtn &&
    subscribeBtn.addEventListener("click", function () {
      alert("Thanks for subscribing!");
    });
}

document.addEventListener("DOMContentLoaded", async function () {
  await loadPartials();
  initApp();
});
