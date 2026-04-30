// implementering.js
// Implementation readiness wizard — governance language, no legal judgement
// agent-implementation · agent-styring · agent-beslutningsdesign
// Flags: stopp / avklar / klar   Outcomes: stopp / avklar / klar

// ─── Data ──────────────────────────────────────────────────────────

var questions = [

  // ── Del 1: Klar for bruk ──────────────────────────────────────

  {
    id:      'ansvar',
    section: 'Del 1 – Klar for bruk',
    theme:   'Ansvarsplassering',
    text:    'Er det plassert ett tydelig ansvar for systemet – hvem som eier det, følger det opp og kan ta beslutninger om videre bruk?',
    answers: [
      {
        text: 'Ja – en navngitt person eller rolle har formelt eierskap og ansvar',
        flag: 'klar'
      },
      {
        text: 'Delvis – ansvaret er identifisert, men ikke formelt plassert',
        flag: 'avklar',
        reason: 'Ansvaret er ikke formelt plassert. Uten tydelig eierskap mangler det et ankerpunkt for oppfølging og eskalering.'
      },
      {
        text: 'Nei – ansvarsforholdet er uklart eller ikke avklart',
        flag: 'stopp',
        reason: 'Ansvaret er ikke plassert. Uten formelt eierskap er det ikke grunnlag for ansvarlig innføring.'
      }
    ]
  },

  {
    id:      'bruksomrade',
    section: 'Del 1 – Klar for bruk',
    theme:   'Bruksområde',
    text:    'Er det tydelig definert hvem som skal bruke systemet, i hvilke situasjoner og med hvilke begrensninger?',
    answers: [
      {
        text: 'Ja – bruksområdet er avgrenset, dokumentert og kommunisert til de aktuelle brukerne',
        flag: 'klar'
      },
      {
        text: 'Delvis – bruksområdet er skissert, men ikke tilstrekkelig avgrenset eller kommunisert',
        flag: 'avklar',
        reason: 'Bruksområdet er ikke tydeliggjort. Brukere trenger klare rammer for hva systemet kan og ikke kan brukes til.'
      },
      {
        text: 'Nei – dette er ikke definert',
        flag: 'stopp',
        reason: 'Bruksområdet er ikke definert. Uten dette kan ikke ansvarlig bruk sikres.'
      }
    ]
  },

  {
    id:      'rammer',
    section: 'Del 1 – Klar for bruk',
    theme:   'Styringsrammer',
    text:    'Er det etablert rammer og rutiner for bruken – som policy, brukerveiledning eller opplæring?',
    answers: [
      {
        text: 'Ja – skriftlige rammer er på plass og gjort kjent for brukerne',
        flag: 'klar'
      },
      {
        text: 'Delvis – noe er på plass, men ikke ferdigstilt',
        flag: 'avklar',
        reason: 'Styringsrammer er ikke ferdigstilt. Dette bør være på plass før systemet tas i bruk.'
      },
      {
        text: 'Nei – vi har ikke etablert rammer for bruken',
        flag: 'avklar',
        reason: 'Ingen styringsrammer er etablert. Rammer er en forutsetning for ansvarlig bruk.'
      }
    ]
  },

  // ── Del 2: Innføring ──────────────────────────────────────────

  {
    id:      'omfang',
    section: 'Del 2 – Innføring',
    theme:   'Innføringsomfang',
    text:    'Hva er planlagt omfang for innføringen?',
    answers: [
      {
        text: 'Avgrenset pilot med tydelig mandat, mål og evalueringspunkter',
        flag: 'klar'
      },
      {
        text: 'Bredere utrulling, og alle governance-forutsetninger er på plass',
        flag: 'klar'
      },
      {
        text: 'Bredere utrulling, men governance er ikke fullt ut etablert',
        flag: 'avklar',
        reason: 'Bredere utrulling krever at alle governance-forutsetninger er etablert. Avgrens omfanget inntil dette er avklart.'
      }
    ]
  },

  {
    id:      'operativt_ansvar',
    section: 'Del 2 – Innføring',
    theme:   'Operativt ansvar',
    text:    'Er det avklart hvem som har operativt ansvar for systemet i daglig drift – og hvem man kontakter ved problemer?',
    answers: [
      {
        text: 'Ja – operativt ansvar er plassert, dokumentert og kommunisert',
        flag: 'klar'
      },
      {
        text: 'Delvis – ansvar er i hovedsak avklart, men ikke dokumentert',
        flag: 'avklar',
        reason: 'Operativt ansvar er ikke dokumentert. Brukere og ledelse trenger kjente kontaktlinjer.'
      },
      {
        text: 'Nei – dette er ikke avklart',
        flag: 'avklar',
        reason: 'Operativt ansvar er ikke avklart. Dette er nødvendig for forsvarlig drift.'
      }
    ]
  },

  {
    id:      'brukerkommunikasjon',
    section: 'Del 2 – Innføring',
    theme:   'Brukerkommunikasjon',
    text:    'Er brukere informert om at de benytter et KI-system – hva det gjør, hva det ikke gjør og hvem de kan kontakte?',
    answers: [
      {
        text: 'Ja – brukere er informert og informasjonen er gjort tilgjengelig',
        flag: 'klar'
      },
      {
        text: 'Delvis – informasjon er planlagt, men ikke gjennomført',
        flag: 'avklar',
        reason: 'Brukere er ikke tilstrekkelig informert om systemet. Dette bør gjøres før systemet tas i bruk.'
      },
      {
        text: 'Nei – dette er ikke planlagt',
        flag: 'avklar',
        reason: 'Brukere er ikke informert om systemet. Informasjon er en forutsetning for ansvarlig bruk.'
      }
    ]
  },

  // ── Del 3: Oppfølging ─────────────────────────────────────────

  {
    id:      'avvik',
    section: 'Del 3 – Oppfølging',
    theme:   'Avvikshåndtering',
    text:    'Er det etablert en mekanisme for å oppdage, melde og håndtere feil eller uønskede utfall?',
    answers: [
      {
        text: 'Ja – rutiner for avviksmeldinger og eskalering er dokumentert',
        flag: 'klar'
      },
      {
        text: 'Delvis – noe er på plass, men ikke som et helhetlig system',
        flag: 'avklar',
        reason: 'Avvikshåndtering er ikke fullt ut etablert. Uten dette er det vanskelig å fange opp og korrigere problemer i tide.'
      },
      {
        text: 'Nei – dette er ikke etablert',
        flag: 'stopp',
        reason: 'Det er ingen mekanisme for avvikshåndtering. Dette er en grunnleggende forutsetning for ansvarlig drift.'
      }
    ]
  },

  {
    id:      'oppfolgingsansvar',
    section: 'Del 3 – Oppfølging',
    theme:   'Løpende oppfølging',
    text:    'Er det klargjort hvem som følger opp den løpende bruken – og med hvilken frekvens?',
    answers: [
      {
        text: 'Ja – ansvarlig person, oppfølgingsfrekvens og rapporteringsform er definert',
        flag: 'klar'
      },
      {
        text: 'Delvis – noen er ansvarlig, men omfang og frekvens er ikke avklart',
        flag: 'avklar',
        reason: 'Løpende oppfølging er ikke tilstrekkelig strukturert. Uten jevnlig oppfølging er det vanskelig å oppdage problemer i tide.'
      },
      {
        text: 'Nei – løpende oppfølging er ikke planlagt',
        flag: 'avklar',
        reason: 'Løpende oppfølging er ikke planlagt. Dette er nødvendig for forsvarlig drift over tid.'
      }
    ]
  },

  {
    id:      're_evaluering',
    section: 'Del 3 – Oppfølging',
    theme:   'Re-evaluering',
    text:    'Er det fastsatt kriterier for når systemet skal vurderes på nytt – ved endringer, avvik eller etter et gitt tidsrom?',
    answers: [
      {
        text: 'Ja – kriterier for re-evaluering er definert og dokumentert',
        flag: 'klar'
      },
      {
        text: 'Delvis – vi har tenkt på det, men ikke formalisert det',
        flag: 'avklar',
        reason: 'Kriterier for re-evaluering er ikke formalisert. Dette bør på plass for å sikre løpende ansvarlig bruk.'
      },
      {
        text: 'Nei – dette er ikke vurdert',
        flag: 'avklar',
        reason: 'Det er ikke satt kriterier for re-evaluering. Ansvarlig bruk forutsetter periodisk gjennomgang.'
      }
    ]
  }

];

