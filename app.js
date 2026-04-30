/* ============================================================
   STATE
   ============================================================ */

const state = {
  flow:            null,   // 'laerer' | 'deployer'
  currentQuestion: 0,
  answers:         [],     // answer indices per question (flags derived on evaluation)
};

/* ============================================================
   QUESTIONS — LÆRER (10 spørsmål)
   agent-pedagogikk · agent-beslutningsdesign · agent-begrepskontroll
   ============================================================ */

const laererQuestions = [
  {
    tag:  'Type verktøy',
    text: 'Hva slags KI-verktøy tenker du å bruke?',
    hint: 'Velg det alternativet som best beskriver verktøyets primære funksjon.',
    answers: [
      { text: 'Oversettelsesverktøy (f.eks. DeepL)',                                                      flags: [] },
      { text: 'Tekstgenerator eller chatbot (f.eks. ChatGPT, Copilot)',                                   flags: [] },
      { text: 'Tilbakemeldingsgenerator eller vurderingsstøtte',                                          flags: [] },
      { text: 'Bildet- eller mediegenerator',                                                             flags: [] },
      { text: 'System som registrerer, profilerer eller analyserer elevers atferd eller prestasjoner',    flags: ['invasive_system'] },
    ],
  },
  {
    tag:  'Brukere',
    text: 'Hvem skal bruke verktøyet?',
    hint: null,
    answers: [
      { text: 'Bare jeg som lærer, til forberedelse eller planlegging',             flags: [] },
      { text: 'Elever under min aktive veiledning og tilstedeværelse',              flags: [] },
      { text: 'Elever på egenhånd, uten løpende veiledning fra meg',               flags: ['students_alone'] },
    ],
  },
  {
    tag:  'Personopplysninger',
    text: 'Behandler verktøyet personopplysninger om elever?',
    hint: 'Personopplysninger: navn, karakterer, atferdsdata, bilder, tekster eller annen informasjon som kan knyttes til enkeltpersoner.',
    answers: [
      { text: 'Nei – jeg legger ikke inn personopplysninger om elever',                 flags: [] },
      { text: 'Ja – begrenset, f.eks. anonymisert klasseinformasjon',                   flags: ['personal_data'] },
      { text: 'Ja – elevnavn, karakterer, tekster eller andre personlige data',         flags: ['personal_data', 'personal_data_extensive'] },
      { text: 'Vet ikke',                                                               flags: ['unknown_personal_data'] },
    ],
  },
  {
    tag:  'Aldersgruppe',
    text: 'Er elevene under 18 år?',
    hint: 'Mindreårige har særskilt vern etter personvernregelverket. Svaret påvirker hvilke hensyn som bør tas.',
    answers: [
      { text: 'Nei – alle er over 18 år',             flags: [] },
      { text: 'Ja – noen eller alle er under 18 år',  flags: ['minors'] },
    ],
  },
  {
    tag:  'Transparens',
    text: 'Er bruken av KI tydelig forklart for elevene?',
    hint: 'Elevene bør forstå hva KI gjør og ikke gjør, og at det er læreren som tar faglige beslutninger.',
    answers: [
      { text: 'Ja – elevene er informert om hva verktøyet gjør og ikke gjør',   flags: [] },
      { text: 'Delvis – jeg har nevnt det, men ikke forklart det grundig',       flags: ['partial_transparency'] },
      { text: 'Nei – dette er ikke kommunisert til elevene',                     flags: ['no_transparency'] },
    ],
  },
  {
    tag:  'Faglig kontroll',
    text: 'Kan du vurdere og korrigere det KI-verktøyet produserer?',
    hint: 'Du bør ha faglig grunnlag til å oppdage feil, misvisende innhold eller uhensiktsmessige svar.',
    answers: [
      { text: 'Ja – jeg har god nok faglig kompetanse til å vurdere utputtet kritisk',  flags: [] },
      { text: 'Delvis – jeg kan vurdere det meste, men er usikker i noen tilfeller',    flags: ['partial_control'] },
      { text: 'Nei – jeg stoler i stor grad på at KI-verktøyet har rett',              flags: ['no_control'] },
    ],
  },
  {
    tag:  'Vurdering og karakter',
    text: 'Skal KI-utputtet brukes som grunnlag for vurdering eller karakter?',
    hint: null,
    answers: [
      { text: 'Nei – KI brukes kun til læringsarbeid, ikke som vurderingsgrunnlag',    flags: [] },
      { text: 'Som ett av flere underlag – endelig beslutning tas av meg som lærer',   flags: [] },
      { text: 'Ja – KI-utputtet vil direkte påvirke karakter eller vurderingsutfall',  flags: ['direct_grading'] },
    ],
  },
  {
    tag:  'Pedagogisk begrunnelse',
    text: 'Er det en tydelig pedagogisk begrunnelse for å bruke KI i denne situasjonen?',
    hint: 'KI bør brukes fordi det støtter konkrete læringsmål – ikke kun fordi det er tilgjengelig.',
    answers: [
      { text: 'Ja – bruken er begrunnet i klare læringsmål eller pedagogiske hensyn',  flags: [] },
      { text: 'Delvis – jeg ser nytten, men har ikke tenkt det helt gjennom',          flags: ['uncertain_justification'] },
      { text: 'Nei – jeg er usikker på om det støtter læringsmålene',                  flags: ['no_justification'] },
    ],
  },
  {
    tag:  'Retningslinjer',
    text: 'Finnes det retningslinjer fra skolen eller kommunen for dette verktøyet?',
    hint: null,
    answers: [
      { text: 'Ja – det finnes klare retningslinjer jeg forholder meg til',        flags: [] },
      { text: 'Delvis – det finnes noe, men det er uklart eller ikke oppdatert',   flags: ['partial_guidelines'] },
      { text: 'Nei / vet ikke',                                                    flags: ['no_guidelines'] },
    ],
  },
  {
    tag:  'KI-kompetanse',
    text: 'Har du tilstrekkelig kunnskap om verktøyet til å bruke det forsvarlig?',
    hint: 'KI-kompetanse betyr å forstå hva verktøyet kan og ikke kan, og hvilke begrensninger det har.',
    answers: [
      { text: 'Ja – jeg kjenner verktøyet godt nok til å bruke det trygt',     flags: [] },
      { text: 'Delvis – jeg vet noe, men trenger mer kunnskap',                 flags: ['partial_competence'] },
      { text: 'Nei – jeg har lite kunnskap om verktøyets begrensninger',        flags: ['no_competence'] },
    ],
  },
];

