const searchButtonEl = document.querySelector('[data-js="search-button"]')
const filterSectionEl = document.querySelector('[data-js="filter"]')
const filterContainerEl = filterSectionEl.querySelector('.filter__container')

let isFilterActive = false

const getFilterContanerHeight = () => filterContainerEl.getBoundingClientRect().height

const setFilterActivation = () => {
    const isFilterContainerActive = filterContainerEl.classList.contains('is-active')
    console.log(isFilterContainerActive)
    if (!isFilterActive && !isFilterContainerActive) {
        filterSectionEl.style.height = `${getFilterContanerHeight()}px`
        filterContainerEl.classList.add('is-active')
        isFilterActive = true
    } else {
        filterSectionEl.style.height = '0px'
        filterContainerEl.classList.remove('is-active')
        isFilterActive = false
    }
}

searchButtonEl.addEventListener('click', () => {
    searchButtonEl.classList.toggle('is-active')
    setFilterActivation()
})

window.addEventListener('resize', () => {
    setFilterActivation()
})