// ─── Outcomes ──────────────────────────────────────────────────────

var outcomes = {

  stopp: {
    icon:     '⛔',
    badge:    'stopp',
    label:    'Ikke klar for bruk',
    summary:  'Grunnleggende forutsetninger for ansvarlig innføring er ikke på plass. Innføringen bør ikke gjennomføres i denne formen.',
    practice: 'Stopp prosessen og adresser de identifiserte forholdene. Beslutning om eventuell videre prosess bør treffes av ansvarlig ledelse – ikke av enkeltpersoner. Ikke start på ny vurdering før de grunnleggende forutsetningene er etablert.',
    tiltak: [
      'Informer ansvarlig ledelse om situasjonen',
      'Gjennomfør en strukturert gjennomgang av hva som mangler',
      'Involver relevante fagmiljøer for å etablere nødvendige forutsetninger',
      'Vurder om systemet er egnet for formålet, eller om prosessen bør utsettes'
    ],
    disclaimer: null
  },

  avklar: {
    icon:     '!',
    badge:    'avklar',
    label:    'Krever avklaringer',
    summary:  'Ett eller flere forhold er ikke tilstrekkelig avklart. Innføringen bør avvente til disse er på plass.',
    practice: 'Gå gjennom de identifiserte punktene og avklar dem med relevante fagpersoner. IKT-ansvarlig, personvernombud og ledelse er naturlige støttepunkter. Gjennomfør vurderingen på nytt når forholdene er avklart.',
    tiltak: [
      'Identifiser hvem som er ansvarlig for hvert udekket punkt',
      'Sett en konkret frist for avklaringene',
      'Involver IKT-ansvarlig, personvernombud eller ledelse der det er nødvendig',
      'Gjennomfør vurderingen på nytt når alle forholdene er på plass'
    ],
    disclaimer: null
  },

  klar: {
    icon:     '✓',
    badge:    'klar',
    label:    'Klar for pilot',
    summary:  'Svarene indikerer at sentrale forutsetninger for en avgrenset og ansvarlig pilot er på plass.',
    practice: 'En pilot er ikke en fullskala utrulling. Definer tydelige mål, avgrens deltakergruppen og fastsett kriterier for evaluering. Piloten avsluttes med en formell beslutning om videre prosess.',
    tiltak: [
      'Definer konkrete mål og evalueringskriterier for piloten',
      'Avklar hvem som evaluerer piloten, og med hvilken frekvens',
      'Sett en tydelig tidslinje med et eksplisitt beslutningspunkt for videre utrulling',
      'Dokumenter erfaringer løpende og involver brukerne aktivt'
    ],
    disclaimer: 'Dette er ikke en godkjenning av systemet. Det er et vurderingsgrunnlag for å starte en avgrenset pilot med aktiv oppfølging. Endelig beslutning treffes av ansvarlig ledelse.'
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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Evaluation ────────────────────────────────────────────────────

function evaluate() {
  var stoppItems = state.answers.filter(function(a) { return a.flag === 'stopp'; });
  var avklarItems = state.answers.filter(function(a) { return a.flag === 'avklar'; });

  if (stoppItems.length > 0) {
    return {
      outcome: 'stopp',
      reasons: stoppItems.map(function(a) { return a.reason; }).filter(Boolean)
    };
  }
  if (avklarItems.length > 0) {
    return {
      outcome: 'avklar',
      reasons: avklarItems.map(function(a) { return a.reason; }).filter(Boolean)
    };
  }
  return { outcome: 'klar', reasons: [] };
}

// ─── Rendering ─────────────────────────────────────────────────────

function renderQuestion() {
  var q     = questions[state.currentStep];
  var total = questions.length;
  var step  = state.currentStep + 1;

  el('progress-fill').style.width  = ((step - 1) / total * 100) + '%';
  el('progress-label').textContent = step + ' / ' + total;
  el('progress-section').textContent = q.section;

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
  void card.offsetWidth;
  card.classList.add('fade-in');
  card.focus();
}

function renderResult(evaluation) {
  var outcome  = outcomes[evaluation.outcome];
  var resultEl = el('screen-result');

  var reasonsHtml = '';
  if (evaluation.reasons.length > 0) {
    var items = evaluation.reasons.map(function(r) {
      return '<li>' + escapeHtml(r) + '</li>';
    }).join('');
    reasonsHtml = '<ul class="result-reasons">' + items + '</ul>';
  }

  var tiltakItems = outcome.tiltak.map(function(t) {
    return '<li>' + escapeHtml(t) + '</li>';
  }).join('');
  var tiltakHtml =
    '<div class="result-tiltak">' +
      '<p class="result-tiltak-label">Mulige tiltak</p>' +
      '<ul class="result-tiltak-list">' + tiltakItems + '</ul>' +
    '</div>';

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
        tiltakHtml +
        disclaimerHtml +
        '<div class="result-actions">' +
          '<button class="btn-restart" id="btn-restart" type="button">Start på nytt</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  el('btn-restart').addEventListener('click', restart);
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