/* ============================================================
   QUESTIONS — DEPLOYER (7 spørsmål)
   agent-styring · agent-ai-act · agent-juridisk
   ============================================================ */

const deployerQuestions = [
  {
    tag:  'Type system',
    text: 'Hva slags KI-system vurderes implementert?',
    hint: 'Velg det alternativet som best beskriver systemets primære funksjon og hvem det berører direkte.',
    answers: [
      { text: 'Administrativt støtteverktøy for ansatte – uten behandling av elevdata',              flags: [] },
      { text: 'Pedagogisk støtteverktøy der læreren er eneste bruker',                              flags: [] },
      { text: 'Verktøy til direkte bruk av elever',                                                 flags: ['direct_student_use'] },
      { text: 'System som automatisk analyserer, profiler, rangerer eller vurderer elever',          flags: ['profiles_students'] },
    ],
  },
  {
    tag:  'Personopplysninger',
    text: 'Behandler systemet personopplysninger om elever?',
    hint: 'Personopplysninger er alle opplysninger som kan knyttes til enkeltpersoner – direkte eller indirekte. Husk at læringsdata, atferdsdata og prestasjonsdata om elever normalt er personopplysninger.',
    answers: [
      { text: 'Nei – systemet behandler ikke personopplysninger om elever',                                       flags: [] },
      { text: 'Ja – begrenset og nødvendig behandling med klart avgrenset formål',                                flags: ['limited_personal_data'] },
      { text: 'Ja – i stor utstrekning, herunder særlige kategorier eller læringsdata i stor skala',              flags: ['extensive_personal_data'] },
      { text: 'Vet ikke – omfanget av personopplysningsbehandlingen er ikke kartlagt',                            flags: ['unknown_personal_data'] },
    ],
  },
  {
    tag:  'Behandlingsansvar og avtaler',
    text: 'Er det avklart hvem som er behandlingsansvarlig, og er nødvendige avtaler med leverandøren inngått?',
    hint: 'Behandlingsansvarlig er den virksomheten som bestemmer formålet med og midlene til behandlingen. Der systemet behandler personopplysninger på vegne av kommunen/fylkeskommunen, kreves databehandleravtale med leverandøren.',
    answers: [
      { text: 'Ja – behandlingsansvar er plassert, og databehandleravtale er inngått der det er aktuelt',    flags: [] },
      { text: 'Delvis – ansvar er identifisert, men avtaler er ikke fullt ut på plass',                      flags: ['partial_responsibility'] },
      { text: 'Nei – behandlingsansvar er ikke formelt avklart og nødvendige avtaler mangler',               flags: ['no_responsibility'] },
    ],
  },
  {
    tag:  'Omfang',
    text: 'Hva er det planlagte omfanget av utrullingen?',
    hint: 'Større omfang forutsetter sterkere governance. Omfanget bør stå i forhold til modenhet og de avklaringene som er gjort.',
    answers: [
      { text: 'Avgrenset pilot på én skole eller én gruppe',   flags: [] },
      { text: 'Flere skoler eller en hel kommune',             flags: ['medium_scale'] },
      { text: 'Hel fylkeskommune eller stor kommunal utrulling', flags: ['large_scale'] },
    ],
  },
  {
    tag:  'Menneskelig kontroll',
    text: 'Er det etablert mekanismer for menneskelig kontroll og innsyn i systemets virkemåte?',
    hint: 'Menneskelig kontroll innebærer at ansvarlige personer kan overstyre, korrigere eller stanse systemet, og at det finnes dokumenterte rutiner for logging og innsyn.',
    answers: [
      { text: 'Ja – rutiner for overstyring, logging og innsyn er etablert og dokumentert',  flags: [] },
      { text: 'Delvis – noe er på plass, men ikke som et helhetlig system med klare rutiner', flags: ['partial_control'] },
      { text: 'Nei – dette er ikke etablert',                                                flags: ['no_human_control'] },
    ],
  },
  {
    tag:  'KI-kompetanse',
    text: 'Har de som skal forvalte og bruke systemet tilstrekkelig KI-kompetanse?',
    hint: 'Kompetansen bør dekke systemets muligheter, begrensninger, mulige feilkilder og konsekvenser av feil. KI-kompetanse er en forutsetning – ikke noe som kan utsettes til etter implementering.',
    answers: [
      { text: 'Ja – relevant kompetanse er dokumentert, på plass og ansvaret for vedlikehold er plassert', flags: [] },
      { text: 'Delvis – opplæring er planlagt, men ikke gjennomført',                                     flags: ['competence_planned'] },
      { text: 'Nei – kompetansebehov er ikke kartlagt eller ikke dekket',                                  flags: ['no_competence'] },
    ],
  },
  {
    tag:  'Regelverk og anskaffelse',
    text: 'Er systemet vurdert opp mot gjeldende regelverk, og er anskaffelsesprosessen gjennomført i samsvar med kravene?',
    hint: 'Relevant regelverk inkluderer GDPR/personopplysningsloven, AI Act (der relevant), opplæringsloven, forvaltningsloven og regler om offentlig anskaffelse.',
    answers: [
      { text: 'Ja – juridisk og personvernfaglig vurdering er gjennomført, og anskaffelse er gjort i tråd med regelverket', flags: [] },
      { text: 'Delvis – vurdering pågår, eller ett av forholdene er ikke fullt ut avklart',                                flags: ['partial_regulatory'] },
      { text: 'Nei – regelverksvurdering og/eller anskaffelsesprosess er ikke gjennomført',                               flags: ['no_regulatory'] },
    ],
  },
];

/* ============================================================
   RESULT CONTENT
   agent-juridisk · agent-ai-act · agent-regulatorisk-kontekst · agent-begrepskontroll
   ============================================================ */

