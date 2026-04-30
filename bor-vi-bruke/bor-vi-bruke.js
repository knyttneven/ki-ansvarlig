// bor-vi-bruke.js
// Early-stage KI evaluation wizard
// Rule-based evaluation: stopp / avklar / ok — no scores

// ─── Data ──────────────────────────────────────────────────────────

var questions = [
  {
    id: 'formal',
    theme: 'Formål',
    text: 'Hva er det konkrete problemet dere ønsker å løse med KI?',
    answers: [
      {
        text: 'Vi har et klart definert problem eller behov',
        flag: 'ok'
      },
      {
        text: 'Vi har en idé, men behovet er ikke helt tydelig ennå',
        flag: 'avklar',
        reason: 'Formålet med KI-bruken er ikke tilstrekkelig definert.'
      },
      {
        text: 'Vi er usikre på hva problemet egentlig er',
        flag: 'stopp',
        reason: 'Det er ikke tydelig hva KI skal løse. Uten et klart definert problem er det ikke grunnlag for å gå videre.'
      }
    ]
  },
  {
    id: 'nodvendighet',
    theme: 'Nødvendighet',
    text: 'Kan problemet løses tilfredsstillende uten KI?',
    answers: [
      {
        text: 'Nei – KI er nødvendig eller klart best egnet',
        flag: 'ok'
      },
      {
        text: 'Ja, men KI kan gi tydelig merverdi',
        flag: 'avklar',
        reason: 'Det finnes alternative løsninger. Merverdien av KI bør avklares nærmere.'
      },
      {
        text: 'Ja – enklere løsninger er tilstrekkelig',
        flag: 'stopp',
        reason: 'Det finnes alternative løsninger som er tilstrekkelige. KI tilfører ikke nødvendig verdi for dette formålet.'
      }
    ]
  },
  {
    id: 'pavirkning',
    theme: 'Påvirkning',
    text: 'Berører løsningen elever eller viktige beslutninger?',
    answers: [
      {
        text: 'Ja, og vi forstår hvilke konsekvenser det kan ha',
        flag: 'ok'
      },
      {
        text: 'Ja, men vi er usikre på implikasjonene',
        flag: 'avklar',
        reason: 'Konsekvenser for elever eller viktige beslutninger er ikke tilstrekkelig vurdert.'
      },
      {
        text: 'Nei – dette gjelder kun intern administrasjon',
        flag: 'ok'
      }
    ]
  },
  {
    id: 'forstaelse',
    theme: 'Forståelse',
    text: 'Forstår dere i grove trekk hvordan KI-løsningen fungerer?',
    answers: [
      {
        text: 'Ja – vi har grunnleggende forståelse av løsningen',
        flag: 'ok'
      },
      {
        text: 'Delvis – vi mangler noe viktig kunnskap',
        flag: 'avklar',
        reason: 'Forståelsen av løsningen er ikke tilstrekkelig. Dette bør avklares før dere går videre.'
      },
      {
        text: 'Nei – vi vet ikke hvordan den fungerer',
        flag: 'avklar',
        reason: 'Manglende forståelse av løsningen er en vesentlig barriere. KI-kompetanse må på plass.'
      }
    ]
  },
  {
    id: 'konsekvenser',
    theme: 'Konsekvenser',
    text: 'Er mulige risikoer og konsekvenser vurdert?',
    answers: [
      {
        text: 'Ja – vi har gjort en innledende vurdering',
        flag: 'ok'
      },
      {
        text: 'Delvis – noen risikoer er fortsatt uklare',
        flag: 'avklar',
        reason: 'Ikke alle risikoer og konsekvenser er vurdert. Dette bør avklares.'
      },
      {
        text: 'Nei – dette er ikke vurdert ennå',
        flag: 'avklar',
        reason: 'Risikoer og konsekvenser er ikke vurdert. Dette er nødvendig før dere kan gå videre.'
      }
    ]
  },
  {
    id: 'eierskap',
    theme: 'Eierskap',
    text: 'Er det en navngitt person som har ansvar for initiativet?',
    answers: [
      {
        text: 'Ja – det er klart hvem som eier og følger opp',
        flag: 'ok'
      },
      {
        text: 'Vi jobber med å avklare ansvarsforholdet',
        flag: 'avklar',
        reason: 'Ansvarsforholdet for initiativet er ikke avklart.'
      },
      {
        text: 'Nei – ansvarsforhold er uklart',
        flag: 'avklar',
        reason: 'Uten tydelig eierskap er det vanskelig å gå videre på en ansvarlig måte.'
      }
    ]
  }
];

var outcomes = {
  stopp: {
    icon: '✕',
    label: 'Bør ikke gå videre',
    summary: 'Det er ikke grunnlag for å gå videre med KI-vurdering på nåværende tidspunkt.',
    practice: 'Vurder om behovet eller forutsetningene kan avklares bedre – og eventuelt start vurderingen på nytt.',
    disclaimer: null
  },
  avklar: {
    icon: '!',
    label: 'Krever avklaring',
    summary: 'Det er usikkerhet knyttet til ett eller flere punkter som bør avklares før dere går videre.',
    practice: 'Gå gjennom de uavklarte punktene og ta stilling til dem. Dere kan deretter gjøre vurderingen på nytt.',
    disclaimer: null
  },
  ok: {
    icon: '✓',
    label: 'Kan vurderes videre',
    summary: 'Det er grunnlag for å fortsette med en mer grundig vurdering.',
    practice: 'Neste steg er å bruke "Ansvarlig KI i skolen" for en mer detaljert vurdering av ansvarlig bruk i praksis.',
    disclaimer: 'Dette betyr ikke at løsningen kan tas i bruk. Det betyr kun at det er grunnlag for videre vurdering. Alle nødvendige vurderinger gjenstår.'
  }
};

