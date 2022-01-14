const searchButtonEl = document.querySelector('[data-js="search-button"]')
const filterSectionEl = document.querySelector('[data-js="filter"]')
const filterContainerEl = filterSectionEl.querySelector('.filter__container')
const pokemonsContainerEl = document.querySelector('.pokemon')

const pokemons = []

let isFilterActive = false

const getFilterContanerHeight = () => filterContainerEl.getBoundingClientRect().height

const setFilterActivation = () => {
    const isFilterContainerActive = filterContainerEl.classList.contains('is-active')
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

const getFormatedID = value => {
    let id = ''
    if (value < 10) {
        id = `00${value}`
        return id
    }
    if (value < 100) {
        id = `0${value}`
        return id
    }
    return value
}

const formatPokemonName = name => name.replace(/♀/g, '_f').replace(/♂/g, '_m').replace(/['.\s]/g, '').toLowerCase()


const createPokemonElement = ({id, name, type}) => {
    const pokeDiv = document.createElement('div')
    pokeDiv.classList.add('pokemon__item')
    pokeDiv.classList.add(`u-${type[0]}-bg`)
    pokeDiv.dataset.id = id
    pokeDiv.innerHTML = `
    <img src="img/pokemon-gif/${formatPokemonName(name)}.gif" alt="${name}" class="pokemon__img" data-id="${id}">
    <p class="pokemon__id" data-id="${id}">${getFormatedID(id)}</p>
    <h2 class="pokemon__name" data-id="${id}">${name.toUpperCase()}</h2>
    `
    return pokeDiv
}

const createAllPokemons = pokemonList => {
    const allPokemons = []
    pokemonList.forEach(pokemon => {
        allPokemons.push(createPokemonElement(pokemon))
    })
    return allPokemons
}

const insertPokemonsIntoDOM = pokemonElements => {
    pokemonElements.forEach(pokemonEl => {
        pokemonsContainerEl.appendChild(pokemonEl)
    })
}

const fillPokemonsList = pokemonList => {
    pokemonList.forEach(pokemon => {
        pokemons.push(pokemon)
    })
}

const fetchPokemons = async () => {
    const data = await fetch('../db/pokedex.json')
    const pokelist = await data.json()
    fillPokemonsList(pokelist)
    insertPokemonsIntoDOM(createAllPokemons(pokelist))
}

const getTypeBadgesString = (types, section) => {
    let imgsString = ''
    types.forEach(type => {
        if (section === 'type') {
            imgsString += `
            <img src="img/type-badges/${type}.svg" alt="${type}" class="modal__type">
            `
        }
        if (section === 'weaknesses') {
            imgsString += `
            <img src="img/type-badges/${type}.svg" alt="${type}" class="modal__weaknesses-icon">
            `
        }
    })
    return imgsString
}

//TODO GET STATUS BAR

const createPokemonModal = pokemon => {
    const {id, name, height, weight, type, weaknesses, stats} = pokemon
    const prevEvolution = pokemon['prev_evolution']
    const nextEvolution = pokemon['next_evolution']
    const formatedID = getFormatedID(id)
    const mainType = type[0].toLowerCase()
    const secondaryType = type[0].toLowerCase()

    const modal = document.createElement('div')
    modal.setAttribute('class', `modal u-${type[0].toLowerCase()}-bg`)

    modal.innerHTML = `
        <div class="modal__container">
            <div class="modal__info-container">
                <div class="modal__id">
                    <img src="img/interface/pokeball-gray.svg" alt="id" class="modal__id-icon">
                    <h3 class="modal__id-number">${formatedID}</h3>
                </div>
                <img src="img/pokemon-png/${formatedID}.png" alt="${name}" class="modal__img">
                <h2 class="modal__name u-#${mainType}-text">${name}</h2>
                <div class="modal__type-container">
                    ${getTypeBadgesString(type, 'type')}
                </div>
                <div class="modal__measure-container">
                    <div class="modal__measure">
                        <img src="img/interface/weight.svg" alt="weight" class="modal__measure-icon">
                        <p class="modal__measure-value">${weight}</p>
                    </div>
                    <div class="modal__measure">
                        <img src="img/interface/size.svg" alt="size" class="modal__measure-icon">
                        <p class="modal__measure-value">${height}</p>
                    </div>
                </div>
            </div>

            <div class="modal__stats-container">
                <div class="modal__weaknesses">
                    <h2 class="modal__title">weaknesses</h2>
                    <div class="modal__weaknesses-container">
                        ${getTypeBadgesString(weaknesses, 'weaknesses')}
                    </div>
                </div>

                <div class="modal__stats-chart">
                    <h2 class="modal__title">stats</h2>
                    <div class="modal__stats-chart-bar-container">
                        <p class="modal__stats-chart-name">hp</p>
                        <div class="modal__stats-chart-bar u-grass-bg"></div>
                    </div>
                    <div class="modal__stats-chart-bar-container">
                        <p class="modal__stats-chart-name">atk</p>
                        <div class="modal__stats-chart-bar u-grass-bg"></div>
                    </div>
                    <div class="modal__stats-chart-bar-container">
                        <p class="modal__stats-chart-name">def</p>
                        <div class="modal__stats-chart-bar u-grass-bg"></div>
                    </div>
                    <div class="modal__stats-chart-bar-container">
                        <p class="modal__stats-chart-name">spatk</p>
                        <div class="modal__stats-chart-bar u-grass-bg"></div>
                    </div>
                    <div class="modal__stats-chart-bar-container">
                        <p class="modal__stats-chart-name">spdef</p>
                        <div class="modal__stats-chart-bar u-grass-bg"></div>
                    </div>
                    <div class="modal__stats-chart-bar-container">
                        <p class="modal__stats-chart-name">speed</p>
                        <div class="modal__stats-chart-bar u-grass-bg"></div>
                    </div>
                </div>

                <div class="modal__evolution">
                    <h2 class="modal__title">evolutions</h2>
                    <div class="modal__evolution-container">
                        <img src="img/pokemon-gif/bulbasaur.gif" alt="bulbassaur" class="modal-evolution-img">
                        <img src="img/pokemon-gif/ivysaur.gif" alt="ivysaur" class="modal-evolution-img">
                        <img src="img/pokemon-gif/venusaur.gif" alt="venusaur" class="modal-evolution-img">
                    </div>
                </div>
            </div>

        </div>
    `
}


searchButtonEl.addEventListener('click', () => {
    searchButtonEl.classList.toggle('is-active')
    setFilterActivation()
})

window.addEventListener('resize', () => {
    isFilterActive = true
    setFilterActivation()
})

pokemonsContainerEl.addEventListener('click', event => {
    const pokeIndex = Number((event.target.dataset.id)) - 1
    console.log(pokemons[pokeIndex])
    createPokemonModal(pokemons[pokeIndex])
})

fetchPokemons()