const laererResults = {
  green: {
    badge:    'green',
    emoji:    '✅',
    title:    'Kan brukes som støtte',
    subtitle: 'Svarene indikerer at sentrale hensyn er ivaretatt – det faglige ansvaret forblir hos deg',
    explanation:
      'Svarene dine viser at de viktigste pedagogiske og personvernmessige hensynene ser ut til å være tatt. ' +
      'KI-verktøyet kan vurderes brukt som pedagogisk støtte i denne situasjonen, ' +
      'forutsatt at du løpende utøver faglig skjønn og at skolens rammer følges. ' +
      'Denne vurderingen er ikke en godkjenning og endres dersom forutsetningene endres.',
    inPractice:
      'Utøv faglig skjønn, vær tydelig overfor elevene om at KI brukes, og hold deg oppdatert på ' +
      'verktøyets begrensninger. Sjekk regelmessig om forholdene endrer seg – f.eks. ved oppdateringer ' +
      'av verktøyet, endringer i elevgruppen eller endringer i skolens retningslinjer. ' +
      'Er du i tvil, kontakt rektor eller IKT-ansvarlig.',
    refs: {
      aiact:  'Generative KI-verktøy er underlagt transparenskrav i AI Act art. 50. Dersom et verktøy er klassifisert som høyrisiko-KI, gjelder krav i kapittel III. Klassifiseringen er leverandørens og deploys ansvar – ikke den enkelte lærers.',
      gdpr:   'Dersom verktøyet ikke behandler personopplysninger om elever, er personvernrisikoen begrenset. Sjekk uansett om skolen har vurdert verktøyet og om det foreligger databehandleravtale der det er nødvendig.',
      school: 'Læreplanen og faglig skjønn er alltid overordnet. KI er et støtteverktøy som supplerer – ikke erstatter – profesjonell pedagogisk vurdering. Rektor og skoleeier har ansvar for overordnede rammer og systemvalg.',
    },
  },

  amber: {
    badge:    'amber',
    emoji:    '⚠️',
    title:    'Bør avklares',
    subtitle: 'Sentrale forhold er ikke avklart – bruk bør utsettes til disse er på plass',
    explanation:
      'Svarene dine viser at ett eller flere viktige hensyn ikke er tilstrekkelig ivaretatt. ' +
      'Bruk av verktøyet bør utsettes til disse forholdene er avklart på organisasjonsnivå. ' +
      'Du bør ikke ta denne vurderingen alene.',
    inPractice:
      'Ta spørsmål om personvern, retningslinjer og pedagogisk egnethet opp med rektor, IKT-ansvarlig ' +
      'eller personvernombudet. Disse vurderingene hører hjemme på organisasjonsnivå. ' +
      'Avvent bruk til forholdene er avklart og formidlet til deg.',
    refs: {
      aiact:  'AI Act art. 26 omtaler krav til brukere av høyrisikoklassifiserte KI-systemer. Art. 50 stiller krav til transparens overfor sluttbrukere av generative KI-systemer. Disse forpliktelsene hviler på deployer og leverandør – men lærere forutsettes å bruke verktøy innenfor etablerte rammer.',
      gdpr:   'Behandling av personopplysninger om mindreårige krever særlig aktsomhet. GDPR art. 6 (rettslig grunnlag) og art. 8 (barns alder og samtykke) er sentrale referanser. Disse vurderingene forutsetter avklaring på virksomhetsnivå.',
      school: 'Skolen og kommunen har det overordnede ansvaret for systemvalg og rammeverk. Lærere bør ikke ta i bruk nye verktøy uten at organisasjonen har avklart og kommunisert rammene. Personvernombudet og IKT-ansvarlig er naturlige støttepunkter.',
    },
  },

  red: {
    badge:    'red',
    emoji:    '⛔',
    title:    'Bør ikke brukes',
    subtitle: 'Vesentlige forutsetninger er ikke på plass – bruk bør ikke skje i denne formen',
    explanation:
      'Svarene dine indikerer at ett eller flere vesentlige hensyn ikke er ivaretatt. ' +
      'Som hovedregel bør verktøyet ikke tas i bruk slik situasjonen er beskrevet. ' +
      'Dette er ikke en juridisk konklusjon, men et faglig signal om at sentrale forutsetninger mangler ' +
      'og at du trenger organisatorisk avklaring og støtte.',
    inPractice:
      'Kontakt rektor, personvernombudet eller kommunens IKT-ansvarlig. ' +
      'Dersom forholdet gjelder behandling av elevdata eller systemer med vesentlig påvirkning på elever, ' +
      'bør saken løftes til rett nivå i organisasjonen. ' +
      'Det er ikke den enkelte lærers ansvar å avklare eller løse disse forholdene alene.',
    refs: {
      aiact:  'KI-systemer som kan ha vesentlig innvirkning på elevers rettigheter eller sikkerhet kan falle under høyrisikoklassifisering i AI Act vedlegg III. Klassifiseringen og de tilhørende forpliktelsene hviler på leverandør og deployer – ikke på læreren.',
      gdpr:   'GDPR art. 5 (prinsippene), art. 6 (rettslig grunnlag), art. 9 (særlige kategorier) og art. 35 (DPIA) kan alle være relevante. Disse vurderingene tilligger behandlingsansvarlig – normalt kommunen eller fylkeskommunen.',
      school: 'Læreren er ikke behandlingsansvarlig og er ikke deployer i AI Act-forstand. Ansvaret for systemvalg, juridisk grunnlag og regeletterlevelse ligger hos skoleeier. Lærere bør melde fra til sin leder og avvente avklaring.',
    },
  },
};

