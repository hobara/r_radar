$(document).ready(() => {

  const subReddits = [
    'gaming', 'funny', 'worldnews',
    'todayilearned', 'pics', 'gifs', 'videos',
    'movies', 'television', 'Jokes', 'sports',
    'Music', 'dataisbeautiful', 'science', 'books',
    'personalfinance', 'LifeProTips', 'food', 'Art',
    'history', 'DIY', 'philosophy'
  ];

  // create subreddit selectors and on-click event to update posts.
  let selectedId = [];
  subReddits.forEach((sub, i) => {
    let subList =
      `<li><label class="container" id="${i}" style="display: block;">
      <input type="checkbox" class='checkbox-${i}'>
      <span class="checkmark"></span>
      ${sub}</label></li>`;
    $('.sub-list').append(subList);
    $(`.checkbox-${i}`).on('click', (e) => {
      let newURLs;
      if (selectedId.includes(i)) {
        let index = selectedId.indexOf(i);
        selectedId.splice(index, 1);
      } else {
        selectedId.push(i);
      }
      $('.post-list').fadeOut(1000);
      $('.main-post').append('<ul class="post-list"></ul>');
      newURLs = selectURLs(selectedId);
      scrapeData(newURLs);
    });
  });

  // return an array of urls of the selected subReddits.
  const selectURLs = (data) => {
    let selectedURLs = [];
    let defaultUrl = 'https://www.reddit.com/r/news.json';
    data.forEach((id) => {
      selectedURLs.push(`https://www.reddit.com/r/${subReddits[id]}.json`);
    });
    if (selectedURLs.length === 0) {
      selectedURLs.push(defaultUrl);
    }
    return selectedURLs;
  };

  // make cross-origin AJAX request and parse the response.
  // append each post to DOM.
  const scrapeData = (urls) => {

    const getCORS = (url, success) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = success;
      xhr.send();
      return xhr;
    };
    // sanitize the response before appending.
    urls.forEach((url) => {
      getCORS(url, function(request){
        let response = request.currentTarget.response || request.target.responseText;
        const postArr = JSON.parse(response).data.children;
        for (let i = 0; i < postArr.length; i++) {
          let data = postArr[i].data;
          let sublink = `https://www.reddit.com/${data.permalink}`;

          const eachPost = `<div class="top-matter">
            <div class='title'><a href='${data.url}'>${data.title}</a></div>
            <p class='domain'>${data.domain}</p>
            <p class='tagline'><a href='${sublink}'>${data.score} upvotes :
            ${data.num_comments} comments : posted by ${data.author}</a></p>
            </div>`;
          $('.post-list').append(eachPost);
          
          $(`.top-matter`).on('mouseover', (e) => {
            $(e.currentTarget).addClass('active-post');
          });
          $(`.top-matter`).on('mouseleave', (e) => {
            $(e.currentTarget).removeClass('active-post');
          });
        }
      });

    });
  };

  // add jQuery event listners for mouseover.
  $(`.container`).on('mouseover', (e) => {
    $(e.currentTarget).addClass('active');
  });
  $(`.container`).on('mouseleave', (e) => {
    $(e.currentTarget).removeClass('active');
  });

  const urls = selectURLs(selectedId);
  scrapeData(urls);
});
