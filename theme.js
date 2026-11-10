(function () {
  var storageKey = 'shaform-theme';
  var savedTheme = localStorage.getItem(storageKey);
  var initialTheme = savedTheme === 'luz' ? 'luz' : 'sombra';
  var style = document.createElement('style');

  window.SHAFORM_THEME = initialTheme;
  document.documentElement.setAttribute('data-shaf-mode', initialTheme);

  style.textContent =
    'html[data-shaf-mode="sombra"],html[data-shaf-mode="sombra"] body{background:#000;color:#fff}' +
    'html[data-shaf-mode="luz"],html[data-shaf-mode="luz"] body{background:#fff;color:#000}';
  document.head.appendChild(style);

  window.SHAFORM_SET_THEME = function (theme) {
    if (theme !== 'sombra' && theme !== 'luz') {
      throw new Error('Invalid SHAFORM theme: ' + theme);
    }

    localStorage.setItem(storageKey, theme);
    window.SHAFORM_THEME = theme;
    document.documentElement.setAttribute('data-shaf-mode', theme);
  };
})();
