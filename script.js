'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navLink = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('#section--');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const section1 = document.querySelector('#section--1');
const btnScroll = document.querySelector('.btn--scroll-to');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  // btnsOpenModal[i].addEventListener('click', openModal);

  btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScroll.addEventListener('click', function (e) {
  const scroll = section1.getBoundingClientRect();

  // console.log(scroll);
  // console.log(e.target.getBoundingClientRect());
  // console.log('X/Y', window.pageXOffset, pageYOffset);
  // console.log(
  //   'width/height',
  //   document.documentElement.clientWidth,
  //   document.documentElement.clientHeight
  // );

  // Scrolling
  // window.scrollTo(
  //   scroll.left + window.pageXOffset,
  //   scroll.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: scroll.left + window.pageXOffset,
  //   top: scroll.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// page navigation
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ----------------------------------adding animations------------------------------------------------
const handleHoverEffect = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const clickNav = e.target;
    const siblings = clickNav.closest('.nav').querySelectorAll('.nav__link');
    const logo = clickNav.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != clickNav) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHoverEffect.bind(0.5));
nav.addEventListener('mouseout', handleHoverEffect.bind(1));

//==================================Stiky navigation================================
// const initialCoord = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   // console.log(this.window.scrollY);
//   if (this.window.scrollY > initialCoord.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

//====================================Stiky navigation: Interceptions observe API================================
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const headers = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(headers);

// Reaving the section----------------
const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// --------------------------------------lazy image loading --------------------------------
const imgTarget = document.querySelectorAll('img[data-src]');
const imgLoading = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replaced src with data src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageLoadingObserver = new IntersectionObserver(imgLoading, {
  root: null,
  threshold: 0.1,
});
imgTarget.forEach(img => {
  imageLoadingObserver.observe(img);
});

//Slider
const slider = function () {
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const slides = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');
  // const slider = document.querySelector('.slider');

  let currentSlide = 0;
  const maxSlide = slides.length;

  //--------------------------function------------------------------------------------
  const createDots = function () {
    slides.forEach((_, index) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide='${index}'></button>`
      );
    });
  };

  // 0, 100, 200, 300
  const goToSlide = function (slide) {
    slides.forEach((s, index) => {
      s.style.transform = `translateX(${100 * (index - slide)}%)`;
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  0;
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();
  // -----------------------------Next slide-------------------------------------------------
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = () => {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  // --------------------------------Events handlers--------------------------------
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') prevSlide();
  });

  document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

window.addEventListener('load', function (e) {
  console.log('load', e);
});
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('domContentLoaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
// navLink.forEach(nav => {
//   nav.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Add the event listener to the comman parent element
// Determine where the event originated from the child element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Menu Fade animation
const header = document.querySelector('.header');

// creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'we use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// header.append(message.cloneNode(true));
header.append(message);

// header.before(message);
// header.after(message);
// ----------------------delete message --------------------
const btnCookies = document.querySelector('.btn--close-cookie');

btnCookies.addEventListener('click', () => {
  message.remove();
});

/*
// Styles
message.style.backgroundColor = '#37385d';
message.style.width = '120%';

const messageHeight =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';
console.log(messageHeight);

document.documentElement.style.setProperty('--color-primary', 'orange');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.id);


const h1 = document.querySelector('h1');
const h1Fnc = function (e) {
  console.log('You are doing well!');
};
h1.addEventListener('mouseenter', h1Fnc);

h1.removeEventListener('mouseenter', h1Fnc);

// rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min * 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)} ${randomInt(0, 255)} ${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});


const h1 = document.querySelector('h1');
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
h1.closest('.header').style.backgroundColor = 'var(--color-primary)';
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(1)';
  }
});
*/
