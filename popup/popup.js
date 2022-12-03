const apiKeyField = document.getElementById('openAiApiKey');

// apiKey show/hide button
document.getElementById('showKey').onclick = function () {
  if (apiKeyField.type === 'password') {
    apiKeyField.type = 'text';
    document.getElementById('showKey').text = '🔓';
  } else {
    apiKeyField.type = 'password';
    document.getElementById('showKey').text = '🔒';
  }
};

// update slider's value displays on slider change
sliders = document.getElementsByClassName('shortSlider');
for (let i = 0; i < sliders.length; i++) {
  sliders[i].addEventListener('input', function () {
    document.getElementById(`${sliders[i].id}DisplayedValue`).innerText =
      sliders[i].value;
  });
}

// Load saved settings
browser.storage.local.get('gpt3-settings').then((obj) => {
  Logger.debug('loaded settings', obj);
  for (const [key, value] of Object.entries(obj['gpt3-settings'])) {
    Logger.info(key, value);
    document.getElementById(key).value = value;
    if (key == 'model') {
      let options = document.getElementById(key).children;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
          options[i].selected = true;
        }
      }
    } else if (key.includes('Prompt')) {
      continue;
    } else {
      document.getElementById(`${key}DisplayedValue`).innerText = value;
    }
  }
});
browser.storage.local.get('openAiApiKey').then((obj) => {
  apiKeyField.value = obj.openAiApiKey;
  apiKeyField.type = 'password';
  document.getElementById('showKey').text = '🔒';
});

// Save settings on closing the popup
window.addEventListener('unload', function () {
  Logger.debug('popup unload!');
  let settingObj = {};
  let settings = document.getElementsByClassName('setting');
  Logger.info('settings:', settings);
  for (let i = 0; i < settings.length; i++) {
    let inputField = settings[i].firstElementChild;
    settingObj[inputField.id] = inputField.value;
  }
  Logger.info('settings to save:', settingObj);
  browser.storage.local.set({
    'gpt3-settings': settingObj,
    openAiApiKey: apiKeyField.value,
  });
  Logger.debug('Settings saved!');
});

// ==== html util
let summaryTabButton = Object.assign(document.createElement('button'), {
  innerText: 'Summary Settings',
  className: 'tablink',
});
let interactiveTabButton = Object.assign(document.createElement('button'), {
  innerText: 'Interactive Settings',
  className: 'tablink',
});

summaryTabButton.addEventListener('click', (e) =>
  openTab(e, 'summarySettings')
);
interactiveTabButton.addEventListener('click', (e) =>
  openTab(e, 'interactiveSettings')
);

let sb = document.getElementById('settingsBox');
sb.insertBefore(interactiveTabButton, sb.firstChild);
sb.insertBefore(summaryTabButton, sb.firstChild);
summaryTabButton.click();

function openTab(evt, tabName) {
  console.log('openTAb');
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="settingsBox" and hide them
  tabcontent = document.getElementsByClassName('settingsTab');
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName('tablink');
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = 'block';
  evt.target.className += ' active';
  console.log(evt.target);
}
