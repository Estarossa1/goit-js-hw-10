import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 300;
const countyList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const searchBox = document.querySelector('input#search-box');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY))

function onSearch(e) {
  const searchQuery = e.target.value.trim();

  if (!searchQuery) {
    clearFields();
    return
  }

  fetchCountries(searchQuery)
    .then(
      data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      checkСountries(data)
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
}


function templateCountrieslist(countries) {
  return countries
    .map(({ name, flags }) =>
      `<li class="country_list">  
        <img src='${flags.png}' alt="${name.official}" width ='60' height='50'>
        <p class='county-name'>${name.official}</p>
      </li>`)
    .join('');
};

function templateCountryInfo(country) {
  return country.map(
    ({ name, flags ,capital, population,  languages }) =>
      ` <div class="wrapper">
          <img src="${flags.png}" alt="${name.official}" width="150" height="100">
          <h1 class="name-country">${name.common}</h1>
        </div>
        <ul class="info-list">
          <li class="info-item">Capital: ${capital}</li>
          <li class="info-item">Population: ${population}</li>
          <li class="info-item">Languages: ${Object.values(languages)}</li>
        </ul>`
  );
}

function clearFields(){
  countryInfo.innerHTML = '';
  countyList.innerHTML = '';
}

function checkСountries(country){
  if (country.length === 1) {
    countyList.innerHTML = "";
    countryInfo.innerHTML = templateCountryInfo(country);
  } else {  
    countryInfo.innerHTML = "";
    countyList.innerHTML = templateCountrieslist(country);
  }
}