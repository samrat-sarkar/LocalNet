chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'autofill') {
    var usernameField = document.querySelector('input[name="username"]');
    var passwordField = document.querySelector('input[name="password"]');
    var agreeCheckbox = document.getElementById('agreepolicy');
    var loginButton = document.getElementById('loginbtn');

    if (usernameField && passwordField && agreeCheckbox && loginButton) {

      usernameField.value = request.uid;
      passwordField.value = request.password;

      agreeCheckbox.checked = true;
      agreeCheckbox.dispatchEvent(new Event('change'));

      if (agreeCheckbox.checked) {
        loginButton.disabled = false;

        loginButton.click();

        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Checkbox not checked.' });
      }
    } else {
      sendResponse({ success: false, error: 'Fields not found.' });
    }
  } else {
    sendResponse({ success: false, error: 'Invalid action.' });
  }
});
