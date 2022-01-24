const searchButtonEl = document.querySelector('[data-js="search-button"]')
const filterSectionEl = document.querySelector('[data-js="filter"]')
const filterContainerEl = filterSectionEl.querySelector('.filter__container')
const pokemonsContainerEl = document.querySelector('.pokemon')
const filterButtonsContainerEL = document.querySelector('.filter__button-container')
const filterInputEl = document.querySelector('.filter__input')

const pokemons = []

let isFilterActive = false
let isFiltered = false

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
        if (pokemons.length > 0 && isFiltered) {
            insertPokemonsIntoDOM(createAllPokemons(pokemons))
        }
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

const formatPokemonName = name => {
    const formatedName = name
        .replace(/♀/g, '_f')
        .replace(/♂/g, '_m')
        .replace(/['.\s]/g, '')
        .replace(/\(female\)/gi, '_f')
        .replace(/\(male\)/gi, '_m')
        .toLowerCase()
    return formatedName
}



const createPokemonElement = ({ id, name, type }) => {
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
    pokemonsContainerEl.innerHTML = ''
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


const createStatusChartBar = (attribute, value, type) => {
    const barSize = Math.floor((value * 100) / 180)
    const bar = `
    <div class="modal__stats-chart-bar-container">
        <p class="modal__stats-chart-name">${attribute}</p>
        <div class="modal__stats-chart-bar u-${type}-bg" style="width:${barSize}%"></div>
        <p class="modal__stats-chart-value u-${type}-text">${value}</p>
    </div>
    `
    return bar
}

const reduceEvolutions = evolutions => {
    const condition = !(evolutions === null || evolutions === undefined || evolutions === '')
    let evolutionsString = ''
    if (condition) {
        evolutionsString = evolutions.reduce((acc, evolution) =>
            acc + `<img src="img/pokemon-gif/${formatPokemonName(evolution.name)}.gif" alt="${evolution.name}" class="modal__evolution-img" data-id="${evolution.num}">`, '')
    }
    return evolutionsString
}

const createEvolutionsEl = (prev, next) => {
    let prevStrings = ''
    let nextStrings = ''
    prevStrings = reduceEvolutions(prev)
    nextStrings = reduceEvolutions(next)
    if (prevStrings === '' && nextStrings === '') {
        return '<p class="modal__evolution-warn">This pokemon has no evolutions in gen 1.</p>'
    }
    return prevStrings + nextStrings
}

const createPokemonModal = pokemon => {
    const { id, name, height, weight, type, weaknesses, stats } = pokemon
    const prevEvolution = pokemon['prev_evolution']
    const nextEvolution = pokemon['next_evolution']
    const formatedID = getFormatedID(id)
    const mainType = type[0].toLowerCase()
    const secondaryType = type[0].toLowerCase()

    const modal = document.createElement('div')
    modal.setAttribute('class', `modal u-${type[0].toLowerCase()}-bg`)

    modal.innerHTML = `
        <div class="modal__container">
            <div class="modal__close-button">
                <img src="img/interface/close-btn.svg" alt="close pokemon" class="modal__close-button-img">
            </div>
            <div class="modal__info-container">
                <div class="modal__id">
                    <img src="img/interface/pokeball-gray.svg" alt="id" class="modal__id-icon">
                    <h3 class="modal__id-number">${formatedID}</h3>
                </div>
                <img src="img/pokemon-png/${formatedID}.png" alt="${name}" class="modal__img">
                <h2 class="modal__name u-${mainType}-text">${name}</h2>
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
                    ${createStatusChartBar('hp', stats['hp'], mainType)}
                    ${createStatusChartBar('atk', stats['attack'], mainType)}
                    ${createStatusChartBar('def', stats['defense'], mainType)}
                    ${createStatusChartBar('spatk', stats['sp-atk'], mainType)}
                    ${createStatusChartBar('spdef', stats['sp-def'], mainType)}
                    ${createStatusChartBar('speed', stats['speed'], mainType)}
                </div>

                <div class="modal__evolution">
                    <h2 class="modal__title">evolutions</h2>
                    <div class="modal__evolution-container">
                        ${createEvolutionsEl(prevEvolution, nextEvolution)}
                    </div>
                </div>
            </div>

        </div>
    `


    return modal
}

const lockBody = () => {
    document.querySelector('body').classList.add('is-locked')
}

const unlockBody = () => {
    document.querySelector('body').classList.remove('is-locked')
}

const insertModalIntoDOM = pokemon => {
    const body = document.querySelector('body')
    body.appendChild(createPokemonModal(pokemon))
    const pokeModal = body.querySelector('.modal')
    const pokeModalContainer = pokeModal.querySelector('.modal__container')
    pokeModalContainer.classList.add('open')
    pokeModal.classList.add('open')
    const interval = setTimeout(() => {
        pokeModalContainer.classList.remove('open')
        pokeModal.classList.remove('open')
        clearInterval(interval)
    }, 700)
    lockBody()
}

const removeModalDOM = () => {
    const pokeModal = document.querySelector('.modal')
    const pokeModalContainer = pokeModal.querySelector('.modal__container')
    pokeModal.classList.remove('open')
    pokeModal.classList.add('close')
    pokeModalContainer.classList.remove('open')
    pokeModalContainer.classList.add('close')
    const interval = setInterval(() => {
        document.querySelector('body').removeChild(pokeModal)
        clearInterval(interval)
    }, 700)
    unlockBody()
}

const handleEvolutionClick = event => {
    const pokeIndex = event.target.dataset.id
    const condition = !(pokeIndex === '' || pokeIndex === null || pokeIndex === undefined)
    if (condition) {
        const pokeIndexNumber = Number(pokeIndex) - 1
        removeModalDOM()
        const interval = setTimeout(() => {
            insertModalIntoDOM(pokemons[pokeIndexNumber])
            setModalCloseButtonListener()
            setEvolutionsListener()
        }, 700)
    }
}

const setModalCloseButtonListener = () => {
    const modalCloseButton = document.querySelector('.modal__close-button')
    modalCloseButton.addEventListener('click', removeModalDOM)
}

const setEvolutionsListener = () => {
    const evolutionsContainer = document.querySelector('.modal__evolution')
    evolutionsContainer.addEventListener('click', handleEvolutionClick)
}

const filterPokemonsByType = event => {
    const type = event.target.dataset.type
    const condition = type !== undefined && type !== '' && type !== null
    if (condition) {
        const filteredPokemons = pokemons.filter(pokemon => {
            if (pokemon.type[0] === type) {
                return true
            } else {
                return false
            }
        })
        insertPokemonsIntoDOM(createAllPokemons(filteredPokemons))
        isFiltered = true
    }
}

//TODO CONTINUAR IMPLEMENTAÇÃO
const filterPokemonsByName = value => {
    const filteredPokemons = pokemons.filter(pokemon => {
        if (pokemon.name.includes(value)) {
            return true
        } else {
            return false
        }
    })
    console.log(filteredPokemons)
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
    const condition = event.target.dataset.id !== '' && event.target.dataset.id !== undefined && event.target.dataset.id !== null
    if (condition) {
        const pokeIndex = Number((event.target.dataset.id)) - 1
        insertModalIntoDOM(pokemons[pokeIndex])
        setModalCloseButtonListener()
        setEvolutionsListener()
    }
})

filterButtonsContainerEL.addEventListener('click', filterPokemonsByType)

filterInputEl.addEventListener('input', () => {
    const value = filterInputEl.value
    filterPokemonsByName(value)
})

fetchPokemons()