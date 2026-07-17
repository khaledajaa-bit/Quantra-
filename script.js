/* =========================================================
   QUANTRA — interactions
   ========================================================= */

/* ---- Sticky nav background on scroll ---- */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
  revealObserver.observe(el);
});

/* ---- Animated counters (hero stats) ---- */
const counters = document.querySelectorAll('.counter');
const animateCounter = (el) => {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (suffix ? value.toFixed(1) : Math.round(value)).toString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach((c) => counterObserver.observe(c));

/* ---- Live agent console (simulated reasoning stream) ---- */
const consoleLines = [
  'Scanning 214 pairs across 6 venues…',
  'Volatility spike detected on SOL/USDC',
  'Signal confidence: 87% — evaluating entry',
  'Position size checked against risk model',
  'Executing order on-chain…',
  'Trade confirmed · block finalized',
  'Updating exposure across active positions',
  'No anomalies found. Resuming scan.',
  'Liquidity depth nominal on 3 pairs',
  'Confidence below threshold — standing down',
];

const consoleBody = document.getElementById('consoleBody');
let lineIndex = 0;

function typeLine(text, callback) {
  const p = document.createElement('p');
  p.className = 'console__line';
  consoleBody.appendChild(p);

  const prompt = document.createElement('span');
  prompt.className = 'accent';
  prompt.textContent = '> ';
  p.appendChild(prompt);

  const textNode = document.createElement('span');
  p.appendChild(textNode);

  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.textContent = '_';
  p.appendChild(caret);

  let i = 0;
  const speed = 22;

  const typeChar = () => {
    if (i < text.length) {
      textNode.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, speed);
    } else {
      caret.remove();
      trimConsole();
      setTimeout(callback, 900);
    }
  };
  typeChar();
}

function trimConsole() {
  while (consoleBody.children.length > 7) {
    consoleBody.removeChild(consoleBody.firstElementChild);
  }
}

function runConsoleLoop() {
  typeLine(consoleLines[lineIndex % consoleLines.length], () => {
    lineIndex++;
    runConsoleLoop();
  });
}

if (consoleBody) {
  consoleBody.innerHTML = '';
  runConsoleLoop();
}

/* ---- Copy contract address ---- */
const copyBtn = document.getElementById('copyAddr');
const tokenAddr = document.getElementById('tokenAddr');

if (copyBtn && tokenAddr) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(tokenAddr.textContent.trim());
      const original = copyBtn.textContent;
      copyBtn.textContent = 'Copied';
      setTimeout(() => { copyBtn.textContent = original; }, 1800);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  });
}