const deployerResults = {
  green: {
    badge:    'green',
    emoji:    '✅',
    title:    'Kan vurderes innen rammer',
    subtitle: 'Svarene indikerer at sentrale forutsetninger er ivaretatt – formelle avklaringer gjenstår',
    explanation:
      'Svarene dine viser at de sentrale governance-elementene i stor grad er på plass. ' +
      'En videre prosess kan vurderes, forutsatt at alle formelle avklaringer fullføres, dokumenteres ' +
      'og forankres i ledelsen. ' +
      'Utfallet er et vurderingsgrunnlag – ikke en bekreftelse på at systemet er klart for bruk.',
    inPractice:
      'Selv med et godt grunnlag gjenstår formelle steg: bekreft at databehandleravtale er på plass, ' +
      'at menneskelig kontroll er dokumentert, og at relevante parter er informert. ' +
      'Sett opp en oppfølgingsplan med klare ansvarslinjer og en tidslinje for de gjenstående avklaringene.',
    refs: {
      aiact:  'Som deployer har dere forpliktelser etter AI Act art. 26 (krav til bruk av høyrisikoklassifiserte systemer) og art. 28 (deployers særlige forpliktelser). Transparenskrav etter art. 50 gjelder for generative KI-systemer uavhengig av risikoklasse.',
      gdpr:   'GDPR art. 6 (rettslig grunnlag), art. 28 (databehandleravtale) og art. 32 (sikkerhetstiltak) er sentrale. Vurder om art. 35 (DPIA) er påkrevet basert på type og omfang av behandling.',
      school: 'Offentlige organer har særlige forpliktelser etter forvaltningsloven, opplæringsloven og personopplysningsloven. Ansvar for systemvalg og elevers rettigheter tilligger kommunen eller fylkeskommunen som behandlingsansvarlig.',
    },
    regelverkNote: 'Bruken kan etter omstendighetene berøre krav i regelverket. Bør vurderes opp mot gjeldende regelverk som del av de gjenstående formelle avklaringene.',
    juridiskNote:  'Dersom juridisk klassifisering av det aktuelle KI-systemet ikke er avklart, bør dette vurderes i KI-forordningsveiviseren.',
  },

  navigate: {
    badge:    'navigate',
    emoji:    '🧭',
    title:    'Krever styring',
    subtitle: 'Sentrale governance-forutsetninger bør være på plass før implementering',
    explanation:
      'Svarene dine indikerer at ett eller flere sentrale governance-elementer mangler eller er ufullstendige. ' +
      'Implementering bør ikke skje før disse er avklart og dokumentert. ' +
      'Hvilke elementer som mangler, bør identifiseres og utbedres som del av en strukturert prosess.',
    inPractice:
      'Prioriter å avklare: behandlingsansvar og databehandleravtaler, mekanismer for menneskelig kontroll, ' +
      'kompetansekrav og juridisk grunnlag. Disse er forutsetninger – ikke etterfølgende tiltak. ' +
      'Involver personvernombud, juridisk kompetanse og relevante fagmiljøer. ' +
      'Angi en tydelig ansvarlig person for oppfølging.',
    refs: {
      aiact:  'AI Act art. 26 og 28 stiller krav til deployers av høyrisikoklassifiserte KI-systemer, herunder menneskelig tilsyn (art. 14), logging (art. 12) og transparens (art. 13). Manglende styringsmekanismer er ikke bare en etisk, men også en regulatorisk problemstilling.',
      gdpr:   'GDPR art. 35 (DPIA) bør vurderes. Behandlingsansvar etter art. 4(7), databehandleravtale etter art. 28, og sikkerhetstiltak etter art. 32 må avklares formelt.',
      school: 'Kommuner og fylkeskommuner er behandlingsansvarlige for elevers personopplysninger. Ansvaret kan ikke delegeres bort uten formell avklaring og inngåelse av nødvendige avtaler.',
    },
    regelverkNote: 'Bruken vil normalt forutsette nærmere vurdering opp mot gjeldende regelverk. Dette bør inngå i de avklaringene som er nødvendige for å gå videre.',
    juridiskNote:  'Denne typen bruk vil normalt kunne kreve juridisk vurdering. Dersom juridisk klassifisering ikke er avklart, bør dette vurderes i KI-forordningsveiviseren.',
  },

  pilot: {
    badge:    'pilot',
    emoji:    '🧪',
    title:    'Egnet for pilot',
    subtitle: 'Pilot forutsettes som styringsgrep – ikke som risikoreduksjon',
    explanation:
      'Svarene dine indikerer at ambisjonsnivået er høyt, men at sentrale governance-elementer ' +
      'ennå ikke er fullt ut etablert for den planlagte skalaen. ' +
      'En begrenset og strukturert pilot kan være et hensiktsmessig styringsgrep ' +
      'for å bygge erfaringsgrunnlag og governance-infrastruktur. ' +
      'Pilot er ikke et alternativ til nødvendige avklaringer – det er en ramme der de skal gjøres.',
    inPractice:
      'En pilot forutsetter tydelige mål, en avgrenset og informert gruppe, klare evalueringskriterier ' +
      'og en navngitt ansvarlig person som aktivt følger opp. ' +
      'Definer på forhånd hva som kreves for å skalere opp – og hva som skal til for å avslutte. ' +
      'Involver personvernombud og ledelse fra første dag. ' +
      'Pilot er ikke «prøv og se» – det er et forpliktende styringsvedtak.',
    refs: {
      aiact:  'AI Act art. 57 åpner for regulatoriske sandkasser og piloter under tilsyn. Krav til menneskelig tilsyn (art. 14) og transparens (art. 13) gjelder også i piloter. En pilot fritar ikke fra kravene – den gir en ramme for å oppfylle dem forsvarlig.',
      gdpr:   'En pilot fritar ikke fra GDPR-krav. Art. 35 (DPIA) kan være aktuell selv for den begrensede piloten. Behandlingsansvar og databehandleravtaler må avklares for piloten som sådan.',
      school: 'En pilot i offentlig sektor er et forpliktende styringsgrep der kommunen eller fylkeskommunen tar formelt eierskap og ansvar. Ledelsesforankring og skriftlig mandat forutsettes.',
    },
    regelverkNote: 'Bruken kan etter omstendighetene berøre krav i regelverket. Piloten bør utformes slik at nødvendig rettslig grunnlag er på plass fra oppstart.',
    juridiskNote:  'Dersom juridisk klassifisering av systemet ikke er avklart, bør dette vurderes i KI-forordningsveiviseren – som regel før pilot igangsettes.',
  },

  red: {
    badge:    'red',
    emoji:    '⛔',
    title:    'Bør ikke brukes nå',
    subtitle: 'Vesentlige forutsetninger mangler – implementering bør ikke gjennomføres i denne formen',
    explanation:
      'Svarene dine indikerer at for mange sentrale governance-forutsetninger ikke er på plass. ' +
      'Som hovedregel bør systemet ikke implementeres slik situasjonen er beskrevet. ' +
      'Dette er ikke en juridisk konklusjon, men en vurdering av at beredskapen for ansvarlig bruk ' +
      'ikke er tilstrekkelig etablert til at implementering kan skje forsvarlig.',
    inPractice:
      'Stans prosessen og gjennomfør nødvendige avklaringer: behandlingsansvar, databehandleravtaler, ' +
      'rettslig grunnlag, menneskelig kontroll og kompetansesikring. ' +
      'Involver kommuneadvokat, personvernombud og relevante fagmiljøer. ' +
      'Beslutning om eventuell videre prosess treffes av ansvarlig ledelse på riktig nivå – ikke av enkeltpersoner.',
    refs: {
      aiact:  'AI Act stiller strenge krav til deployers, særlig for høyrisikoklassifiserte systemer (kapittel III): teknisk dokumentasjon (art. 11), menneskelig tilsyn (art. 14), logging (art. 12) og transparens (art. 13). Manglende etterlevelse er ikke et teknisk spørsmål alene – det er et governance-ansvar.',
      gdpr:   'Behandling av personopplysninger uten rettslig grunnlag, uten DPIA der det er påkrevet (art. 35), og uten sikkerhetstiltak (art. 32) er i strid med GDPR-prinsippene i art. 5. GDPR art. 5–9 og art. 35 er sentrale referanser.',
      school: 'Offentlige organer har et særlig ansvar for å sikre at systemer som berører barn og unge er forsvarlig utredet. Det er behandlingsansvarlig – normalt kommunen eller fylkeskommunen – som bærer dette ansvaret.',
    },
    regelverkNote: 'Bruken vil normalt forutsette nærmere vurdering opp mot gjeldende regelverk. Regelverksavklaring bør inngå i det samlede avklaringsarbeidet.',
    juridiskNote:  'Denne typen bruk vil normalt kunne kreve juridisk vurdering. Dersom juridisk klassifisering ikke er avklart, bør dette vurderes i KI-forordningsveiviseren. Juridisk vurdering bør inngå i avklaringsprosessen.',
  },
};

