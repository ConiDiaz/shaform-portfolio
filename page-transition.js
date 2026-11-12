(function () {
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var navigationKey = 'shaform-transition-destination';
  var homePath = /\/Inicio-html\/Main\.dc\.html$/i;
  var aboutPath = /\/Sobre%20m%C3%AD-html\/SobreMi\.dc\.html$/i;
  var pagePath = /\/(?:Inicio-html\/Main\.dc\.html|Proyectos-html\/Proyectos\.dc\.html|Sobre%20m%C3%AD-html\/SobreMi\.dc\.html|Hablemos-html\/Hablemos\.dc\.html|Proyecto\.dc\.html)$/i;
  var assetBase = new URL('./assets/', document.currentScript.src);
  var navigating = false;
  var internalNavigation = false;
  var brand;
  var cleanupTimer;
  var minimumTimer;
  var maximumTimer;
  var onPageLoad;

  function positionCircle() {
    var dot = document.querySelector('.home-logo-dot');
    var logo = dot && dot.parentElement.querySelector('img');
    if (!logo || !logo.naturalWidth) return false;
    var rect = logo.getBoundingClientRect();
    if (!rect.width || rect.bottom <= 0 || rect.top >= window.innerHeight) return false;
    // Pink circle in the 2361 × 394 home logo: center x=1420, radius=197.
    var x = rect.left + rect.width * (1420 / 2361);
    var y = rect.top + rect.height / 2;
    var radius = rect.width * (197 / 2361);
    var farthestX = Math.max(Math.abs(x), Math.abs(window.innerWidth - x));
    var farthestY = Math.max(Math.abs(y), Math.abs(window.innerHeight - y));
    root.style.setProperty('--shaf-circle-x', x + 'px');
    root.style.setProperty('--shaf-circle-y', y + 'px');
    root.style.setProperty('--shaf-circle-start', Math.hypot(farthestX, farthestY) + 2 + 'px');
    root.style.setProperty('--shaf-circle-end', radius + 'px');
    return true;
  }

  function clearLoading() {
    window.clearTimeout(cleanupTimer);
    window.clearTimeout(minimumTimer);
    window.clearTimeout(maximumTimer);
    if (onPageLoad) window.removeEventListener('load', onPageLoad);
    root.removeEventListener('animationend', onRevealEnd);
    window.removeEventListener('resize', positionCircle);
    window.removeEventListener('scroll', positionCircle);
    root.classList.remove('shaf-loading', 'shaf-transition-reveal', 'shaf-circle-loading');
    root.style.removeProperty('--shaf-circle-x');
    root.style.removeProperty('--shaf-circle-y');
    root.style.removeProperty('--shaf-circle-start');
    root.style.removeProperty('--shaf-circle-end');
    if (brand) {
      brand.remove();
      brand = null;
    }
  }

  function onRevealEnd(event) {
    if (event.target === root && (event.animationName === 'shaf-slide-up' || event.animationName === 'shaf-circle-in') && event.pseudoElement === '::before') clearLoading();
  }

  function revealPage() {
    window.clearTimeout(minimumTimer);
    window.clearTimeout(maximumTimer);
    if (onPageLoad) window.removeEventListener('load', onPageLoad);
    if (root.classList.contains('shaf-circle-loading')) {
      if (positionCircle()) {
        window.addEventListener('resize', positionCircle);
        window.addEventListener('scroll', positionCircle);
      } else {
        root.classList.remove('shaf-circle-loading');
      }
    }
    root.addEventListener('animationend', onRevealEnd);
    root.classList.add('shaf-transition-reveal');
    cleanupTimer = window.setTimeout(clearLoading, 3000);
  }

  try {
    internalNavigation = sessionStorage.getItem(navigationKey) === location.pathname + location.search;
    sessionStorage.removeItem(navigationKey);
  } catch (error) {
    console.warn('No se pudo acceder al estado de transición:', error);
    if (document.referrer) {
      var referrer = new URL(document.referrer);
      internalNavigation = referrer.origin === location.origin && pagePath.test(referrer.pathname);
    }
  }

  if (!reducedMotion.matches) {
    root.classList.add('shaf-loading');
    if (homePath.test(location.pathname)) root.classList.add('shaf-circle-loading');

    window.addEventListener('DOMContentLoaded', function () {
      if (aboutPath.test(location.pathname) || (internalNavigation && !homePath.test(location.pathname))) {
        revealPage();
        return;
      }

      var loaded = document.readyState === 'complete';
      var minimumElapsed = false;
      if (!homePath.test(location.pathname)) {
        brand = document.createElement('img');
        brand.className = 'shaf-loading-brand';
        brand.alt = '';
        brand.setAttribute('aria-hidden', 'true');
        brand.src = new URL(
          root.getAttribute('data-shaf-mode') === 'luz' ? 'ed8523632032579f51b8ff645527fb0c.png' : '39ee6c72a1b9c78d7996165fdac0f45e.png',
          assetBase
        ).href;
        document.body.appendChild(brand);
      }

      onPageLoad = function () {
        loaded = true;
        if (minimumElapsed) revealPage();
      };
      if (!loaded) window.addEventListener('load', onPageLoad, { once: true });
      minimumTimer = window.setTimeout(function () {
        minimumElapsed = true;
        if (loaded) revealPage();
      }, 600);
      maximumTimer = window.setTimeout(revealPage, 2500);
    }, { once: true });
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
    var link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target.toLowerCase() !== '_self')) return;
    var destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !pagePath.test(destination.pathname)) return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;
    if (navigating) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    navigating = true;
    root.classList.add('shaf-transition-exit');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add('shaf-transition-start');
      });
    });
    window.setTimeout(function () {
      try {
        sessionStorage.setItem(navigationKey, destination.pathname + destination.search);
      } catch (error) {
        console.warn('No se pudo guardar el estado de transición:', error);
      }
      location.assign(destination.href);
    }, 750);
  });

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      navigating = false;
      clearLoading();
      root.classList.remove('shaf-transition-exit', 'shaf-transition-start');
    }
  });
})();
