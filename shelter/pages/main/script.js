// -------------MOBILE MENU-------------
const mobileLabel = document.querySelector('.mobile__label');
const mobileBlackout = document.querySelector('.mobile__blackout');
const mobile = document.querySelector('.mobile');
const mobileLinks = document.querySelectorAll('.mobile__link');

const closeMobileMenu = () => {
    mobile.classList.remove('mobile_opened');
    document.body.classList.remove('modal');
}

mobileLabel.addEventListener('click', () => {
    document.body.classList.add('modal');
    mobile.classList.toggle('mobile_opened')
});

mobileBlackout.addEventListener('click', closeMobileMenu);

mobileLinks.forEach((mobileLink) => mobileLink.addEventListener('click', closeMobileMenu));

// -------------SLIDER AND POPUP-------------

const sliderWrap = document.querySelector('.slider__wrapper');
const sliderInner = document.querySelector('.slider__inner');

const cardTemplate = document.getElementById('cardTemplate');
const overlayTemplate = document.getElementById('overlayTemplate');

const sliderLeft = document.querySelector('.slide-left');
const sliderCenter = document.querySelector('.slide-center');
const sliderRight = document.querySelector('.slide-right');

const buttonNext = document.querySelector('.slider__button_next');
const buttonBack = document.querySelector('.slider__button_back');

const cardArray = [];
const dataArray = [];
let SLIDE_COUNT;

let delta;
let startPos;
let currentPos;
const sliderObj = {
    left: [],
    center: [],
    right: [],
};

function renderCurrentPos() {
    sliderInner.style.transform = `translateX(${currentPos}px)`;
}

function addEventListeners() {
    window.addEventListener('resize', () => {
        init();
    })

    buttonNext.addEventListener('click', () => {
        if (sliderInner.classList.contains('animated')) {
            return;
        }

        currentPos -= delta;
        sliderInner.classList.add('animated');
        renderCurrentPos();
    });

    buttonBack.addEventListener('click', () => {
        if (sliderInner.classList.contains('animated')) {
            return;
        }

        currentPos += delta;
        sliderInner.classList.add('animated');
        renderCurrentPos();
    });

    sliderInner.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') {
            return;
        }
        sliderInner.classList.remove('animated');

        if (currentPos === 0) {
            sliderCenter.innerHTML = sliderLeft.innerHTML;
            sliderObj.center = sliderObj.left;
            sliderObj.left = makeSlide(sliderLeft, sliderObj.center);
            sliderObj.right = makeSlide(sliderRight, sliderObj.center);

            currentPos = startPos;
            renderCurrentPos();
        }

        if (currentPos === -(sliderInner.scrollWidth - delta)) {
            sliderCenter.innerHTML = sliderRight.innerHTML;
            sliderObj.center = sliderObj.right;
            sliderObj.left = makeSlide(sliderLeft, sliderObj.center);
            sliderObj.right = makeSlide(sliderRight, sliderObj.center);

            currentPos = startPos;
            renderCurrentPos();
        }

    });
}

fetch('/rgvder-JSFE2022Q1/shelter/assets/pets.json')
    .then(response => response.json())
    .then(data => {
        data.forEach((pet, i) => {
            dataArray.push(pet);
            const card = cardTemplate.content.cloneNode(true);
            card.querySelector('img').src = pet.img;
            card.querySelector('img').alt = pet.name;
            card.querySelector('h4').innerText = pet.name;
            card.querySelector('.slider__element').setAttribute('data-id', i);
            cardArray.push(card);
        });

        init();

        addEventListeners();
    });

function makeSlide(slide, usedIds = []) {
    const ids = [];
    const getRandom = () => {
        let n;
        do {
            n = Math.floor(Math.random() * cardArray.length);
        } while ([...ids, ...usedIds].includes(n));
        ids.push(n);
        return n;
    };

    const newSlide = slide.cloneNode(true);
    newSlide.innerHTML = '';

    for (let j = 0; j < SLIDE_COUNT; j++) {
        const rand = getRandom();
        const item = cardArray[rand].cloneNode(true);

        newSlide.append(item);
    }

    slide.innerHTML = newSlide.innerHTML;
    return ids;
}

function init() {
    const screenWidth = window.innerWidth;
    let slideCount;
    switch (true) {
        case screenWidth >= 1280:
            slideCount = 3;
            break;
        case screenWidth >= 768:
            slideCount = 2;
            break;
        default:
            slideCount = 1;
    }

    if (slideCount !== SLIDE_COUNT) {
        SLIDE_COUNT = slideCount;
        sliderLeft.innerHTML = '';
        sliderCenter.innerHTML = '';
        sliderRight.innerHTML = '';

    } else {
        return;
    }

    sliderObj.center = makeSlide(sliderCenter);
    sliderObj.left = makeSlide(sliderLeft, sliderObj.center);
    sliderObj.right = makeSlide(sliderRight, sliderObj.center);

    delta = document.querySelector('.slider__item').clientWidth * SLIDE_COUNT;
    startPos = -(sliderInner.scrollWidth / 3);
    currentPos = startPos;

    renderCurrentPos();

    addEventListeners();
}

// -------------POPUP-------------

sliderWrap.addEventListener('click', (event) => {
    let target = event.target.closest('[data-id]');
    if (!target) {
        return;
    }

    const id = target.dataset.id;
    renderPopup(id);
})

document.addEventListener('click', (event) => {
    let target = event.target;
    if (!target.classList.contains('overlay') && !target.closest('.popup__button')) {
        return;
    }

    closeOverlay();
})

function renderPopup(id) {
    const overlay = overlayTemplate.content.cloneNode(true);
    const dataItem = dataArray[id];
    overlay.querySelector('img').src = dataItem.img;
    overlay.querySelector('img').alt = dataItem.name;
    overlay.querySelector('h3').innerText = dataItem.name;
    overlay.querySelector('h4').innerText = `${dataItem.type} - ${dataItem.breed}`;
    overlay.querySelector('p').innerText = dataItem.description;
    overlay.querySelector('.pet__age div').innerHTML = `<span>Age: </span> ${dataItem.age}`;
    overlay.querySelector('.pet__inoculations div').innerHTML = `<span>Inoculations: </span> ${dataItem.inoculations.join(', ')}`;
    overlay.querySelector('.pet__diseases div').innerHTML = `<span>Diseases: </span> ${dataItem.diseases.join(', ')}`;
    overlay.querySelector('.pet__parasites div').innerHTML = `<span>Parasites: </span> ${dataItem.parasites.join(', ')}`;

    document.body.append(overlay);
    setTimeout(() => document.body.classList.add('modal'), 150);
}

function closeOverlay() {
    document.body.classList.remove('modal');
    setTimeout(() => document.querySelector('.overlay').remove(), 150);
}