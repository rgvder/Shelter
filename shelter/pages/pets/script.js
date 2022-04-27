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
    document.body.classList.toggle('modal');
    mobile.classList.toggle('mobile_opened')
});

mobileBlackout.addEventListener('click', closeMobileMenu);

mobileLinks.forEach((mobileLink) => mobileLink.addEventListener('click', closeMobileMenu));

// -------------PAGINATION AND POPUP-------------

const cardArray = [];
const cardTemplate = document.getElementById('cardTemplate');
const overlayTemplate = document.getElementById('overlayTemplate');
const paginationWrap = document.querySelector('.slider-pets__wrapper');

const buttonFirst = document.getElementById('buttonFirst');
const buttonPrevious = document.getElementById('buttonPrevious');
const buttonNext = document.getElementById('buttonNext');
const buttonLast = document.getElementById('buttonLast');

const paginationNumber = document.getElementById('paginationNumber');

const ITEMS_COUNT = 48;

let cardPerPage;
let pageArray = [];
let pageCount;
let currentPage = 0;
const dataArray = [];

function renderPage(pageNumber) {
    currentPage = pageNumber;

    paginationNumber.innerText = currentPage + 1;

   const elements = Object.values(pageArray[pageNumber]);

    paginationWrap.innerHTML = '';

    elements.forEach((element) => {
        paginationWrap.append(element.cloneNode(true));
    })

    console.log(paginationWrap)

    buttonFirst.removeAttribute('disabled');
    buttonPrevious.removeAttribute('disabled');
    buttonNext.removeAttribute('disabled');
    buttonLast.removeAttribute('disabled');

    if (currentPage === 0) {
        buttonFirst.setAttribute('disabled', 'disabled');
        buttonPrevious.setAttribute('disabled', 'disabled');
    }

    if (currentPage === pageArray.length - 1) {
        buttonNext.setAttribute('disabled', 'disabled');
        buttonLast.setAttribute('disabled', 'disabled');
    }
}

function addEventListeners() {
    window.addEventListener('resize', () => {
        init();
    })

    buttonFirst.addEventListener('click', () => {
        renderPage(0);
    })

    buttonPrevious.addEventListener('click', () => {
        renderPage(currentPage - 1);
    })

    buttonNext.addEventListener('click', () => {
        renderPage(currentPage + 1);
    })

    buttonLast.addEventListener('click', () => {
        renderPage(pageArray.length - 1);
    })
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
            card.querySelector('.slider-pets__element').setAttribute('data-id', i);
            cardArray.push(card);
        });
        init();

        addEventListeners();
    });

function init() {
    const screenWidth = window.innerWidth;
    let count;
    switch (true) {
        case screenWidth >= 1280:
            count = 8;
            break;
        case screenWidth >= 768:
            count = 6;
            break;
        default:
            count = 3;
    }

    if (count === cardPerPage) {
        return;
    }

    cardPerPage = count;

    currentPage = 0;

    pageCount = ITEMS_COUNT / cardPerPage;

    pageArray = [];

    for (let i = 0; i < pageCount; i++) {
        const cardArrayPerPage = cardArray.reduce((result, card, i) => {
            if (i < cardPerPage) {
                const getRandom = () => {
                    let n;
                    do {
                        n = `${Math.floor(Math.random() * cardArray.length)}`;
                    } while (Object.keys(result).includes(`card-${n}`));
                    return n;
                };
                const rand = getRandom();
                result[`card-${rand}`] = cardArray[rand].cloneNode(true);
            }
            return result;
        }, {})
        pageArray.push(cardArrayPerPage);
    }
    console.log(pageArray);

    renderPage(currentPage);
}

// -------------POPUP-------------

paginationWrap.addEventListener('click', (event) => {
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

