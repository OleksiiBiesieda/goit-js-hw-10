import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    let inputValue = event.target.value.trim();
    if (inputValue === '') {
        return;
    }
    fetchCountries(inputValue).then(countries => {
        countriesList.innerHTML = "";
        countryInfo.innerHTML = "";
        if (countries.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
        } else if (countries.length >= 2 && countries.length <= 10) {
            const markup = countries.map(country =>
                `<li class="country-list-item">
                <img width=40  src=${country.flags.svg} alt ="flag" class="item-flag"></img>
                <p class="item-text">${country.name.official}</p>
                </li>`).join('');
            countriesList.insertAdjacentHTML('beforeend', markup);

        } else if (countries.length === 1) {
            
            const markup = countries.map(country => 
            {
                const languagesObj = country.languages;
                const languages = Object.values(languagesObj);
                return `<div class="country-general">
                <img class="flag" src=${country.flags.svg} alt="flag" width=60 height=40></img>
                <h2 class="country-name">${country.name.official}</h2>
                </div>
                <p class="country-text">Capital: <span class="country-text-span">${country.capital}</span></p>
                <p class="country-text">Population: <span class="country-text-span">${country.population}</span></p>
                <p class="country-text">Languages: <span class="country-text-span"> ${ languages }</span></p>`});
             countryInfo.insertAdjacentHTML('beforeend', markup);
        }
    }).catch(error =>  Notiflix.Notify.failure("Oops, there is no country with that name"))
    
}