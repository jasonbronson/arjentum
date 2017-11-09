// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
//import { greet } from './hello_world/hello_world';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const settings = require('electron-settings');

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

settings.set('author', {
  first: 'Jason',
  last: 'Bronson'
});

settings.get('author.first');
settings.has('author.last');

//document.querySelector('#greet').innerHTML = greet();
//document.querySelector('#os').innerHTML = osMap[process.platform];
//document.querySelector('#author').innerHTML = `${settings.get('author.first')} ${settings.get('author.last')}`;
//document.querySelector('#env').innerHTML = env.name;
//document.querySelector('#electron-version').innerHTML = process.versions.electron;


// Reddit fetch
const menuEl = document.querySelector('.menu');
const entriesEl = document.querySelector('.entries');
const subredditBtn = document.querySelector('.subreddit-button');
const subredditEl = document.querySelector('.subreddit-input');
const subredditSelect = document.querySelector('.subreddit-select');

const fetchSubreddit = (url) => {
  if (url) {
    fetch('https://www.reddit.com/r/' + url + '.json').then(function(response) {
      return response.json();
    }).then(function(json) {
      let links = '';

      for (let i = 0; i < json.data.children.length; i++) {
        links += '<li><a href="' + json.data.children[i].data.url + '">' +
          json.data.children[i].data.url + '</a></li>';
      }

      entriesEl.innerHTML = '';
      entriesEl.innerHTML = '<ul>' + links + '</ul>';
    });
  }
}

subredditBtn.addEventListener('click', (e) => {
  let subreddit = subredditEl.value;
  let subredditsByTopicUrl = `https://www.reddit.com/api/subreddits_by_topic.json?query=${subreddit}`;

  fetch(subredditsByTopicUrl).then(function(response) {
    return response.json();
  }).then(function(json) {
    const select = document.createElement('select');
    let links = '<option value="empty" selected disabled>Select one topic</option>';

    for (let k = 0; k < json.length; k++) {
      links += '<option value="' + json[k].name + '">' + json[k].name +
        '</option>';
    }

    //subredditSelect.innerHTML = links;

    //subredditSelect.classList.remove('hidden');

    /*subredditSelect.addEventListener('change', (e) => {
      fetchSubreddit(e.target.value);
    });
    */
    // menuEl.appendChild(select);
  })
});
