const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');
const { match } = require('assert');

// TODO: 
// - Organizar código

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    england_2015: "https://www.flashscore.com/football/england/premier-league-2015-2016/standings/",
    england_2016: "https://www.flashscore.com/football/england/premier-league-2016-2017/standings/",
    england_2017: "https://www.flashscore.com/football/england/premier-league-2017-2018/standings/",
    england_2018: "https://www.flashscore.com/football/england/premier-league-2018-2019/standings/",
    england_2019: "https://www.flashscore.com/football/england/premier-league-2019-2020/standings/",
    england_2020: "https://www.flashscore.com/football/england/premier-league-2020-2021/standings/",
    england_2021: "https://www.flashscore.com/football/england/premier-league-2021-2022/standings/",
    england_2022: "https://www.flashscore.com/football/england/premier-league/standings/",

    spain_2015: "https://www.flashscore.com/football/spain/laliga-2015-2016/standings",
    spain_2016: "https://www.flashscore.com/football/spain/laliga-2016-2017/standings",
    spain_2017: "https://www.flashscore.com/football/spain/laliga-2017-2018/standings",
    spain_2018: "https://www.flashscore.com/football/spain/laliga-2018-2019/standings",
    spain_2019: "https://www.flashscore.com/football/spain/laliga-2019-2020/standings",
    spain_2020: "https://www.flashscore.com/football/spain/laliga-2020-2021/standings",
    spain_2021: "https://www.flashscore.com/football/spain/laliga-2021-2022/standings",
    spain_2022: "https://www.flashscore.com/football/spain/laliga/standings/",

    france_2015: "https://www.flashscore.com/football/france/ligue-1-2015-2016/standings",
    france_2016: "https://www.flashscore.com/football/france/ligue-1-2016-2017/standings",
    france_2017: "https://www.flashscore.com/football/france/ligue-1-2017-2018/standings",
    france_2018: "https://www.flashscore.com/football/france/ligue-1-2018-2019/standings",
    france_2019: "https://www.flashscore.com/football/france/ligue-1-2019-2020/standings",
    france_2020: "https://www.flashscore.com/football/france/ligue-1-2020-2021/standings",
    france_2021: "https://www.flashscore.com/football/france/ligue-1-2021-2022/standings",
    france_2022: "https://www.flashscore.com/football/france/ligue-1/standings/",

    italy_2015: "https://www.flashscore.com/football/italy/serie-a-2015-2016/standings",
    italy_2016: "https://www.flashscore.com/football/italy/serie-a-2016-2017/standings",
    italy_2017: "https://www.flashscore.com/football/italy/serie-a-2017-2018/standings",
    italy_2018: "https://www.flashscore.com/football/italy/serie-a-2018-2019/standings",
    italy_2019: "https://www.flashscore.com/football/italy/serie-a-2019-2020/standings",
    italy_2020: "https://www.flashscore.com/football/italy/serie-a-2020-2021/standings",
    italy_2021: "https://www.flashscore.com/football/italy/serie-a-2021-2022/standings",
    italy_2022: "https://www.flashscore.com/football/italy/serie-a/standings/",

    germany_2015: "https://www.flashscore.com/football/germany/bundesliga-2015-2016/standings",
    germany_2016: "https://www.flashscore.com/football/germany/bundesliga-2016-2017/standings",
    germany_2017: "https://www.flashscore.com/football/germany/bundesliga-2017-2018/standings",
    germany_2018: "https://www.flashscore.com/football/germany/bundesliga-2018-2019/standings",
    germany_2019: "https://www.flashscore.com/football/germany/bundesliga-2019-2020/standings",
    germany_2020: "https://www.flashscore.com/football/germany/bundesliga-2020-2021/standings",
    germany_2021: "https://www.flashscore.com/football/germany/bundesliga-2021-2022/standings",
    germany_2022: "https://www.flashscore.com/football/germany/bundesliga/standings/",

    spain_matches_2021: "https://www.flashscore.com/football/spain/laliga-2021-2022/results/",
    spain_matches_2022: "https://www.flashscore.com/football/spain/laliga/results/",
};

// // // // // // // // // // DELAY STANDINGS // // // // // // // // // //
async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

