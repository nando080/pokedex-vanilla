const searchButtonEl = document.querySelector('[data-js="search-button"]')
const filterSectionEl = document.querySelector('[data-js="filter"]')
const filterContainerEl = filterSectionEl.querySelector('.filter__container')
const pokemonsContainerEl = document.querySelector('.pokemon')

const pokemons = []

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

const createPokemonElement = ({id, name, type}) => {
    const pokeDiv = document.createElement('div')
    pokeDiv.classList.add('pokemon__item')
    pokeDiv.classList.add(`u-${type[0]}-bg`)
    console.log(name)
    pokeDiv.innerHTML = `
    <img src="img/pokemon-gif/${name.toLowerCase()}.gif" alt="${name}" class="pokemon__img">
    <p class="pokemon__id">${getFormatedID(id)}</p>
    <h2 class="pokemon__name">${name.toUpperCase()}</h2>
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
    console.log(pokemons);
}

searchButtonEl.addEventListener('click', () => {
    searchButtonEl.classList.toggle('is-active')
    setFilterActivation()
})

window.addEventListener('resize', () => {
    setFilterActivation()
})

fetchPokemons()