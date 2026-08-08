/**
 * ============================================================================
 * PORTFÓLIO MATHEUS MENDES - JS PRINCIPAL
 * ============================================================================
 */

// --- 1. Dropdown de Contato na Navbar ---
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (dropdownToggle && dropdownMenu) {
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = dropdownMenu.style.display === 'flex';
    dropdownMenu.style.display = isVisible ? 'none' : 'flex';
    dropdownToggle.setAttribute('aria-expanded', !isVisible);
  });

  window.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = 'none';
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// --- 2. Botão Flutuante Voltar ao Topo ---
const btnTopo = document.getElementById('btn-topo');
if (btnTopo) {
  window.addEventListener('scroll', () => {
    btnTopo.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  btnTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- 3. Menu Hambúrguer (Mobile) ---
const menuToggle = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  window.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });
}

// --- 4. Alternador de Tema (Claro / Escuro) ---
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeToggle.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
  });
}

// --- 5. Inicialização e Renderização Dinâmica dos Projetos ---
document.addEventListener("DOMContentLoaded", () => {
  carregarProjetos();
});

async function carregarProjetos() {
  try {
    const response = await fetch('assets/js/projetos.json');
    const projetos = await response.json();
    renderizarProjetos(projetos);
    configurarFiltros();
    configurarCarrossel();
    configurarModal();
  } catch (error) {
    console.error("Erro ao carregar o acervo de projetos JSON:", error);
  }
}

