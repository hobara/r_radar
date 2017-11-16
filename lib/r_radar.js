$(document).ready(() => {

  const subReddits = [
    'gaming', 'funny', 'worldnews',
    'todayilearned', 'pics', 'gifs', 'videos',
    'movies', 'television', 'Jokes', 'sports',
    'Music', 'dataisbeautiful', 'science', 'books',
    'personalfinance', 'LifeProTips', 'food', 'Art',
    'history', 'DIY', 'philosophy'
  ];

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
      $('.post-list').fadeOut(1500);
      $('.main-post').append('<ul class="post-list"></ul>');
      newURLs = selectURLs(selectedId);
      scrapeData(newURLs);
    });
  });

  // return an array of urls of the selected subReddits.
  const selectURLs = (data) => {
    let selectedURLs = [];
    let defaultUrl = 'https://www.reddit.com/r/news/';
    data.forEach((id) => {
      selectedURLs.push(`https://www.reddit.com/r/${subReddits[id]}/`);
    });
    if (selectedURLs.length === 0) {
      selectedURLs.push(defaultUrl);
    }
    return selectedURLs;
  };

  // make AJAX request and parse the response.
  // append each post to DOM.
  const scrapeData = (urls) => {
    let responseText;
    urls.forEach((url) => {
      const posts =
      $.ajax({
        method: 'GET',
        url: url,
        async: false,
        success: function(res) {
          responseText = res;
        }
      });
      // sanitize the response before appending.
      const postArr = responseText.split('<div class="top-matter">');
      for (let i = 1; i < postArr.length - 1; i++) {
        let postTag;
        if (postArr[i].includes('<a class="thumbnail')) {
          postTag = postArr[i].split('<a class="thumbnail')[0];
        } else {
          postTag = postArr[i];
        }
        const eachPost = `<div class="top-matter">${postTag}</div>`;
        $('.post-list').append(eachPost);
      }
      $(`.top-matter`).on('mouseover', (e) => {
        $(e.currentTarget).addClass('active-post');
      });
      $(`.top-matter`).on('mouseleave', (e) => {
        $(e.currentTarget).removeClass('active-post');
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
