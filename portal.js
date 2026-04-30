// portal.js – navigation only, no logic
// Replace href values when internal tools are deployed

const routes = {
  'bor-vi-bruke':       './bor-vi-bruke/bor-vi-bruke.html',
  'ansvarlig-ki':       './ansvarlig-ki/ansvarlig-ki.html',
  'juridisk-vurdering': 'https://barx10.github.io/ki_forordninga/#sjekk',
  'implementering':     './implementering/implementering.html',
};

document.querySelectorAll('.card[data-key]').forEach(function(card) {
  var key = card.getAttribute('data-key');
  var link = card.querySelector('.card-link');
  if (!link || !routes[key]) return;

  var route = routes[key];
  if (route === '#') {
    link.setAttribute('href', '#');
    link.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Denne delen er under utvikling');
    });
  } else if (route.indexOf('http') === 0) {
    link.setAttribute('href', route);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  } else {
    link.setAttribute('href', route);
  }
});
