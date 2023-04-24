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

    if (countries.length > 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else {
      countryListEl.innerHTML = countries
        .map(
          country =>
            `<li><img margin-right="10px" width="24" height="16" src="${country.flags.png}"/>${country.name.common} </li>`
        )
        .join('');
    }

    if (countries.length === 1) {
      countryInfo.innerHTML = `
      <p>Capital: ${countries[0].capital}</p>
      <p>Population: ${countries[0].population}</p>
      <p>Languages: ${Object.values(countries[0].languages).join(', ')}</p>
      `;
    }

    if (countries.lenght === undefined && !fetchCountries.ok) {
      Notiflix.Notify.failure('Oops, there is no country width that name.');
      clearResult();
      return;
    }

    console.log(countries);
  }, DEBOUNCE_DELAY)
);
