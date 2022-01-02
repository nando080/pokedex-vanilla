const searchButtonEl = document.querySelector('[data-js="search-button"]')

searchButtonEl.addEventListener('click', () => {
    searchButtonEl.classList.toggle('is-active')
})