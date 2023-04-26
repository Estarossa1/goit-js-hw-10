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
  const countries = country
  .map(
    ({ 
      name, 
      flags,
      capital, 
      population, 
      languages, 
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
          }) + ' million.';
      }
      return `
          <img src="${flags.svg}" alt="${name}" width="320" height="auto">
          <p> ${name.official}</p>
          <p>Capital: <span> ${capital}</span></p>
          <p>Population: <span> ${formattedPopulation} </span></p>
          <p>Languages: <span> ${languages}</span></p>`
    }
  )
  .join('');
countryInfo.innerHTML = countries;
return countries;
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