/* ============================================================
   CALCULATION — rule-based evaluation
   agent-beslutningsdesign · agent-styring · agent-juridisk
   ============================================================ */

// Collect all flags from the answers given so far.
function collectFlags() {
  const questions = currentQuestions();
  const flags = new Set();
  state.answers.forEach((answerIndex, questionIndex) => {
    const q = questions[questionIndex];
    if (q && q.answers[answerIndex]) {
      q.answers[answerIndex].flags.forEach(flag => flags.add(flag));
    }
  });
  return flags;
}

// Return a 1–2 sentence explanation that directly references the triggered flags.
// Called after the result key is known; does not affect logic.
function generateFlagExplanation(flow, f, resultKey) {

  if (flow === 'laerer') {

    if (resultKey === 'red') {
      if (f.has('no_control') && f.has('direct_grading'))
        return 'KI-utputtet brukes direkte som karaktergrunnlag, og du har angitt at du ikke kan vurdere det kritisk. Karakter krever at læreren kan stå faglig inne for grunnlaget.';
      if (f.has('no_control') && f.has('students_alone'))
        return 'Elever bruker verktøyet uten veiledning, og du har angitt at du ikke kan vurdere utputtet kritisk. Det finnes ingen mekanisme for å fange opp feil eller uegnet innhold.';
      if (f.has('invasive_system') && f.has('students_alone'))
        return 'Verktøyet profilerer eller analyserer elever automatisk, og elevene bruker det uten veiledning. Slike systemer krever organisatorisk avklaring og er ikke lærerens beslutningsansvar alene.';
      if (f.has('invasive_system') && f.has('no_control'))
        return 'Verktøyet profilerer eller analyserer elever automatisk, og du har angitt at du ikke kan etterprøve hva systemet gjør. Slike systemer forutsetter at læreren kan vurdere og korrigere utputtet.';
      if (f.has('no_competence') && f.has('direct_grading'))
        return 'KI-utputtet brukes direkte som karaktergrunnlag, og du har angitt å mangle tilstrekkelig kunnskap om verktøyet. Karakter forutsetter at læreren kan stå faglig inne for grunnlaget.';
      if (f.has('no_competence') && f.has('invasive_system'))
        return 'Verktøyet profilerer eller analyserer elever automatisk, og du har angitt å mangle tilstrekkelig kunnskap om det. Slike systemer krever at brukeren kan forstå og vurdere hva systemet gjør.';
      if ((f.has('personal_data_extensive') || f.has('unknown_personal_data')) && f.has('minors') && f.has('no_guidelines'))
        return 'Verktøyet behandler personopplysninger om mindreårige, og det finnes ingen retningslinjer fra skolen. Slik behandling forutsetter avklart rettslig grunnlag og organisatorisk rammeverk.';
      if (f.has('no_guidelines') && f.has('no_competence') && f.has('students_alone'))
        return 'Elever bruker verktøyet uten veiledning, det mangler retningslinjer, og du har angitt å mangle kunnskap om verktøyet. Ingen av disse forutsetningene er ivaretatt.';
    }

    if (resultKey === 'amber') {
      if (f.has('no_control'))
        return 'Du har angitt at du ikke kan vurdere KI-utputtet kritisk. Å etterprøve og korrigere utputtet er en forutsetning for forsvarlig bruk.';
      if (f.has('no_transparency'))
        return 'Bruken av KI er ikke kommunisert til elevene. Elever bør forstå hva KI gjør og ikke gjør, og hvem som tar de faglige beslutningene.';
      if (f.has('no_competence'))
        return 'Du har angitt at du mangler tilstrekkelig kunnskap om verktøyets begrensninger. KI-kompetanse er en forutsetning for forsvarlig bruk – ikke noe som kan utsettes.';
      if (f.has('invasive_system'))
        return 'Verktøyet registrerer, profilerer eller analyserer elevers atferd eller prestasjoner automatisk. Slike systemer hører hjemme i en deployer-prosess – ikke i den enkelte lærers beslutningsrom.';
      if (f.has('direct_grading'))
        return 'KI-utputtet vil direkte påvirke karakter eller vurderingsutfall. Det stiller særlige krav til transparens, faglig grunnlag og organisatorisk avklaring.';
      if (f.has('students_alone'))
        return 'Elever bruker verktøyet uten veiledning, og ett eller flere andre hensyn er ikke avklart. Ta dette opp med din skoleledelse eller IKT-ansvarlig.';
      if ((f.has('personal_data_extensive') || f.has('unknown_personal_data')) && f.has('minors'))
        return 'Verktøyet behandler personopplysninger om mindreårige. Det krever særlig aktsomhet og organisatorisk avklaring, uavhengig av omfang.';
      if ((f.has('personal_data_extensive') || f.has('unknown_personal_data')) && f.has('no_guidelines'))
        return 'Verktøyet behandler sensitive personopplysninger, og det finnes ingen retningslinjer fra skolen for bruken. Begge forholdene bør avklares.';
      if (f.has('no_justification') && f.has('no_guidelines'))
        return 'Det er verken tydelig pedagogisk begrunnelse for KI-bruken eller retningslinjer fra skolen om verktøyet. Begge forutsettes å være på plass.';
    }

    if (resultKey === 'green')
      return 'Ingen av de kritiske hensynene ble utløst av svarene dine. Forutsetningene fremstår som ivaretatt i den beskrevne situasjonen.';
  }

  if (flow === 'deployer') {

    if (resultKey === 'red') {
      if (f.has('no_responsibility') && f.has('no_human_control'))
        return 'Behandlingsansvaret er ikke formelt plassert og mekanismer for menneskelig kontroll mangler. Systemet har ingen governance-forankring – ingen eier det, og ingen kan overstyre det.';
      if ((f.has('extensive_personal_data') || f.has('unknown_personal_data')) && f.has('no_responsibility'))
        return 'Systemet behandler personopplysninger i stor utstrekning eller av ukjent omfang, men behandlingsansvaret er ikke plassert. Uten formell eier kan behandlingen ikke forankres rettslig.';
      if (f.has('profiles_students') && f.has('no_human_control'))
        return 'Systemet profilerer, rangerer eller vurderer elever automatisk, uten mekanisme for menneskelig overstyring eller innsyn. Automatiserte beslutninger om elever forutsetter kontrollmulighet.';
      if (f.has('profiles_students') && f.has('no_regulatory'))
        return 'Systemet profilerer, rangerer eller vurderer elever automatisk, men er ikke vurdert opp mot gjeldende regelverk. Slike systemer kan falle under høyrisikoklassifisering i AI Act og krever grundig utredning.';
      if (f.has('extensive_personal_data') && f.has('no_regulatory'))
        return 'Systemet behandler personopplysninger i stor utstrekning eller av sensitiv karakter, men er ikke vurdert rettslig eller personvernfaglig. Dette er et krav – ikke et valg.';
      if (f.has('extensive_personal_data') && f.has('no_human_control'))
        return 'Systemet behandler sensitive personopplysninger, og det er ingen mekanisme for menneskelig kontroll. Ansvarlig behandling forutsetter at noen kan overstyre, korrigere og stanse systemet.';
    }

    if (resultKey === 'pilot')
      return 'Planlagt omfang er på fylkeskommunalt nivå eller i stor kommunal skala, men ett eller flere governance-elementer er ikke fullt ut etablert. En begrenset og forpliktende pilot forutsettes som styringsgrep.';

    if (resultKey === 'navigate') {
      if (f.has('no_human_control'))
        return 'Det er ikke etablert mekanismer for menneskelig kontroll og innsyn. Evnen til å overstyre, korrigere og stanse systemet er en grunnleggende forutsetning.';
      if (f.has('no_responsibility'))
        return 'Behandlingsansvaret er ikke formelt plassert og nødvendige avtaler mangler. Ingen kan holdes ansvarlig for systemets behandling av data.';
      if (f.has('no_competence'))
        return 'De som skal forvalte systemet har ikke tilstrekkelig KI-kompetanse. Det er en forutsetning – ikke noe som kan etableres etter implementering.';
      if (f.has('no_regulatory'))
        return 'Systemet er ikke vurdert opp mot gjeldende regelverk, og anskaffelsesprosessen er ikke gjennomført forsvarlig. Disse vurderingene er obligatoriske for offentlig sektor.';
      if (f.has('unknown_personal_data'))
        return 'Omfanget av personopplysningsbehandlingen er ikke kartlagt. Forsvarlig behandling forutsetter klarhet om hva som behandles og i hvilken utstrekning.';
      if (f.has('extensive_personal_data'))
        return 'Systemet behandler personopplysninger i stor utstrekning, men nødvendige governance-elementer er ikke fullt ut på plass. Slik behandling forutsetter avklart ansvar, kontrollmekanismer og juridisk grunnlag.';
      if (f.has('direct_student_use'))
        return 'Verktøyet brukes direkte av elever, og kontroll- eller ansvarsmekanismer er ikke fullt ut etablert. Direkte elevbruk forutsetter at disse er på plass.';
      if (f.has('profiles_students'))
        return 'Systemet profilerer, rangerer eller vurderer elever automatisk, og ett eller flere governance-elementer er delvis på plass. Disse bør avklares før videre prosess.';
    }

    if (resultKey === 'green')
      return 'Ingen av de kritiske governance-forholdene ble utløst av svarene dine. Sentrale forutsetninger for implementering fremstår som etablert.';
  }

  return null;
}

