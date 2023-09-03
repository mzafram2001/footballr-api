const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "https://www.flashscore.com/football/england/premier-league/standings/",
    spain: "https://www.flashscore.com/football/spain/laliga/standings/",
    france: "https://www.flashscore.com/football/france/ligue-1/standings/",
    italy: "https://www.flashscore.com/football/italy/serie-a/standings/",
    germany: "https://www.flashscore.com/football/germany/bundesliga/standings/",
};

const STANDINGS_URLS = {
    ENGLAND: URLS.england,
    SPAIN: URLS.spain,
    FRANCE: URLS.france,
    ITALY: URLS.italy,
    GERMANY: URLS.germany
};

async function getStandings(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        const LEAGUES = {
            "LaLiga": "ESP",
            "Bundesliga": "GER",
            "Serie A": "ITA",
            "Ligue 1": "FRA",
            "Premier League": "ENG"
        };
        const HEADING = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading');
        JSON.name = HEADING.querySelector('div.heading__title > div.heading__name').innerText;
        JSON.area = LEAGUES[JSON.name];
        const HEADING_INFO = HEADING.querySelector('div.heading__info').innerText;
        JSON.yearStart = parseInt(HEADING_INFO.substring(0, 4));
        JSON.yearEnd = parseInt(HEADING_INFO.substring(5, JSON.yearStart - 1));
        JSON.standings = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        const ROWS = document.querySelectorAll('.ui-table__row  ');
        ROWS.forEach(element => {
            const TEAM_NAME = {
                "Napoli": "Calcio Napoli",
                "Inter": "Inter Milán",
                "AC Milan": "Calcio Milan",
                "AS Roma": "Roma",
                "Atalanta": "Calcio Atalanta",
                "Udinese": "Calcio Udinese",
                "Fiorentina": "Calcio Fiorentina",
                "Monza": "Calcio Monza",
                "Sassuolo": "Calcio Sassuolo",
                "Spezia": "Calcio Spezia",
                "Verona": "Hellas Verona",
                "Sampdoria": "Calcio Cagliari",
                "Cagliari": "Calcio Cagliari",
                "Benevento": "Calcio Benevento",
                "Parma": "Calcio Parma",
                "Chievo": "Calcio Chievo",
                "AC Carpi": "Calcio Carpi",
                "Frosinone": "Calcio Frosinone",
                "Pescara": "Delfino Pescara",
                "Brescia": "Calcio Brescia",
                "Dortmund": "Borussia Dortmund",
                "RB Leipzig": "RasenBallsport Leipzig",
                "B. Monchengladbach": "Borussia Mönchengladbach",
                "FC Koln": "Köln",
                "Greuther Furth": "Greuther Fürth",
                "Hamburger SV": "Hamburger Sport-Verein",
                "Darmstadt": "Darmstadt Sport-Verein",
                "Hannover": "Hannover Sport-Verein",
                "Dusseldorf": "Fortuna Düsseldorf",
                "Nurnberg": "Nürnberg",
                "Atl. Madrid": "Atlético Madrid",
                "Betis": "Real Betis",
                "Granada CF": "Granada",
                "Ath Bilbao": "Athletic Bilbao",
                "Cadiz CF": "Cádiz",
                "Alaves": "Deportivo Alavés",
                "Almeria": "Almería",
                "Malaga": "Málaga",
                "Dep. La Coruna": "Deportivo La Coruña",
                "Gijon": "Gijón",
                "Leganes": "Leganés",
                "Paris SG": "Paris Saint-Germain",
                "Marseille": "Olympique Marseille",
                "Lens": "Racing Lens",
                "Rennes": "Stade Rennais",
                "Lille": "Olympique Lille",
                "Nice": "Olympique Nice",
                "Reims": "Stade Reims",
                "Lyon": "Olympique Lyonnais",
                "Strasbourg": "Racing Strasbourg",
                "Brest": "Stade Brestois",
                "AC Ajaccio": "Athletic Ajaccien",
                "Angers": "Sporting Angers",
                "St Etienne": "Saint-Étienne Loire",
                "Bordeaux": "Girondins Bordeaux",
                "Nimes": "Olympique Nîmes",
                "Caen": "Stade Malherbe Caen",
                "Bastia": "Sporting Bastia",
                "GFC Ajaccio": "Gazélec Ajaccio",
                "Nancy": "Nancy Lorraine",
                "Amiens": "Sporting Amiens",
                "Manchester Utd": "Manchester United",
                "Tottenham": "Tottenham Hotspur",
                "Newcastle": "Newcastle United",
                "Wolves": "Wolverhampton Wanderers",
                "Leeds": "Leeds United",
                "Nottingham": "Nottingham Forest",
                "Leicester": "Leicester City",
                "West Ham": "West Ham United",
                "Bournemouth": "Athletic Bournemouth",
                "West Brom": "West Bromwich",
                "Sheffield Utd": "Sheffield United",
                "Norwich": "Norwich City",
                "Stoke": "Stoke City",
                "Hull": "Hull City",
                "Cardiff": "Cardiff City",
                "Swansea": "Swansea City"
            };
            numRow++;
            const TMP = {};
            element.querySelectorAll('.table__cell--value   ').innerText;
            if (numRow < 10) {
                TMP.position = parseInt(element.querySelector('.tableCellRank').innerText.substring(0, 1));
            } else {
                TMP.position = parseInt(element.querySelector('.tableCellRank').innerText.substring(0, 2));
            }
            TMP.team = {};
            dumpString = element.querySelector('.tableCellParticipant__image').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.team.id = dumpStringArray[3];
            TMP.team.name = element.querySelector('.tableCellParticipant__name').innerText;
            TMP.team.name = TEAM_NAME[TMP.team.name] || TMP.team.name;
            TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.team.id + ".svg";
            TMP.playedGames = parseInt(element.querySelector('.table__cell--value').innerText);
            TMP.wins = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(4)').innerText);
            TMP.draws = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(5)').innerText);
            TMP.loses = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(6)').innerText);
            dumpString = element.querySelector('.table__cell--score').innerText;
            dumpStringArray = dumpString.split(':');
            TMP.goalsFor = parseInt(dumpStringArray[0]);
            TMP.goalsAgainst = parseInt(dumpStringArray[1]);
            TMP.goalDifference = parseInt(TMP.goalsFor) - parseInt(TMP.goalsAgainst);
            TMP.points = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span.table__cell.table__cell--value.table__cell--points').innerText);
            var form = element.querySelectorAll('.tableCellFormIcon');
            var dump = 0;
            form.forEach(element => {
                dump++;
                if (dump == 2) {
                    TMP.form = element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + dump + ') > div').innerText;
                } else if (dump > 2) {
                    TMP.form = TMP.form.concat(",", element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + dump + ') > div').innerText);
                } else {
                    TMP.form = "-";
                }
            });
            JSON.standings.push(TMP);
        });
        return JSON;
    });
    var leagueName = RESULT.name;
    var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standings" + leagueName.replace(" ", "") + RESULT.yearStart + "Flashcore.json");
    FS.writeFile(fileLocation, JSON.stringify(RESULT), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}

getStandings(STANDINGS_URLS.ENGLAND);
getStandings(STANDINGS_URLS.SPAIN);
getStandings(STANDINGS_URLS.FRANCE);
getStandings(STANDINGS_URLS.ITALY);
getStandings(STANDINGS_URLS.GERMANY);