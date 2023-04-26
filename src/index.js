import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');


searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));
function onInputSearch(event) {
  event.preventDefault();
  const searchCountries = event.target.value.trim();
  if (!searchCountries) {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(searchCountries)
  .then(result => {
    if (result.length > 10) {
      Notify.info('Too many matches found. Please, enter a more specific name.');
      return;
    }
    renderedContries(result);
  })
  .catch(error => {
    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    Notify.failure('Oops, there is no country with that name');
  });
}

function renderedContries(result) {
  const inputLetters = result.length;

  if (inputLetters === 1) {
    countriesList.innerHTML = '';
    countryCardMarkup(result);
  }

  if (inputLetters > 1 && inputLetters <= 10) {
    countryInfo.innerHTML = '';
    countryCardMarkup(result);
  }
}

function countryCardMarkup(result) {
  const listMarkrup = result
  .map(({name, flags}) => {
    return `
      <li>
        <img src="${flags.svg}" alt="${name}" width="60" height="auto">
        <span>${name.official}</span>
      </li>
      `;
  })
  .join('');
  countriesList.innerHTML = listMarkrup;
  return listMarkrup;
}

function countryCardMarkup(result) {
  const cardMarkup = result
  .map (({
    flags,
    name,
    capital,
    population,
    languages,
    subregion,
    timezones,
  }) => {
    languages = Object.values(languages).join(', ');
    let formattedPopulation = '';
    if (population < 1000000) {
      formattedPopulation = population.toLocaleString('en');
    } else {
      formattedPopulation =
        (population / 1000000).toLocaleString('en', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3,
        }) + 'million.';
    }
    return `
    <img src="${flags.svg}" alt="${name}" width="320" height="auto">
    <p> ${name.official}</p>
    <p>Capital: <span> ${capital}</span></p>
    <p>Population: <span> ${formattedPopulation} </span></p>
    <p>Languages: <span> ${languages}</span></p>
    <p>Subregion: <span> ${subregion}</span></p>
    <p>Timezone: <span> ${timezones}</span></p>
    `;
  })
  .join('');
  countryInfo.innerHTML = cardMarkup;
  return cardMarkup;
}