// // // // // // // // // // CODE STANDINGS // // // // // // // // // //
async function getStandings(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "domcontentloaded" });
    await PAGE.waitForSelector('.ui-table__body', { visible: true });
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
        console.log(ROWS);
        ROWS.forEach(element => {
            numRow++;
            const TMP = {};
            element.querySelectorAll('.table__cell--value').innerText;
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
            TMP.team.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/" + TMP.team.id + "_logo.png";
            TMP.team.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/" + TMP.team.id + "_kit.png";
            TMP.playedGames = parseInt(element.querySelector('.table__cell--value').innerText);
            TMP.wins = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(4)').innerText);
            TMP.draws = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(5)').innerText);
            TMP.loses = parseInt(document.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > span:nth-child(6)').innerText);
            if (parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 3)) >= 100) {
                TMP.goalsFor = parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 3));
                TMP.goalsAgainst = parseInt(element.querySelector('.table__cell--score').innerText.substring(4, 6));
            } else {
                TMP.goalsFor = parseInt(element.querySelector('.table__cell--score').innerText.substring(0, 2));
                TMP.goalsAgainst = parseInt(element.querySelector('.table__cell--score').innerText.substring(3, 5));
            }
            TMP.goalDifference = parseInt(TMP.goalsFor) - parseInt(TMP.goalsAgainst);
            TMP.points = parseInt(element.querySelector('.table__cell--points').innerText);
            for (var i = 2; i < 7; i++) {
                if (i == 2) {
                    TMP.form = element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText;
                } else {
                    TMP.form = TMP.form.concat(",", element.querySelector('#tournament-table-tabs-and-content > div:nth-child(3) > div:nth-child(1) > div > div > div.ui-table__body > div:nth-child(' + numRow + ') > div.table__cell.table__cell--form > div:nth-child(' + i + ') > div').innerText);
                }
            }
            JSON.standings.push(TMP);
        });
        return JSON;
    });
    switch (RESULT.name) {
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/standingsPremierLeague" + RESULT.yearStart + "Flashcore.json");
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

// // // // // // // // // // CODE MATCHES // // // // // // // // // //
async function getMatches(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "domcontentloaded" });
    // REPETIR EL SIGUIENTE CODIGO TANTAS VECES COMO BOTON DE MOSTRAR MÁS PARTIDOS HAYA
    await PAGE.waitForSelector('.event__more', { visible: true });
    await PAGE.evaluate(() => {
        document.querySelector('.event__more').click();
    });
    await delay(4000);
    await PAGE.waitForSelector('.event__more', { visible: true });
    await PAGE.evaluate(() => {
        document.querySelector('.event__more').click();
    });
    await delay(4000);
    /////////////////////////////////////////////////////////////////////////////////////

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
        };
        JSON.yearStart = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearStart = parseInt(JSON.yearStart.substring(0, 4));
        JSON.yearEnd = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__info').innerText;
        JSON.yearEnd = parseInt(JSON.yearEnd.substring(5, JSON.yearStart - 1));
        JSON.season = [];
        JSON.matchesIteration = [];
        const ROUNDS_SELECTOR = document.querySelectorAll('.event__round');
        const MATCHES_SELECTOR = document.querySelectorAll('.event__match');
        var round = 0;
        // Creo un array de objetos con todos los partidos
        for (var i = MATCHES_SELECTOR.length - 1; i >= 0; i--) {
            const TMP2 = {};
            TMP2.id = MATCHES_SELECTOR[i].id.substring(4);
            TMP2.link = "https://www.flashscore.com/match/" + TMP2.id;
            JSON.matchesIteration.push(TMP2);
        }
        // Meto en el JSON todas las rounds sin repetirlas
        for (var i = ROUNDS_SELECTOR.length - 1; i >= 0; i--) {
            const TMP = {};
            var found = false;
            TMP.round = parseInt(ROUNDS_SELECTOR[i].innerText.substring(6));
            round = parseInt(TMP.round);
            TMP.matches = [];
            for (index in JSON.season) {
                if (JSON.season[index].round == TMP.round) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                JSON.season.push(TMP);
            }
        }
        return JSON;
    });

    for (let match of RESULT.matchesIteration) {
        await PAGE.goto(match.link);
        console.log(match.link);
        delay(5000);

        const MATCH = await PAGE.evaluate(() => {
            const TMP = {};
            var dumpString;
            var dumpStringArray;

            TMP.homeTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.homeTeam.id = dumpStringArray[3];
            TMP.homeTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            TMP.homeTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/" + TMP.homeTeam.id + "_logo.png";
            TMP.homeTeam.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/" + TMP.homeTeam.id + "_kit.png";

            TMP.awayTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.awayTeam.id = dumpStringArray[3];
            TMP.awayTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            
            TMP.awayTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/" + TMP.awayTeam.id + "_logo.png";
            TMP.awayTeam.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/" + TMP.awayTeam.id + "_kit.png";

            TMP.homeTeam.short = window.title.substring(0,3);
            TMP.awayTeam.short = window.title.substring(8,11);
            
            /*window.addEventListener('DOMContentLoaded', () => {
                TMP.homeTeam.short = document.querySelector('head > title').substring(0,3);
                TMP.awayTeam.short = document.querySelector('head > title').substring(8,11);
            });*/

            TMP.round = parseInt(document.querySelector('#detail > div.tournamentHeader.tournamentHeaderDescription > div > span.tournamentHeader__country > a').innerText.substring(15));
            TMP.date = document.querySelector('.duelParticipant__startTime').innerText.substring(0, 10);
            TMP.hour = document.querySelector('.duelParticipant__startTime').innerText.substring(11);
            TMP.home = document.querySelector('.duelParticipant__home').innerText;
            TMP.away = document.querySelector('.duelParticipant__away').innerText;
            TMP.homeGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(1)').innerText);
            TMP.awayGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(3)').innerText);
            TMP.status = document.querySelector('.fixedHeaderDuel__detailStatus').innerText;
            return TMP;
        });
        match.round = MATCH.round;
        match.date = MATCH.date;
        match.hour = MATCH.hour;
        match.homeTeam = MATCH.homeTeam;
        match.awayTeam = MATCH.awayTeam;
        match.homeGoals = MATCH.homeGoals;
        match.awayGoals = MATCH.awayGoals;
        match.status = MATCH.status;
    }

    switch (RESULT.name) {
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" /*+ RESULT.yearStart + */ + "/matchesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matchesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matchesBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matchesSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matchesLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matchesPremierLeague" + RESULT.yearStart + "Flashcore.json");
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
// // // // // // // // // // FUNCTION CALL // // // // // // // // // //
getStandings(URLS.england_2022);
getStandings(URLS.spain_2022);
getStandings(URLS.france_2022);
getStandings(URLS.italy_2022);
getStandings(URLS.germany_2022);

getMatches(URLS.spain_matches_2022);
