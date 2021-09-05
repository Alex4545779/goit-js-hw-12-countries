/* debounce from lodash */
import _ from 'lodash';

/* pnotify */
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { defaults } from '@pnotify/core';
defaults.maxTextHeight = null;

/* Template */
import countryCardTpl from '../templates/country-card.hbs';
import countriesList from '../templates/countries-list.hbs';

/* Additional parts js */
import API from '../js/fetchCountries';
import getRefs from '../js/get-refs';

// const debounce = require('lodash.debounce');

const refs = getRefs();
refs.searchInput.addEventListener('input', _.debounce(onSearch, 500));

function onSearch(e) {
  e.preventDefault();

  const inputValue = e.target.value.trim();

  if (!inputValue) {
    return;
  } else if (inputValue) {
    renderCountryCard(inputValue);
  }

  refs.cardContainer.innerHTML = '';
  API.fetchCountry(inputValue).then(renderCountryCard).catch(onFetchError);
}

function renderCountryCard(countries) {
  if (countries.length < 1) {
    return;
  }
  if (countries.length === 1) {
    refs.cardContainer.innerHTML = countryCardTpl(...countries);
    //console.log(...countries);
  }
  if (countries.length >= 2 && countries.length <= 10) {
    refs.cardContainer.innerHTML = countriesList(countries);

    //console.log(refs.cardContainer);
    refs.cardContainer.addEventListener('click', onItemClick);
  }

  if (countries.length > 10) {
    error({
      title: 'Too many matches found.',
      text: ' Please enter a more specific query!',
      styling: 'brighttheme',
      delay: 2000,
    });
  }

  if (countries.status === 404) {
    error({
      title: 'Not found.',
      text: ' Please enter a more specific query!',
      styling: 'brighttheme',
      delay: 2000,
    });
  }
}

// function onFetchError() {
//   error({
//     title: 'Too many matches found.',
//     text: ' Please enter a more specific query!',
//     styling: 'brighttheme',
//     delay: 2000,
//   });
// }

function onFetchError(messageError) {
  error({
    delay: 2000,
    text: `${messageError}`,
  });
  console.log(`${messageError}`);
}

function onItemClick(event) {
  const inputValue = event.target.textContent;
  console.log(event.target.textContent);
}
