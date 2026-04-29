# Projekt: Ansvarlig KI i skolen

## Formål
Dette prosjektet utvikler en beslutningsveiviser (decision tree) for å vurdere bruk av KI i skolekontekst.

Verktøyet gir vurderingsgrunnlag – ikke beslutninger.

## Viktige premisser
- Ikke juridisk rådgivning
- Ikke ROS/DPIA-verktøy
- Ingen risikoscore eller juridisk klassifisering
- Vurderingsutfall ≠ tillatelse

## Arkitektur
To separate decision trees:
1. Lærer (pedagogisk bruk)
2. Deployer (skole / fylkeskommune / IKT)

## Prinsipper
- Menneskelig beslutning alltid siste ledd
- Pilot er et styringsgrep (ikke risikonivå)
- Lærer er aldri deployer
- KI-kompetanse er en forutsetning, ikke et kurskrav

## Agentsystem
Prosjektet bruker følgende agenter:

- agent-command (orkestrering)
- agent-juridisk
- agent-styring
- agent-ai-act
- agent-pedagogikk
- agent-beslutningsdesign
- agent-begrepskontroll
- agent-regulatorisk-kontekst

## Regel
Alle forespørsler skal:
- bruke relevante agenter eksplisitt
- ikke gi juridiske konklusjoner
- ikke gi "tillatelser"