import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// czyszczenie wyszukiwania i informacji o wyszukanym wcześniej kraju
const clearResult = () => {
  countryListEl.innerHTML = '';
  countryInfo.innerHTML = '';
};

searchEl.addEventListener(
  'input',
  // aby nie było wielu zagnieżdżeń this dodajemy async oraz await
  _.debounce(async ev => {
    const countryName = ev.target.value.trim();
    console.log(countryName);
    //sanityzacja wprowadzonego przez użytkownika ciągu metodą trim, rozwiązuje problem, gdy w polu wprowadza się same spacje lub są one na początku lub końcu wprowadzanego ciągu liter

    if (countryName === '') {
      clearResult();
      return;
    } else if (/[0-9]/.test(countryName)) {
      Notiflix.Notify.failure('Please enter correct country name');
      clearResult();
      return;
    }

    const countries = await fetchCountries(countryName);

    if (!countries) {
      clearResult();
      return;
    }

    if (countries.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else {
      clearResult();
      countryListEl.innerHTML = countries
        .map(country => {
          const svgLink = country.flags.svg; //country.flags.png
          const name = country.name.official; // nazwa "official" to Republik of Poland a nazwa "common" to Poland
          return `<li class='country-list__element'><img class='country-elem__image' src="${svgLink}" alt='country flag' width="50" height="50" /><p class='country-elem__text'>${name}</p> </li>`;
        })
        .join('');
    }

    if (countries.length === 1) {
      clearResult();
      countryInfo.innerHTML = countries.map(country => {
        const svgLink = country.flags.svg;
        const name = country.name.official;
        return `
        <div class='country-info__header'><img class="country-info__flag" src="${svgLink}" alt='country flag' width="50" height="50" /><p class="country-info__name" >${name}</p></div>
        <ul class='country-info__details-list'>
        <li class='details-list__elem' ><span class='details-list__name'>Capital: </span><span class='details-list__value'> ${
          countries[0].capital
        }</span></li>


        <li class='details-list__elem' ><span class='details-list__name'>Population: </span><span class='details-list__value'> ${
          countries[0].population
        }</span></li>


        <li class='details-list__elem' ><span class='details-list__name'>Languages: </span><span class='details-list__value'> ${Object.values(
          countries[0].languages
        ).join(', ')}</span></li>
        </ul>
        `;
      });
    }
    console.log(countries);
  }, DEBOUNCE_DELAY)
);