function renderizarProjetos(projetos) {
  const container = document.getElementById("projects-container");
  if (!container) return;
  container.innerHTML = "";

  projetos.forEach((proj) => {
    const tagsHtml = proj.tecnologias
      .map((tech) => `<span class="tag">${tech}</span>`)
      .join("");

    const cardHtml = `
      <div class="card" data-category="${proj.categoria}">
        <h3>${proj.titulo}</h3>
        <p>${proj.descricao}</p>
        <div class="tech-tags">
          ${tagsHtml}
        </div>
        <div class="card-links">
          <button class="btn-card btn-modal" 
            data-title="${proj.titulo}"
            data-problem="${proj.problema || 'Problema não catalogado.'}"
            data-challenge="${proj.desafio || 'Desafio técnico não especificado.'}"
            data-arch="${proj.arquitetura || 'Arquitetura padrão.'}"
            data-github="${proj.linkGithub}">
            <i class="fas fa-info-circle"></i> Detalhes
          </button>
          <a href="${proj.linkGithub}" target="_blank" class="btn-card">
            <i class="fab fa-github"></i> Código
          </a>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", cardHtml);
  });
}

// --- 6. Controle do Carrossel de 3 Cards ---
function configurarCarrossel() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const container = document.getElementById("projects-container");

  if (!prevBtn || !nextBtn || !container) return;

  function atualizarEstadoSetas() {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    prevBtn.disabled = scrollLeft <= 5;
    nextBtn.disabled = scrollLeft >= maxScroll - 5;
  }

  prevBtn.addEventListener("click", () => {
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
  });

  container.addEventListener("scroll", atualizarEstadoSetas);
  window.addEventListener("resize", atualizarEstadoSetas);
  atualizarEstadoSetas();
}

// --- 7. Filtros por Categoria ---
function configurarFiltros() {
  const filterBtns = document.querySelectorAll(".btn-filter");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");
      const cards = document.querySelectorAll("#projects-container .card");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// --- 8. Modal Interativa (Delegação de Eventos para Elementos Dinâmicos) ---
function configurarModal() {
  const modal = document.getElementById("project-modal");
  const closeModalBtn = document.getElementById("close-modal");

  if (!modal) return;

  document.addEventListener("click", (e) => {
    const btnModal = e.target.closest(".btn-modal");
    if (btnModal) {
      document.getElementById("modal-title").innerText = btnModal.dataset.title || "";
      document.getElementById("modal-problem").innerText = btnModal.dataset.problem || "";
      document.getElementById("modal-challenge").innerText = btnModal.dataset.challenge || "";
      document.getElementById("modal-arch").innerText = btnModal.dataset.arch || "";
      document.getElementById("modal-github").href = btnModal.dataset.github || "#";

      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  });
}

// --- 9. Animação de Estrelas / Dia no Canvas ---
const backgroundCanvas = document.getElementById('background-canvas');
if (backgroundCanvas) {
  const bgCtx = backgroundCanvas.getContext('2d');
  let bgStars = [];
  let animationId;

  function resizeBackgroundCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
  }
  resizeBackgroundCanvas();
  window.addEventListener('resize', resizeBackgroundCanvas);

  function createBackgroundStars(count) {
    bgStars = [];
    for (let i = 0; i < count; i++) {
      bgStars.push({
        x: Math.random() * backgroundCanvas.width,
        y: Math.random() * backgroundCanvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.3 + 0.1
      });
    }
  }

  function animateBackgroundStars() {
    bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    for (let star of bgStars) {
      star.y += star.speed;
      if (star.y > backgroundCanvas.height) star.y = 0;

      bgCtx.beginPath();
      bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      bgCtx.fillStyle = '#ffffff';
      bgCtx.fill();
    }
    animationId = requestAnimationFrame(animateBackgroundStars);
  }

  function drawSunBackground() {
    bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    const gradient = bgCtx.createLinearGradient(0, 0, 0, backgroundCanvas.height);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#e2e8f0");
    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
  }

  function switchCanvasTheme(isLight) {
    cancelAnimationFrame(animationId);
    if (isLight) {
      drawSunBackground();
    } else {
      createBackgroundStars(150);
      animateBackgroundStars();
    }
  }

  const themeObserver = new MutationObserver(() => {
    const isLight = document.body.classList.contains("light");
    switchCanvasTheme(isLight);
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  switchCanvasTheme(document.body.classList.contains("light"));
}

// --- 10. Mini-Game Snake ---
(() => {
  const canvas = document.getElementById('snake');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const SCALE = 20;
  const ROWS = WIDTH / SCALE;
  const COLS = HEIGHT / SCALE;

  let snake = [];
  let direction = { x: 1, y: 0 };
  let food = null;
  let gameInterval = null;
  let running = false;

  function initGame() {
    snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    direction = { x: 1, y: 0 };
    placeFood();
    running = true;
  }

  function placeFood() {
    while (true) {
      const x = Math.floor(Math.random() * ROWS);
      const y = Math.floor(Math.random() * COLS);
      if (!snake.some(seg => seg.x === x && seg.y === y)) {
        food = { x, y };
        break;
      }
    }
  }

  window.addEventListener("keydown", (e) => {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
    if (keys.includes(e.key) && running) {
      e.preventDefault();
    }
  }, { passive: false });

  function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  function draw() {
    clearCanvas();
    drawSquare(food.x, food.y, '#ef4444');

    snake.forEach((seg, idx) => {
      drawSquare(seg.x, seg.y, idx === 0 ? '#3b82f6' : '#60a5fa');
    });

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Segoe UI';
    ctx.fillText(`         --      Pontuação: ${snake.length - 3}`, 10, 25);
  }

  function moveSnake() {
    const head = snake[0];
    const newHead = { x: head.x + direction.x, y: head.y + direction.y };

    if (
      newHead.x < 0 || newHead.x >= ROWS ||
      newHead.y < 0 || newHead.y >= COLS ||
      snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
    ) {
      return gameOver();
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
      placeFood();
    } else {
      snake.pop();
    }
  }

  function gameOver() {
    clearInterval(gameInterval);
    running = false;

    ctx.fillStyle = '#f8fafc';
    ctx.font = '24px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('FIM DE JOGO!', WIDTH / 2, HEIGHT / 2 - 10);
    ctx.font = '16px Segoe UI';
    ctx.fillText(`Pontuação final: ${snake.length - 3}`, WIDTH / 2, HEIGHT / 2 + 20);
    ctx.fillText('Pressione ENTER para reiniciar', WIDTH / 2, HEIGHT / 2 + 50);
  }

  function gameLoop() {
    moveSnake();
    draw();
  }

  function keyHandler(e) {
    if (!running) {
      if (e.key === 'Enter') {
        startGame();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        if (direction.y !== 1) direction = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (direction.y !== -1) direction = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) direction = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (direction.x !== -1) direction = { x: 1, y: 0 };
        break;
    }
  }

  function startGame() {
    if (running) return;
    initGame();
    draw();
    gameInterval = setInterval(gameLoop, 130);
    running = true;
  }

  window.addEventListener('keydown', keyHandler);

  const gameObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && running) {
        clearInterval(gameInterval);
        running = false;
      }
    });
  }, { threshold: 0.2 });

  gameObserver.observe(canvas);

  clearCanvas();
  ctx.fillStyle = '#3b82f6';
  ctx.font = '22px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('Snake Game 🐍', WIDTH / 2, HEIGHT / 2 - 30);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Segoe UI';
  ctx.fillText('Use as setas para mover', WIDTH / 2, HEIGHT / 2 + 10);
  ctx.fillText('Pressione ENTER para iniciar', WIDTH / 2, HEIGHT / 2 + 35);
})();