function calculateLaererResult(f = collectFlags()) {

  // ── RED: specific harmful combinations ─────────────────────
  // Cannot verify output (direct grading / unsupervised students / invasive system)
  if (f.has('no_control') && (f.has('direct_grading') || f.has('students_alone') || f.has('invasive_system'))) return 'red';
  // Invasive system with no teacher supervision
  if (f.has('invasive_system') && f.has('students_alone')) return 'red';
  // No competence with high-stakes use (grading or invasive system)
  if (f.has('no_competence') && (f.has('direct_grading') || f.has('invasive_system'))) return 'red';
  // Personal data on minors with no institutional framework
  if (
    (f.has('personal_data_extensive') || f.has('unknown_personal_data')) &&
    f.has('minors') &&
    f.has('no_guidelines')
  ) return 'red';
  // No guidelines, no competence, and unsupervised student use
  if (f.has('no_guidelines') && f.has('no_competence') && f.has('students_alone')) return 'red';

  // ── AMBER: any single significant concern ───────────────────
  if (f.has('no_control'))     return 'amber'; // cannot evaluate output at all
  if (f.has('no_transparency')) return 'amber'; // transparency obligation not met
  if (f.has('no_competence'))  return 'amber'; // fundamental prerequisite missing
  if (f.has('invasive_system')) return 'amber'; // deployer-level concern; teacher needs org support
  if (f.has('direct_grading')) return 'amber'; // KI directly determines grades

  // ── AMBER: combinations that warrant clarification ──────────
  // Unsupervised use with any additional unresolved concern
  if (f.has('students_alone') && (
    f.has('no_guidelines') ||
    f.has('no_justification') ||
    f.has('personal_data_extensive') ||
    f.has('unknown_personal_data') ||
    f.has('partial_control') ||
    f.has('partial_guidelines') ||
    f.has('partial_competence')
  )) return 'amber';
  // Personal data on minors without full clarity
  if ((f.has('personal_data_extensive') || f.has('unknown_personal_data')) && f.has('minors')) return 'amber';
  // Personal data present with no guidelines in place
  if ((f.has('personal_data_extensive') || f.has('unknown_personal_data')) && f.has('no_guidelines')) return 'amber';
  // Both pedagogical basis and guidelines are absent
  if (f.has('no_justification') && f.has('no_guidelines')) return 'amber';

  // ── GREEN ────────────────────────────────────────────────────
  return 'green';
}

