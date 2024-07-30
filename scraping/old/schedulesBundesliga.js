const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    germany: "https://www.flashscore.com/football/germany/bundesliga/fixtures",
}

const SCHEDULED_URLS = {
    GERMANY: URLS.germany,
};

async function getSchedules(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    await delay(4000);
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
        JSON.season = [];
        JSON.matchesIteration = [];
        const ROUNDS_SELECTOR = document.querySelectorAll('.event__round');
        const MATCHES_SELECTOR = document.querySelectorAll('.event__match');
        const REVERSE_ROUNDS_SELECTOR = Array.prototype.slice.call(ROUNDS_SELECTOR).reverse();
        var REVERSE_MATCHES_SELECTOR = Array.prototype.slice.call(MATCHES_SELECTOR).reverse();
        var round = 0;
        for (var i = REVERSE_MATCHES_SELECTOR.length - 1; i >= 0; i--) {
            const TMP2 = {};
            TMP2.id = REVERSE_MATCHES_SELECTOR[i].id.substring(4);
            TMP2.link = "https://www.flashscore.com/match/" + TMP2.id;
            JSON.matchesIteration.push(TMP2);
        }
        for (var i = REVERSE_ROUNDS_SELECTOR.length - 1; i >= 0; i--) {
            const TMP = {};
            var found = false;
            TMP.round = parseInt(REVERSE_ROUNDS_SELECTOR[i].innerText.substring(6));
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
        await PAGE.goto(match.link, { 'waitUntil': 'networkidle0' });
        console.log(match.link);
        const MATCH = await PAGE.evaluate(() => {
            const TMP = {};
            var dumpString;
            var dumpStringArray;
            var title = document.evaluate("/html/head/title", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            TMP.homeTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.homeTeam.id = dumpStringArray[3];
            TMP.homeTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__home > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            switch (TMP.homeTeam.name) {
                case "Dortmund": TMP.homeTeam.name = "Borussia Dortmund";
                    break;
                case "RB Leipzig": TMP.homeTeam.name = "RasenBallsport Leipzig";
                    break;
                case "B. Monchengladbach": TMP.homeTeam.name = "Borussia Mönchengladbach";
                    break;
                case "FC Koln": TMP.homeTeam.name = "Köln";
                    break;
                case "Greuther Furth": TMP.homeTeam.name = "Greuther Fürth";
                    break;
                case "Hamburger SV": TMP.homeTeam.name = "Hamburger Sport-Verein";
                    break;
                case "Darmstadt": TMP.homeTeam.name = "Darmstadt Sport-Verein";
                    break;
                case "Hannover": TMP.homeTeam.name = "Hannover Sport-Verein";
                    break;
                case "Dusseldorf": TMP.homeTeam.name = "Fortuna Düsseldorf";
                    break;
                case "Nurnberg": TMP.homeTeam.name = "Nürnberg";
                    break;
            }
            TMP.homeTeam.shorthand = title.innerText.substring(0, 3);
            TMP.homeTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.homeTeam.id + ".svg";
            TMP.awayTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.awayTeam.id = dumpStringArray[3];
            TMP.awayTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            switch (TMP.awayTeam.name) {
                case "Dortmund": TMP.awayTeam.name = "Borussia Dortmund";
                    break;
                case "RB Leipzig": TMP.awayTeam.name = "RasenBallsport Leipzig";
                    break;
                case "B. Monchengladbach": TMP.awayTeam.name = "Borussia Mönchengladbach";
                    break;
                case "FC Koln": TMP.awayTeam.name = "Köln";
                    break;
                case "Greuther Furth": TMP.awayTeam.name = "Greuther Fürth";
                    break;
                case "Hamburger SV": TMP.awayTeam.name = "Hamburger Sport-Verein";
                    break;
                case "Darmstadt": TMP.awayTeam.name = "Darmstadt Sport-Verein";
                    break;
                case "Hannover": TMP.awayTeam.name = "Hannover Sport-Verein";
                    break;
                case "Dusseldorf": TMP.awayTeam.name = "Fortuna Düsseldorf";
                    break;
                case "Nurnberg": TMP.awayTeam.name = "Nürnberg";
                    break;
            }
            TMP.awayTeam.shorthand = title.innerText.substring(6, 9);
            TMP.awayTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/teams/" + TMP.awayTeam.id + ".svg";
            dumpString = document.querySelector('#detail > div.tournamentHeader.tournamentHeaderDescription > div > span.tournamentHeader__country > a').innerText;
            dumpStringArray = dumpString.split(" ");
            TMP.round = parseInt(dumpStringArray[dumpStringArray.length - 1]);
            if (TMP.round == null) {
                TMP.round = "Relegation Play-Offs";
            }
            TMP.date = document.querySelector('.duelParticipant__startTime').innerText.substring(0, 10);
            TMP.hour = document.querySelector('.duelParticipant__startTime').innerText.substring(11);
            TMP.home = document.querySelector('.duelParticipant__home').innerText;
            TMP.away = document.querySelector('.duelParticipant__away').innerText;
            return TMP;
        });
        match.round = MATCH.round;
        match.date = MATCH.date;
        match.hour = MATCH.hour;
        match.homeTeam = MATCH.homeTeam;
        match.awayTeam = MATCH.awayTeam;
        match.status = "SCHEDULED";
    }

    for (var i = 0; i <= RESULT.matchesIteration.length - 1; i++) {
        var pushIt = false;
        var j = 0;
        while (j <= RESULT.season.length - 1 && pushIt == false) {
            if (RESULT.matchesIteration[i].round == RESULT.season[j].round) {
                RESULT.season[j].matches.push(RESULT.matchesIteration[i]);
                delete RESULT.matchesIteration[i].link;
                pushIt = true;
            }
            j++;
        }
    }

    delete RESULT.matchesIteration;

    switch (RESULT.name) {
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/fixtures/fixturesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/fixtures/fixturesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/fixtures/fixturesBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/fixtures/fixturesSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/fixtures/fixturesLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/fixtures/fixturesPremierLeague" + RESULT.yearStart + "Flashcore.json");
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

async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

getSchedules(SCHEDULED_URLS.GERMANY);