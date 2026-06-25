const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });