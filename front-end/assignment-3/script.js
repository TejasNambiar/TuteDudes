(function () {
  const greetBtn = document.getElementById("greetBtn");
  const nameInput = document.getElementById("nameInput");
  const greeting = document.getElementById("greeting");
  greetBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    greeting.textContent = name ? `Hello, ${name}` : "Hello";
  });
  document.querySelectorAll(".color-box").forEach((box) => {
    box.addEventListener("click", () => {
      const color = box.getAttribute("data-color") || "transparent";
      box.style.backgroundColor = color;
      // choose readable text color for yellow
      if (color.toLowerCase() === "yellow") box.style.color = "#222";
      else box.style.color = "#fff";
    });
  });
  // allow Enter to trigger greeting
  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") greetBtn.click();
  });
})();
