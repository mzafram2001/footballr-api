const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "https://www.flashscore.com/football/england/premier-league/fixtures",
}

const SCHEDULED_URLS = {
    ENGLAND: URLS.england,
};

async function getSchedules(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });   
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
    await PAGE.waitForSelector('.event__more', { visible: true });
    await PAGE.evaluate(() => {
        document.querySelector('.event__more').click();
    });
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
        var round = 0;
        for (var i = MATCHES_SELECTOR.length - 1; i >= 0; i--) {
            const TMP2 = {};
            TMP2.id = MATCHES_SELECTOR[i].id.substring(4);
            TMP2.link = "https://www.flashscore.com/match/" + TMP2.id;
            JSON.matchesIteration.push(TMP2);
        }
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
                case "Manchester Utd": TMP.homeTeam.name = "Manchester United";
                    break;
                case "Tottenham": TMP.homeTeam.name = "Tottenham Hotspur";
                    break;
                case "Newcastle": TMP.homeTeam.name = "Newcastle United";
                    break;
                case "Wolves": TMP.homeTeam.name = "Wolverhampton Wanderers";
                    break;
                case "Leeds": TMP.homeTeam.name = "Leeds United";
                    break;
                case "Nottingham": TMP.homeTeam.name = "Nottingham Forest";
                    break;
                case "Leicester": TMP.homeTeam.name = "Leicester City";
                    break;
                case "West Ham": TMP.homeTeam.name = "West Ham United";
                    break;
                case "Bournemouth": TMP.homeTeam.name = "Athletic Bournemouth";
                    break;
                case "West Brom": TMP.homeTeam.name = "West Bromwich";
                    break;
                case "Sheffield Utd": TMP.homeTeam.name = "Sheffield United";
                    break;
                case "Norwich": TMP.homeTeam.name = "Norwich City";
                    break;
                case "Stoke": TMP.homeTeam.name = "Stoke City";
                    break;
                case "Hull": TMP.homeTeam.name = "Hull City";
                    break;
                case "Cardiff": TMP.homeTeam.name = "Cardiff City";
                    break;
                case "Swansea": TMP.homeTeam.name = "Swansea City";
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
                case "Manchester Utd": TMP.awayTeam.name = "Manchester United";
                    break;
                case "Tottenham": TMP.awayTeam.name = "Tottenham Hotspur";
                    break;
                case "Newcastle": TMP.awayTeam.name = "Newcastle United";
                    break;
                case "Wolves": TMP.awayTeam.name = "Wolverhampton Wanderers";
                    break;
                case "Leeds": TMP.awayTeam.name = "Leeds United";
                    break;
                case "Nottingham": TMP.awayTeam.name = "Nottingham Forest";
                    break;
                case "Leicester": TMP.awayTeam.name = "Leicester City";
                    break;
                case "West Ham": TMP.awayTeam.name = "West Ham United";
                    break;
                case "Bournemouth": TMP.awayTeam.name = "Athletic Bournemouth";
                    break;
                case "West Brom": TMP.awayTeam.name = "West Bromwich";
                    break;
                case "Sheffield Utd": TMP.awayTeam.name = "Sheffield United";
                    break;
                case "Norwich": TMP.awayTeam.name = "Norwich City";
                    break;
                case "Stoke": TMP.awayTeam.name = "Stoke City";
                    break;
                case "Hull": TMP.awayTeam.name = "Hull City";
                    break;
                case "Cardiff": TMP.awayTeam.name = "Cardiff City";
                    break;
                case "Swansea": TMP.awayTeam.name = "Swansea City";
                    break;
            }
            TMP.awayTeam.shorthand = title.innerText.substring(8, 11);
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
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/schedules/schedulesPremierLeague" + RESULT.yearStart + "Flashcore.json");
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

getSchedules(SCHEDULED_URLS.ENGLAND);