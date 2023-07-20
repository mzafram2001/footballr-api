const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    england_2023: "https://www.flashscore.com/football/england/premier-league/standings/",
    spain_2023: "https://www.flashscore.com/football/spain/laliga/standings/",
    france_2023: "https://www.flashscore.com/football/france/ligue-1/standings/",
    italy_2023: "https://www.flashscore.com/football/italy/serie-a/standings/",
    germany_2023: "https://www.flashscore.com/football/germany/bundesliga/standings/",
};

async function getStandings2023(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
        switch (JSON.name) {
            case "LaLiga": JSON.area = "ESP";
                break;
            case "Bundesliga": JSON.area = "GER";
                break;
            case "Serie A": JSON.area = "ITA";
                break;
            case "Ligue 1": JSON.area = "FRA";
                break;
            case "Premier League": JSON.area = "ENG";
                break;
        }
        JSON.yearStart = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearStart = parseInt(JSON.yearStart.substring(0, 4));
        JSON.yearEnd = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearEnd = parseInt(JSON.yearEnd.substring(5, JSON.yearStart - 1));
        JSON.standings = [];
        var numRow = 0;
        var dumpString;
        var dumpStringArray;
        const ROWS = document.querySelectorAll('.ui-table__row  ');
        ROWS.forEach(element => {
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
            switch (TMP.team.name) {
                case "Napoli": TMP.team.name = "Calcio Napoli";
                    break;
                case "Inter": TMP.team.name = "Inter Milán";
                    break;
                case "AC Milan": TMP.team.name = "Calcio Milán";
                    break;
                case "AS Roma": TMP.team.name = "Roma";
                    break;
                case "Atalanta": TMP.team.name = "Calcio Atalanta";
                    break;
                case "Udinese": TMP.team.name = "Calcio Udinese";
                    break;
                case "Fiorentina": TMP.team.name = "Calcio Fiorentina";
                    break;
                case "Sassuolo": TMP.team.name = "Calcio Sassuolo";
                    break;
                case "Monza": TMP.team.name = "Calcio Monza";
                    break;
                case "Spezia": TMP.team.name = "Calcio Spezia";
                    break;
                case "Verona": TMP.team.name = "Hellas Verona";
                    break;
                case "Sampdoria": TMP.team.name = "Calcio Cagliari";
                    break;
                case "Cagliari": TMP.team.name = "Calcio Cagliari";
                    break;
                case "Benevento": TMP.team.name = "Calcio Benevento";
                    break;
                case "Parma": TMP.team.name = "Calcio Parma";
                    break;
                case "Chievo": TMP.team.name = "Calcio Chievo";
                    break;
                case "AC Carpi": TMP.team.name = "Calcio Carpi";
                    break;
                case "Frosinone": TMP.team.name = "Calcio Frosinone";
                    break;
                case "Pescara": TMP.team.name = "Delfino Pescara";
                    break;
                case "Brescia": TMP.team.name = "Calcio Brescia";
                    break;
                case "Dortmund": TMP.team.name = "Borussia Dortmund";
                    break;
                case "RB Leipzig": TMP.team.name = "RasenBallsport Leipzig";
                    break;
                case "B. Monchengladbach": TMP.team.name = "Borussia Mönchengladbach";
                    break;
                case "FC Koln": TMP.team.name = "Köln";
                    break;
                case "Greuther Furth": TMP.team.name = "Greuther Fürth";
                    break;
                case "Hamburger SV": TMP.team.name = "Hamburger Sport-Verein";
                    break;
                case "Darmstadt": TMP.team.name = "Darmstadt Sport-Verein";
                    break;
                case "Hannover": TMP.team.name = "Hannover Sport-Verein";
                    break;
                case "Dusseldorf": TMP.team.name = "Fortuna Düsseldorf";
                    break;
                case "Nurnberg": TMP.team.name = "Nürnberg";
                    break;
                case "Atl. Madrid": TMP.team.name = "Atlético Madrid";
                    break;
                case "Betis": TMP.team.name = "Real Betis";
                    break;
                case "Granada CF": TMP.team.name = "Granada";
                    break;
                case "Ath Bilbao": TMP.team.name = "Athletic Bilbao";
                    break;
                case "Cadiz CF": TMP.team.name = "Cádiz";
                    break;
                case "Alaves": TMP.team.name = "Deportivo Alavés";
                    break;
                case "Almeria": TMP.team.name = "Almería";
                    break;
                case "Malaga": TMP.team.name = "Málaga";
                    break;
                case "Dep. La Coruna": TMP.team.name = "Deportivo La Coruña";
                    break;
                case "Gijon": TMP.team.name = "Gijón";
                    break;
                case "Leganes": TMP.team.name = "Leganés";
                    break;
                case "Paris SG": TMP.team.name = "Paris Saint-Germain";
                    break;
                case "Marseille": TMP.team.name = "Olympique Marseille";
                    break;
                case "Lens": TMP.team.name = "Racing Lens";
                    break;
                case "Rennes": TMP.team.name = "Stade Rennais";
                    break;
                case "Lille": TMP.team.name = "Olympique Lille";
                    break;
                case "Nice": TMP.team.name = "Olympique Nice";
                    break;
                case "Reims": TMP.team.name = "Stade Reims";
                    break;
                case "Lyon": TMP.team.name = "Olympique Lyonnais";
                    break;
                case "Strasbourg": TMP.team.name = "Racing Strasbourg";
                    break;
                case "Brest": TMP.team.name = "Stade Brestois";
                    break;
                case "AC Ajaccio": TMP.team.name = "Athletic Ajaccien";
                    break;
                case "Angers": TMP.team.name = "Sporting Angers";
                    break;
                case "St Etienne": TMP.team.name = "Saint-Étienne Loire";
                    break;
                case "Bordeaux": TMP.team.name = "Girondins Bordeaux";
                    break;
                case "Nimes": TMP.team.name = "Olympique Nîmes";
                    break;
                case "Caen": TMP.team.name = "Stade Malherbe Caen";
                    break;
                case "Bastia": TMP.team.name = "Sporting Bastia";
                    break;
                case "GFC Ajaccio": TMP.team.name = "Gazélec Ajaccio";
                    break;
                case "Nancy": TMP.team.name = "Nancy Lorraine";
                    break;
                case "Amiens": TMP.team.name = "Sporting Amiens";
                    break;
                case "Manchester Utd": TMP.team.name = "Manchester United";
                    break;
                case "Tottenham": TMP.team.name = "Tottenham Hotspur";
                    break;
                case "Newcastle": TMP.team.name = "Newcastle United";
                    break;
                case "Wolves": TMP.team.name = "Wolverhampton Wanderers";
                    break;
                case "Leeds": TMP.team.name = "Leeds United";
                    break;
                case "Nottingham": TMP.team.name = "Nottingham Forest";
                    break;
                case "Leicester": TMP.team.name = "Leicester City";
                    break;
                case "West Ham": TMP.team.name = "West Ham United";
                    break;
                case "Bournemouth": TMP.team.name = "Athletic Bournemouth";
                    break;
                case "West Brom": TMP.team.name = "West Bromwich";
                    break;
                case "Sheffield Utd": TMP.team.name = "Sheffield United";
                    break;
                case "Norwich": TMP.team.name = "Norwich City";
                    break;
                case "Stoke": TMP.team.name = "Stoke City";
                    break;
                case "Hull": TMP.team.name = "Hull City";
                    break;
                case "Cardiff": TMP.team.name = "Cardiff City";
                    break;
                case "Swansea": TMP.team.name = "Swansea City";
                    break;
            }
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
                    TMP.form = element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText;
                } else if (dump > 2) {
                    TMP.form = TMP.form.concat(",", element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText);
                } else {
                    TMP.form = "-";
                }
            });
            JSON.standings.push(TMP);
        });
        return JSON;
    });

    switch (RESULT.name) {
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standingsLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standingsBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standingsSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standingsLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standings/standingsPremierLeague" + RESULT.yearStart + "Flashcore.json");
            break;
    }
    FS.writeFile(fileLocation, JSON.stringify(RESULT), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}

// // // // // // // // // // DELAY STANDINGS // // // // // // // // // //
async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

// // // // // // // // // // FUNCTION CALL // // // // // // // // // //
getStandings2023(URLS.england_2023);
getStandings2023(URLS.spain_2023);
getStandings2023(URLS.france_2023);
getStandings2023(URLS.italy_2023);
getStandings2023(URLS.germany_2023);