function calculateDeployerResult(f = collectFlags()) {

  // ── RED: structural governance failures ─────────────────────
  // No ownership AND no oversight — system has no accountability anchor
  if (f.has('no_responsibility') && f.has('no_human_control')) return 'red';
  // Extensive or unmapped personal data with no formal ownership
  if ((f.has('extensive_personal_data') || f.has('unknown_personal_data')) && f.has('no_responsibility')) return 'red';
  // Automated student profiling/ranking without oversight or regulatory review
  if (f.has('profiles_students') && (f.has('no_human_control') || f.has('no_regulatory'))) return 'red';
  // Extensive sensitive data without oversight or regulatory review
  if (f.has('extensive_personal_data') && (f.has('no_human_control') || f.has('no_regulatory'))) return 'red';

  // ── PILOT: high-ambition scale with unresolved governance ───
  // Large-scale deployment before governance is fully ready → limit scope first
  if (f.has('large_scale') && (
    f.has('no_competence')       ||
    f.has('competence_planned')  ||
    f.has('no_human_control')    ||
    f.has('partial_control')     ||
    f.has('no_responsibility')   ||
    f.has('partial_responsibility') ||
    f.has('no_regulatory')       ||
    f.has('partial_regulatory')
  )) return 'pilot';

  // ── NAVIGATE: single significant governance gaps ─────────────
  if (f.has('no_human_control'))    return 'navigate'; // no oversight mechanism
  if (f.has('no_responsibility'))   return 'navigate'; // accountability not assigned
  if (f.has('no_competence'))       return 'navigate'; // prerequisite competence missing
  if (f.has('no_regulatory'))       return 'navigate'; // no legal/procurement review
  if (f.has('unknown_personal_data')) return 'navigate'; // data scope not mapped
  // Sensitive data with only partial governance readiness
  if (f.has('extensive_personal_data') && (
    f.has('partial_control')       ||
    f.has('competence_planned')    ||
    f.has('partial_responsibility') ||
    f.has('partial_regulatory')
  )) return 'navigate';
  // Direct student-facing system with unresolved oversight or ownership
  if (f.has('direct_student_use') && (
    f.has('partial_control') || f.has('partial_responsibility')
  )) return 'navigate';
  // System profiling students with any partial governance gap
  if (f.has('profiles_students') && (
    f.has('partial_control')       ||
    f.has('partial_responsibility') ||
    f.has('partial_regulatory')
  )) return 'navigate';

  // ── GREEN ────────────────────────────────────────────────────
  return 'green';
}

/* ============================================================
   RENDERING
   ============================================================ */

const app = document.getElementById('app');

function render() {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!state.flow) {
    renderStart();
    return;
  }

  const questions = currentQuestions();
  if (state.currentQuestion < questions.length) {
    renderQuestion(questions);
  } else {
    renderResult();
  }
}

function currentQuestions() {
  return state.flow === 'laerer' ? laererQuestions : deployerQuestions;
}

function renderStart() {
  app.innerHTML = `
    <div class="card">
      <p class="start-eyebrow">Vurderingsveiviser</p>
      <h1 class="start-title">Ansvarlig KI i skolen</h1>
      <p class="start-intro">
        Dette verktøyet hjelper deg å vurdere bruk av kunstig intelligens i skolekontekst.
        Du får et faglig vurderingsgrunnlag – ikke juridiske råd, godkjenninger eller tillatelser.
        Menneskelig vurdering er alltid siste ledd.
      </p>

      <p class="role-prompt">Hvem er du?</p>

      <div class="role-grid">
        <button class="role-button" onclick="startFlow('laerer')">
          <span class="role-icon">👩‍🏫</span>
          <span class="role-title">Jeg er lærer</span>
          <span class="role-desc">Vil vurdere pedagogisk bruk av KI i min undervisning</span>
        </button>
        <button class="role-button" onclick="startFlow('deployer')">
          <span class="role-icon">🏛️</span>
          <span class="role-title">Skole / fylkeskommune</span>
          <span class="role-desc">Vurderer innføring av et KI-system på vegne av organisasjonen</span>
        </button>
      </div>

      <div class="notice-box">
        <strong>Merk:</strong> Dette er et vurderingsverktøy – ikke et godkjennings-, beslutnings- eller saksbehandlingssystem.
        Utfallet er et faglig vurderingsgrunnlag, ikke en juridisk klassifisering, risikovurdering eller tillatelse.
        Verktøyet erstatter ikke personvernfaglig eller juridisk kompetanse.
        Alle beslutninger treffes av ansvarlige personer i din organisasjon.
      </div>
    </div>
  `;
}

