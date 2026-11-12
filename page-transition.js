(function () {
  var root = document.documentElement;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var navigationKey = 'shaform-transition-destination';
  var homePath = /\/Inicio-html\/Main\.dc\.html$/i;
  var aboutPath = /\/Sobre%20m%C3%AD-html\/SobreMi\.dc\.html$/i;
  var pagePath = /\/(?:Inicio-html\/Main\.dc\.html|Proyectos-html\/Proyectos\.dc\.html|Sobre%20m%C3%AD-html\/SobreMi\.dc\.html|Hablemos-html\/Hablemos\.dc\.html|Proyecto\.dc\.html)$/i;
  var navigating = false;
  var internalNavigation = false;
  var counter;
  var cleanupTimer;
  var counterTimer;
  var revealTimer;

  function clearLoading() {
    window.clearTimeout(cleanupTimer);
    window.clearTimeout(revealTimer);
    window.clearInterval(counterTimer);
    root.removeEventListener('animationend', onRevealEnd);
    root.classList.remove('shaf-loading', 'shaf-transition-reveal');
    if (counter) {
      counter.remove();
      counter = null;
    }
  }

  function onRevealEnd(event) {
    if (event.target === root && event.animationName === 'shaf-slide-up' && event.pseudoElement === '::before') clearLoading();
  }

  function revealPage() {
    if (counter) {
      counter.remove();
      counter = null;
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

    window.addEventListener('DOMContentLoaded', function () {
      if (aboutPath.test(location.pathname) || (internalNavigation && !homePath.test(location.pathname))) {
        revealPage();
        return;
      }

      var started = performance.now();
      var loaded = document.readyState === 'complete';
      var revealing = false;

      counter = document.createElement('div');
      counter.className = 'shaf-loading-counter';
      counter.setAttribute('aria-hidden', 'true');
      counter.textContent = '0';
      document.body.appendChild(counter);

      window.addEventListener('load', function () {
        loaded = true;
      }, { once: true });

      function updateCounter() {
        if (revealing || !counter) return;
        var elapsed = performance.now() - started;
        var complete = elapsed >= 2000 && (loaded || elapsed >= 5000);
        var progress = complete ? 100 : Math.min(95, Math.floor(elapsed / 2000 * 100));
        counter.textContent = String(progress);

        if (complete) {
          revealing = true;
          window.clearInterval(counterTimer);
          revealTimer = window.setTimeout(function () {
            if (!counter) return;
            revealPage();
          }, 120);
        }
      }

      counterTimer = window.setInterval(updateCounter, 32);
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
