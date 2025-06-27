const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

leftBtn.addEventListener('touchstart', () => player.dx = -player.speed);
leftBtn.addEventListener('touchend', () => player.dx = 0);

rightBtn.addEventListener('touchstart', () => player.dx = player.speed);
rightBtn.addEventListener('touchend', () => player.dx = 0);