function renderQuestion(questions) {
  const q       = questions[state.currentQuestion];
  const total   = questions.length;
  const current = state.currentQuestion + 1;
  const flowLabel = state.flow === 'laerer' ? 'Lærervurdering' : 'Deployervurdering';

  const segmentsHtml = Array.from({length: total}, (_, i) => {
    const cls = i < current - 1 ? 'done' : i === current - 1 ? 'active' : '';
    return `<div class="step-seg ${cls}"></div>`;
  }).join('');

  const hintHtml = q.hint
    ? `<p class="question-hint">${escHtml(q.hint)}</p>`
    : `<div class="no-hint-spacer"></div>`;

  const answersHtml = q.answers.map((a, i) => `
    <button class="answer-button" onclick="selectAnswer(${i})">
      <span class="answer-bullet">${i + 1}</span>
      <span class="answer-text">${escHtml(a.text)}</span>
      <span class="answer-radio" aria-hidden="true"></span>
    </button>
  `).join('');

  const backLabel = state.currentQuestion === 0
    ? '&#8592; Tilbake til start'
    : '&#8592; Forrige spørsmål';

  app.innerHTML = `
    <div class="card">
      <div class="progress-area">
        <div class="progress-meta">
          <span class="progress-flow-label">${escHtml(flowLabel)}</span>
          <span class="progress-count">Spørsmål ${current} av ${total}</span>
        </div>
        <div class="progress-steps">${segmentsHtml}</div>
      </div>

      <span class="question-tag">${escHtml(q.tag)}</span>
      <h2 class="question-text">${escHtml(q.text)}</h2>
      ${hintHtml}

      <div class="answers-list">${answersHtml}</div>

      <div class="nav-row">
        <button class="btn btn-ghost" onclick="goBack()">${backLabel}</button>
      </div>
    </div>
  `;
}

function renderResult() {
  const flags   = collectFlags();
  const key     = state.flow === 'laerer' ? calculateLaererResult(flags) : calculateDeployerResult(flags);
  const results = state.flow === 'laerer' ? laererResults : deployerResults;
  const r       = results[key];
  const trigger = generateFlagExplanation(state.flow, flags, key);

  const triggerHtml = trigger ? `
      <div class="result-trigger result-trigger--${r.badge}">
        <div class="result-trigger-label">Hva utløste dette utfallet?</div>
        <p class="result-trigger-text">${escHtml(trigger)}</p>
      </div>` : '';

  const regelverkHtml = r.regelverkNote ? `
      <div class="result-section">
        <div class="result-section-heading">Forhold til regelverk</div>
        <p>${escHtml(r.regelverkNote)}</p>
      </div>` : '';

  const juridiskHtml = r.juridiskNote ? `
      <div class="result-section">
        <div class="result-section-heading">Forhold til juridisk vurdering</div>
        <p>${escHtml(r.juridiskNote)}</p>
      </div>` : '';

  app.innerHTML = `
    <div class="card">
      <div class="result-badge ${r.badge}">
        <span class="result-emoji">${r.emoji}</span>
        <div>
          <div class="result-title">${r.title}</div>
          <div class="result-subtitle">${r.subtitle}</div>
        </div>
      </div>

      ${triggerHtml}

      <div class="result-narrative">
        <div class="result-section">
          <div class="result-section-heading">Vurdering</div>
          <p>${r.explanation}</p>
        </div>

        <div class="result-section">
          <div class="result-section-heading">Hva betyr dette i praksis?</div>
          <p>${r.inPractice}</p>
        </div>
      </div>

      <div class="result-section">
        <div class="result-section-heading">Relevante rammer og referanser</div>
        <div class="ref-grid">
          <div class="ref-card">
            <div class="ref-label">AI Act</div>
            <div class="ref-text">${r.refs.aiact}</div>
          </div>
          <div class="ref-card">
            <div class="ref-label">Personvern (GDPR)</div>
            <div class="ref-text">${r.refs.gdpr}</div>
          </div>
          <div class="ref-card">
            <div class="ref-label">Skolekontekst</div>
            <div class="ref-text">${r.refs.school}</div>
          </div>
        </div>
      </div>

      ${regelverkHtml}

      ${juridiskHtml}

      <div class="result-notice">
        <strong>Merk:</strong> Dette er et vurderingsgrunnlag – ikke en juridisk vurdering, godkjenning
        eller tillatelse. Verktøyet erstatter ikke personvernfaglig eller juridisk kompetanse og er ikke
        et saksbehandlingsverktøy. Utfallet er basert på dine svar og gir et faglig utgangspunkt for
        videre dialog. Endelig beslutning treffes alltid av ansvarlige personer i din organisasjon.
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" onclick="restartFlow()">Ta vurderingen på nytt</button>
        <button class="btn btn-ghost" onclick="goToStart()">Velg annen rolle</button>
      </div>
    </div>
  `;
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function startFlow(flow) {
  state.flow            = flow;
  state.currentQuestion = 0;
  state.answers         = [];
  render();
}

function selectAnswer(index) {
  state.answers[state.currentQuestion] = index;

  // Brief visual feedback before advancing
  const btn = document.querySelectorAll('.answer-button')[index];
  if (btn) btn.classList.add('selected');

  setTimeout(() => {
    state.currentQuestion++;
    render();
  }, 180);
}

function goBack() {
  if (state.currentQuestion === 0) {
    goToStart();
    return;
  }
  state.currentQuestion--;
  state.answers.splice(state.currentQuestion, 1);
  render();
}

function restartFlow() {
  startFlow(state.flow);
}

function goToStart() {
  state.flow            = null;
  state.currentQuestion = 0;
  state.answers         = [];
  render();
}

/* ============================================================
   UTILITIES
   ============================================================ */

function escHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

/* ============================================================
   INIT
   ============================================================ */

render();
