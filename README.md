## ⚽️ FootballR API [v20240806]

![Banner](https://raw.githubusercontent.com/mzafram2001/footballr-api/main/src/readme/footballr_banner_2.png)

<p align='center'>
   <a href='#'><img align='center' alt='GitHub repo size' src='https://img.shields.io/github/repo-size/mzafram2001/footballr-api?color=C1C1C1&style=for-the-badge&logo=github'></a>
   <a href='https://github.com/mzafram2001/footballr-api/stargazers'><img align='center' alt='Stars' src='https://img.shields.io/github/stars/mzafram2001/footballr-api?color=C1C1C1&style=for-the-badge&logo=data%3Aimage/png%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAYAAAC9pNwMAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHpFAACAgwAA/FcAAIDoAAB5FgAA8QEAADtfAAAcheDStWoAAAHISURBVHjavJS/a1NRGIafm7RaaGJ1KR0MQUVNBiOhtKLg6GKXItRJVwc3M%2BpW%2Bg/4Fwid3LRLBydBHARBiqSiqcY2UOgipopBQnxdzpXr5dyb5iQnHxw49/z4nvOe7543kIRjPAFywIrL5sARPAF0TT8P/Bw0QcZR7cNIf3VcirNG4ZT5/mOuvONb8YMINMzxyLfiLNAGpmPjPVPrji/F9y3Q8EA1n4oPgNmEuUNgxofitRQowAng8bCKTwFF4CxQBq4BN4%2BY8wXwCvgAfAb2gG828C3gDHDOgIpAIaGWLvELaAG7QBNoAF8DSV8MeJxxkAEWgfoYoU1gPqzxceANcNkztAEsAO3wr/5tBt55hH4C5o0B/fecusBVT/CPpqQ//o1IircJSW81utiWlItzkt5xAGwBl4ZUugNUbB6eZplFU5djjtAeUAXeu3h1CzjtCG4DJ128eq6PN/eLPHDeBVwd4prD3FUXcGkEz%2BiCC/jiCMAlH%2BAN4JmrYpuBhG0/wRCeSqpE1pUkrSes/S5p0pY/CVqwJNmUdD3loFckPbfsKw8CXo5sfC1pKQUYbzckvYzsvzMI%2BJ7x2LsDAOPttqS6pJpt/u8AK65O%2Bt9ReEMAAAAASUVORK5CYII%3D'></a>
<a href='#'><img align='center' alt='Version' src='https://img.shields.io/badge/Version-20240806-C1C1C1?style=for-the-badge&logo=convertio&logoColor=white'></a>
</p>

## ⚽️ About the project / Sobre el proyecto
<div>
  🇬🇧 FootballR API is a comprehensive platform for accessing up-to-date and detailed data on various aspects of the world of football. From team, player and match information to real-time statistics, this API provides a robust and easy-to-use interface for developers, analysts and football enthusiasts alike.
</div>
<br>
<div>
  🇪🇸 FootballR API es una plataforma integral para acceder a datos actualizados y detallados sobre diversos aspectos del mundo del fútbol. Desde información sobre equipos, jugadores y partidos hasta estadísticas en tiempo real, esta API proporciona una interfaz robusta y fácil de usar para desarrolladores, analistas y entusiastas del fútbol por igual.
</div>
<br>

![Banner](https://raw.githubusercontent.com/mzafram2001/footballr-api/main/src/readme/footballr_shoot_1.png)

## ⚽️ Easy integration / Fácil integración

<div>
  🇬🇧 Very easy to integrate in your projects, from a single request and different filters, you can have up to date information. Keep up to date with the latest events and results with constantly updated data.
</div>
<br>
<div>
  🇪🇸 Muy fácil de integrar en tus proyectos, a partir de una sola petición y distintos filtros, puedes tener la información actualizada. Mantente al día con los últimos eventos y resultados con datos actualizados constantemente.
</div>
<br>

![Banner](https://raw.githubusercontent.com/mzafram2001/footballr-api/main/src/readme/footballr_shoot_2.png)

## ⚽️ User-friendly interface / Interfaz Amigable

<div>
  🇬🇧 A well-documented and easy-to-use API with clear examples and comprehensive documentation for seamless integration.
</div>
<br>
<div>
  🇪🇸 Una API bien documentada y fácil de usar, con ejemplos claros y documentación exhaustiva para una integración sin problemas.
</div>
<br>

![Banner](https://raw.githubusercontent.com/mzafram2001/footballr-api/main/src/readme/footballr_shoot_3.png)

## ⚽️ Endpoints list / Lista de puntos finales

<div>
  🇬🇧 Below is a list of endpoints and examples of use:
  <ul>
    <li>GET <b>/areas/:id</b>: List all AVAILABLE areas 🌍. (filters AVAILABLE).</li>
    <li>GET <b>/competitions/:id/</b>: List all AVAILABLE competitions 🏆. (filters AVAILABLE).</li>
    <li>GET /competitions<b>/:id/standings</b>: List the current standings for a league 🔝. (filters AVAILABLE).</li>
    <li>GET /competitions<b>/:id/scorers</b>: List the current scorers for a league ⚽. (filters AVAILABLE).</li>
    <li>GET /competitions<b>/:id/matches/:round/:idMatch</b>: List the current matches results for a league 🆚. (filters AVAILABLE).</li>
    <li>GET /competitions<b>/:id/fixtures</b>: List the next scheduled matches for a league 🔜. (filters AVAILABLE).</li>
    <li>GET <b>/teams/:id</b>: List all AVAILABLE teams 🛡️. (filters AVAILABLE).</li>
    <li>GET <b>/players/:id</b>: List all AVAILABLE players 🏃. (not implemented yet).</li>
    <li>GET <b>/stadiums/:id</b>: List all AVAILABLE stadiums 🏟️.  (not implemented yet).</li>
    <li>GET <b>/simulator/:idTeamHome/:idTeamAway</b>: Returns a simulation match between 2 teams ♻️.  (not implemented yet).</li>
  </ul>
  <p>Some URL examples:</p>
  <ul>
    <li>https://api-footballr.arkeos.workers.dev/areas/ITA</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/LAL/standings</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/LI1/scorers</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/PRL/matches</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/BUN/fixtures</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/SEA/matches/14</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/PRL/matches/1/EkT4QbqS</li>
    <li>https://api-footballr.arkeos.workers.dev/teams/W8mj7MDD</li>
  </ul>
</div>
<br>
<div>
  🇪🇸 A continuación tienes un listado con los puntos finales y ejemplos de uso:
  <ul>
    <li>GET <b>/areas/:id</b>: Lista todas las zonas disponibles 🌍. (filtros disponibles).</li>
    <li>GET <b>/competitions/:id/</b>: Lista de todas las competiciones disponibles 🏆. (filtros disponibles).</li>
    <li>GET /competitions<b>/:id/standings</b>: Lista la clasificación actual de una liga 🔝. (filtros disponibles).</li>
    <li>GET /competitions<b>/:id/scorers</b>: Lista los goleadores actuales de una liga ⚽. (filtros disponibles).</li>
    <li>GET /competitions<b>/:id/matches/:round/:idMatch</b>: Lista los resultados de los partidos actuales de una liga 🆚. (filtros disponibles).</li>
    <li>GET /competitions<b>/:id/fixtures</b>: Lista los próximos partidos programados para una liga 🔜. (filtros disponibles).</li>
    <li>GET <b>/teams/:id</b>: Lista de todos los equipos disponibles 🛡️. (filtros disponibles).</li>
    <li>GET <b>/players/:id</b>: Lista de todos los jugadores disponibles 🏃. (aún no implementado).</li>
    <li>GET <b>/stadiums/:id</b>: Lista de todos los estadios disponibles 🏟️.  (aún no implementado).</li>
    <li>GET <b>/simulator/:idTeamHome/:idTeamAway</b>: Devuelve un partido de simulación entre 2 equipos ♻️.  (aún no implementado).</li>
  </ul>
  <p>Algunas URL de ejemplo:</p>
  <ul>
    <li>https://api-footballr.arkeos.workers.dev/areas/ITA</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/LAL/standings</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/LI1/scorers</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/PRL/matches</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/BUN/fixtures</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/SEA/matches/14</li>
    <li>https://api-footballr.arkeos.workers.dev/competitions/PRL/matches/1/EkT4QbqS</li>
    <li>https://api-footballr.arkeos.workers.dev/teams/W8mj7MDD</li>
  </ul>
</div>
<br>

![Banner](https://raw.githubusercontent.com/mzafram2001/footballr-api/main/src/readme/footballr_shoot_4.png)

## ⚽️ Roadmap / Hoja de ruta
<div>
   🇬🇧 Here is the roadmap for this project:
   <ul>
      <li>✅ Create api and deploy successfully.</li>
      <li>✅ Create endpoints with successful results.</li>
      <li>✅ Automate updates.</li>
      <li>❌ More data on current endpoints.</li>
      <li>❌ More endpoints (stadiums, players and simulation).</li>
      <li>❌ Optimise files to improve response time.</li>
      <li>❌ Fix bugs.</li>
      <li>❌ Create demo web app.</li>
   </ul>
</div>
<br>
<div>
   🇪🇸 Aquí tienes la hoja de ruta para este proyecto:
   <ul>
      <li>✅ Crear api y realizar el deploy con éxito.</li>
      <li>✅ Creación de puntos finales con resultados correctos.</li>
      <li>✅ Automatizar actualizaciones.</li>
      <li>❌ Más datos en los puntos finales actuales.</li>
      <li>❌ Más puntos finales (estadios, jugadores y simulación).</li>
      <li>❌ Optimizar archivos para mejorar el tiempo de rspuesta.</li>
      <li>❌ Corregir bugs.</li>
      <li>❌ Crear web app de demostración.</li>
   </ul>
</div>
<br>

![Banner](https://raw.githubusercontent.com/mzafram2001/footballr-api/main/src/readme/footballr_banner_1.png)
