# Projekt: Ansvarlig KI i skolen

## Formål
Dette prosjektet utvikler en beslutningsveiviser (decision tree) for å vurdere bruk av KI i skolekontekst.

Verktøyet gir vurderingsgrunnlag – ikke beslutninger.

## Viktige premisser
- Ikke juridisk rådgivning
- Ikke ROS/DPIA-verktøy
- Ingen risikoscore eller juridisk klassifisering
- Vurderingsutfall ≠ tillatelse

## Systemarkitektur

Løsningen består av en portal med fire inngangssteiner:

1. **Bør vi bruke KI?**  
   - Tidligfase-evaluering  
   - Avgjør om KI skal vurderes videre

2. **Ansvarlig KI i skolen**  
   - Operativ beslutningsstøtte  
   - Fokus på ansvar, kontroll og bruk

3. **Juridisk vurdering** (eksternt verktøy)  
   - Juridisk klassifisering utføres utenfor dette systemet  
   - Ikke eid eller implementert internt

4. **Implementering og drift**  
   - Gjennomføring, oppfølging og styring

**Vesentlig:** Disse verktøyene må holdes atskilte og må ikke overlappe i funksjonalitet.

## Prinsipper
- Menneskelig beslutning alltid siste ledd
- Pilot er et styringsgrep (ikke risikonivå)
- Lærer er aldri deployer
- KI-kompetanse er en forutsetning, ikke et kurskrav

## Agentsystem

Kjernagenter:
- agent-command (orkestrering)
- agent-juridisk
- agent-styring
- agent-ai-act
- agent-pedagogikk
- agent-beslutningsdesign
- agent-begrepskontroll
- agent-regulatorisk-kontekst

Utvidede agenter:
- agent-portal-design (navigasjon)
- agent-onboarding (brukerveiledning)
- agent-implementation (implementeringsveiledning)

## Juridiske prinsipper

- Systemet gir ikke juridiske konklusjoner
- Juridisk vurdering utføres eksternt
- Systemet skal ikke:
  - klassifisere KI-systemer juridisk
  - si hva som er lovlig eller ulovlig
  - anty godkjenning eller compliance
- Resultater skal støtte beslutninger, ikke erstatte dem

## Roller

Deployer-flyten støtter flere perspektiver:
- operativ (skolenivå)
- ledelse (skoleleder)
- administrativ (fylkeskommune / styring)

Samme beslutningslogikk gjelder på tvers av roller, men resultater tilpasses til:
- reflektere ansvar
- støtte organisatorisk beslutningstaking

## Viktig

Ikke:
- slå sammen verktøy i ett system
- duplikere logikk mellom verktøy
- introduser juridisk klassifiseringslogikk
- utvid enkle verktøy til fulle beslutningssystemer

Hvert verktøy skal:
- tjene et klart formål
- være uavhengig
- kobles gjennom flyt, ikke logisk sammenkobling

## Regel
Alle forespørsler skal:
- bruke relevante agenter eksplisitt
- ikke gi juridiske konklusjoner
- ikke gi "tillatelser"