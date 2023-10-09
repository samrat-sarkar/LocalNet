document.addEventListener('DOMContentLoaded', function() {
  var loginForm = document.getElementById('loginForm');
  var loginButtonContainer = document.getElementById('loginButtonContainer');
  var uidInput = document.getElementById('uid');
  var passwordInput = document.getElementById('password');
  var saveButton = document.getElementById('saveButton');
  var loginButton = document.getElementById('loginButton');
  var successMessage = document.getElementById('successMessage');
  var errorMessage = document.getElementById('errorMessage');
  var openloginpageButton = document.getElementById('openloginpageButton');
  var clearStorageButton = document.getElementById('clearStorageButton');
  
  clearStorageButton.addEventListener('click', function() {
    chrome.storage.local.remove(['uid', 'password'], function() {
		successMessage.innerText = 'Data cleared successfully!';
        successMessage.style.display = 'block';
    });
  });
  
  openloginpageButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://internet.lpu.in/' });
  });

  chrome.storage.local.get(['uid', 'password'], function(result) {
    var savedUID = result.uid;
    var savedPassword = result.password;

    if (savedUID && savedPassword) {
      loginForm.style.display = 'none';
      loginButtonContainer.style.display = 'block';
    }

    uidInput.value = savedUID || '';
    passwordInput.value = savedPassword || '';
  });

  saveButton.addEventListener('click', function() {
    var uid = uidInput.value;
    var password = passwordInput.value;

    if (uid && password) {
      chrome.storage.local.set({ 'uid': uid, 'password': password }, function() {
        loginForm.style.display = 'none';
        loginButtonContainer.style.display = 'block';
        successMessage.innerText = 'Data saved successfully!';
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
      });
    } else {
      errorMessage.innerText = 'UID and Password are required.';
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
    }
  });

  loginButton.addEventListener('click', function() {
    chrome.storage.local.get(['uid', 'password'], function(result) {
      var uid = result.uid;
      var password = result.password;

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'autofill', uid: uid, password: password }, function(response) {
          if (response && response.success) {
            successMessage.innerText = 'Login data autofilled successfully !';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            chrome.tabs.sendMessage(tabs[0].id, { action: 'login' }, function(loginResponse) {
              if (loginResponse && loginResponse.success) {
                console.log('Login button clicked.');
              } else {
                console.error('Error: Could not click the login button.');
              }
            });
          } else {
            errorMessage.innerText = 'Error: Could not autofill login data.';
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
          }
        });
      });
    });
  });
});
