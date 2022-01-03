const searchButtonEl = document.querySelector('[data-js="search-button"]')
const filterContainerEl = document.querySelector('[data-js="filter"]')

searchButtonEl.addEventListener('click', () => {
    searchButtonEl.classList.toggle('is-active')
    filterContainerEl.classList.toggle('is-active')
})