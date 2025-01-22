// Get references to DOM elements
const menuButton = document.getElementById('menu-button');
const menu = document.getElementById('menu');

// Toggle menu visibility on button click
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
}