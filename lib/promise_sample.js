let Promise = require('promise');
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

let falsetUrl = 'https://www.reddit.com/r/false.json';
let successUrl = 'https://www.reddit.com/r/news.json';

function asyncFetch(urls) {
  return new Promise((resolve, reject) => {
    urls.forEach((url, i) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 304) {
            resolve(xhr.responseText);
          } else {
            reject(xhr.statusText);
          }
        };
      xhr.send();
      return xhr;
    });
  });
}

asyncFetch([successUrl, successUrl, falsetUrl])
  .then((success) => console.log('All promises are successful!'))
  .catch((error) => console.log('Promise failed!'));