// ─── State ─────────────────────────────────────────────────────────

var state = {
  currentStep: 0,
  answers: []   // [{ questionId, flag, reason }]
};

// ─── Helpers ───────────────────────────────────────────────────────

function el(id) {
  return document.getElementById(id);
}

function show(id) {
  el(id).classList.remove('hidden');
}

function hide(id) {
  el(id).classList.add('hidden');
}

// ─── Evaluation ────────────────────────────────────────────────────

function evaluate() {
  var stopItems  = state.answers.filter(function(a) { return a.flag === 'stopp'; });
  var avklarItems = state.answers.filter(function(a) { return a.flag === 'avklar'; });

  if (stopItems.length > 0) {
    return {
      outcome: 'stopp',
      reasons: stopItems.map(function(a) { return a.reason; }).filter(Boolean)
    };
  }
  if (avklarItems.length > 0) {
    return {
      outcome: 'avklar',
      reasons: avklarItems.map(function(a) { return a.reason; }).filter(Boolean)
    };
  }
  return { outcome: 'ok', reasons: [] };
}

// ─── Rendering ─────────────────────────────────────────────────────

function renderQuestion() {
  var q = questions[state.currentStep];
  var total = questions.length;
  var step  = state.currentStep + 1;

  el('progress-fill').style.width = ((step - 1) / total * 100) + '%';
  el('progress-label').textContent = step + ' / ' + total;

  el('question-theme').textContent = q.theme;
  el('question-text').textContent  = q.text;

  var answersEl = el('answers');
  answersEl.innerHTML = '';

  q.answers.forEach(function(answer, index) {
    var btn = document.createElement('button');
    btn.className   = 'answer-btn';
    btn.textContent = answer.text;
    btn.setAttribute('role', 'listitem');
    btn.setAttribute('type', 'button');
    btn.addEventListener('click', function() {
      handleAnswer(index);
    });
    answersEl.appendChild(btn);
  });

  var backBtn = el('btn-back');
  backBtn.disabled = (state.currentStep === 0);

  var card = el('question-card');
  card.classList.remove('fade-in');
  void card.offsetWidth; // reflow to restart animation
  card.classList.add('fade-in');
  card.focus();
}

function renderResult(evaluation) {
  var outcome = outcomes[evaluation.outcome];
  var resultEl = el('screen-result');

  var reasonsHtml = '';
  if (evaluation.reasons.length > 0) {
    var items = evaluation.reasons.map(function(r) {
      return '<li>' + escapeHtml(r) + '</li>';
    }).join('');
    reasonsHtml = '<ul class="result-reasons">' + items + '</ul>';
  }

  var disclaimerHtml = '';
  if (outcome.disclaimer) {
    disclaimerHtml = '<p class="result-disclaimer">' + escapeHtml(outcome.disclaimer) + '</p>';
  }

  resultEl.innerHTML =
    '<div class="result-card" data-outcome="' + evaluation.outcome + '">' +
      '<div class="result-header">' +
        '<div class="result-icon" aria-hidden="true">' + outcome.icon + '</div>' +
        '<h2 class="result-label">' + escapeHtml(outcome.label) + '</h2>' +
        '<p class="result-summary">' + escapeHtml(outcome.summary) + '</p>' +
      '</div>' +
      '<div class="result-body">' +
        reasonsHtml +
        '<div class="result-practice">' +
          '<p class="result-practice-label">Hva betyr dette i praksis?</p>' +
          '<p class="result-practice-text">' + escapeHtml(outcome.practice) + '</p>' +
        '</div>' +
        disclaimerHtml +
        '<div class="result-actions">' +
          '<button class="btn-restart" id="btn-restart" type="button">Start på nytt</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  el('btn-restart').addEventListener('click', restart);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Navigation ────────────────────────────────────────────────────

function handleAnswer(answerIndex) {
  var q      = questions[state.currentStep];
  var answer = q.answers[answerIndex];

  state.answers[state.currentStep] = {
    questionId: q.id,
    flag:       answer.flag,
    reason:     answer.reason || null
  };

  if (state.currentStep < questions.length - 1) {
    state.currentStep++;
    renderQuestion();
  } else {
    showResult();
  }
}

function goBack() {
  if (state.currentStep === 0) return;
  state.currentStep--;
  state.answers.splice(state.currentStep, 1);
  renderQuestion();
}

function showResult() {
  el('progress-fill').style.width = '100%';
  hide('screen-wizard');
  show('screen-result');
  var evaluation = evaluate();
  renderResult(evaluation);
  el('screen-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function restart() {
  state.currentStep = 0;
  state.answers     = [];
  hide('screen-result');
  show('screen-wizard');
  renderQuestion();
  el('screen-wizard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Init ──────────────────────────────────────────────────────────

function init() {
  el('btn-start').addEventListener('click', function() {
    hide('screen-intro');
    show('screen-wizard');
    renderQuestion();
  });

  el('btn-back').addEventListener('click', goBack);
}

document.addEventListener('DOMContentLoaded', init);
