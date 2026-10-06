// Tells the CSS that JavaScript is running (enables the mobile menu styles)
document.documentElement.classList.add('js');

// ---------- Mobile menu ----------
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function closeMenu() {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', function () {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// ---------- Smooth scrolling (also closes the menu) ----------
const navLinks = document.querySelectorAll('.nav a');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const id = link.getAttribute('href');
    if (id === '#') {
      e.preventDefault(); // placeholder links (project buttons)
      return;
    }
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      closeMenu();
    }
  });
});

// ---------- Typing effect ----------
const typingEl = document.getElementById('typing');
const words = ['Information Technology', 'Software Development'];
let wordIndex = 0;
let charIndex = words[0].length;
let deleting = true;

function type() {
  const word = words[wordIndex];
  if (deleting) {
    charIndex--;
  } else {
    charIndex++;
  }
  typingEl.textContent = word.substring(0, charIndex);

  let delay = deleting ? 50 : 90;
  if (!deleting && charIndex === word.length) {
    delay = 2000;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 300;
  }
  setTimeout(type, delay);
}

if (!prefersReduced) {
  // Starts after a short pause so the first text is readable
  setTimeout(type, 2500);
}

// ---------- Active navigation + back-to-top ----------
const sections = document.querySelectorAll('main section[id]');
const toTop = document.getElementById('toTop');

function onScroll() {
  const scrollPos = window.scrollY + 120;
  let current = 'home';

  sections.forEach(function (section) {
    if (scrollPos >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach(function (link) {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });

  toTop.classList.toggle('show', window.scrollY > 400);
}

window.addEventListener('scroll', onScroll);
onScroll();

toTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
});

// ---------- Contact form validation ----------
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

function setError(fieldId, message) {
  const input = document.getElementById(fieldId);
  document.getElementById(fieldId + 'Error').textContent = message;
  input.classList.toggle('invalid', message !== '');
  return message === '';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  successMsg.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameOk = setError('name', name === '' ? 'Please enter your name.' : '');
  const emailOk = setError('email',
    email === '' ? 'Please enter your email.' :
    !emailPattern.test(email) ? 'Please enter a valid email address.' : '');
  const messageOk = setError('message', message === '' ? 'Please enter a message.' : '');

  if (nameOk && emailOk && messageOk) {
    // Frontend only: nothing is sent or stored
    successMsg.textContent = 'Thank you! Your message has been submitted.';
    form.reset();
  }
});
