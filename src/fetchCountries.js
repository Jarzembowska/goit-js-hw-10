import Notiflix from 'notiflix';

const API_URL = 'https://restcountries.com/v3.1/name/';

export const fetchCountries = name => {
  //funkcja. która tworzy żądanie HTTP do endpointa /name
  //i przekazuje obietnicę. której wynikiem będzie tablica krajów
  return fetch(
    `${API_URL}/${name}?fields=name,capital,population,flags,languages`
  )
    .then(res => {
      if (res.ok) {
        res.json();
      }
      if (!res.ok) {
        throw new Error(response.status);
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
};
