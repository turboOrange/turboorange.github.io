const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const pencilSize = document.getElementById('pencilSize');
const clearBtn = document.getElementById('clearBtn');
const eraserBtn = document.getElementById('eraserBtn');

let drawing = false;
let erasing = false;
let lastX = 0;
let lastY = 0;

// Drawing functions
function startDraw(e) {
  drawing = true;
  [lastX, lastY] = getPosition(e);
}

function endDraw() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;
  const [x, y] = getPosition(e);
  ctx.lineWidth = pencilSize.value;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Use composite operation for erasing
  if (erasing) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = colorPicker.value;
  }

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

function getPosition(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return [
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top,
    ];
  } else {
    return [
      e.clientX - rect.left,
      e.clientY - rect.top,
    ];
  }
}

// Mouse events
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);

// Touch events for mobile
canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', endDraw);

// Clear button
clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Eraser button toggle
eraserBtn.addEventListener('click', () => {
  erasing = !erasing;
  eraserBtn.classList.toggle('active', erasing);
});

// Prevent scrolling on touch devices while drawing
canvas.addEventListener('touchmove', function(e) {
  if (drawing) e.preventDefault();
}, { passive: false });