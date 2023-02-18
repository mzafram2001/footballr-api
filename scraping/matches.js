const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    spain_matches_2015: "https://www.flashscore.com/football/spain/laliga-2015-2016/results/",
    spain_matches_2016: "https://www.flashscore.com/football/spain/laliga-2016-2017/results/",
    spain_matches_2017: "https://www.flashscore.com/football/spain/laliga-2017-2018/results/",
    spain_matches_2018: "https://www.flashscore.com/football/spain/laliga-2018-2019/results/",
    spain_matches_2019: "https://www.flashscore.com/football/spain/laliga-2019-2020/results/",
    spain_matches_2020: "https://www.flashscore.com/football/spain/laliga-2020-2021/results/",
    spain_matches_2021: "https://www.flashscore.com/football/spain/laliga-2021-2022/results/",
    spain_matches_2022: "https://www.flashscore.com/football/spain/laliga/results/",
}

// // // // // // // // // // CODE MATCHES // // // // // // // // // //
async function getMatches(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "domcontentloaded" });
    // // // // // REPETIR EL SIGUIENTE CODIGO TANTAS VECES COMO BOTON DE MOSTRAR MÁS PARTIDOS HAYA
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
            case "Primera Division": JSON.area = "ESP";
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
            TMP.homeTeam.shorthand = title.innerText.substring(0, 3);
            TMP.homeTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/" + TMP.homeTeam.id + "_logo.png";
            TMP.homeTeam.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/" + TMP.homeTeam.id + "_kit.png";
            TMP.homeTeam.lineup = [];

            TMP.awayTeam = {};
            dumpString = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow > a').getAttribute('href');
            dumpStringArray = dumpString.split('/');
            TMP.awayTeam.id = dumpStringArray[3];
            TMP.awayTeam.name = document.querySelector('#detail > div.duelParticipant > div.duelParticipant__away > div.participant__participantNameWrapper > div.participant__participantName.participant__overflow').innerText;
            TMP.awayTeam.shorthand = title.innerText.substring(8, 11);
            TMP.awayTeam.logo = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/logos/" + TMP.awayTeam.id + "_logo.png";
            TMP.awayTeam.kit = "https://raw.githubusercontent.com/mzafram2001/zeus-src/main/static/kits/" + TMP.awayTeam.id + "_kit.png";
            TMP.awayTeam.lineup = [];

            TMP.round = parseInt(document.querySelector('#detail > div.tournamentHeader.tournamentHeaderDescription > div > span.tournamentHeader__country > a').innerText.substring(15));
            TMP.date = document.querySelector('.duelParticipant__startTime').innerText.substring(0, 10);
            TMP.hour = document.querySelector('.duelParticipant__startTime').innerText.substring(11);
            TMP.home = document.querySelector('.duelParticipant__home').innerText;
            TMP.away = document.querySelector('.duelParticipant__away').innerText;
            TMP.homeGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(1)').innerText);
            TMP.awayGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(3)').innerText);
            TMP.status = document.querySelector('.fixedHeaderDuel__detailStatus').innerText;

            TMP.stats = [];

            TMP.summary = [];
            var events = document.querySelectorAll('.smv__participantRow');
            events.forEach(element => {
                const TMP2 = {};
                var eventIcon = element.querySelector('svg').getAttribute('class');
                if (element.getAttribute('class') == 'smv__participantRow smv__homeParticipant') {
                    TMP2.actionTeam = "Home";
                    switch (eventIcon) {
                        case "card-ico yellowCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "soccer ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Goal";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            var hasAssist = element.querySelectorAll('div > div.smv__assist > a');
                            if (hasAssist.length > 0) {
                                dumpString = element.querySelector('div > div.smv__assist > a').getAttribute('href');
                                dumpStringArray = dumpString.split('/');
                                dumpStringArraySecondary = dumpStringArray[2].split('-');
                                lastName = dumpStringArraySecondary[0];
                                firstName = dumpStringArraySecondary[1];
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "soccer footballOwnGoal-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Own Goal";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "substitution ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Substitution";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            dumpString = element.querySelector('div > div.smv__incidentSubOut > a').getAttribute('href');
                            dumpStringArray = dumpString.split('/');
                            dumpStringArraySecondary = dumpStringArray[2].split('-');
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                            TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "card-ico ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card > Red Card";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "card-ico redCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Red Card";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "var ":
                            /*var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];*/
                            TMP2.type = "VAR > Goal Disallowed";
                            // TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                    }
                    TMP2.minute = element.querySelector('.smv__timeBox').innerText;
                } else if (element.getAttribute('class') == 'smv__participantRow smv__awayParticipant') {
                    TMP2.actionTeam = "Away";
                    switch (eventIcon) {
                        case "card-ico yellowCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "soccer ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Goal";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            var hasAssist = element.querySelectorAll('div > div.smv__assist > a');
                            if (hasAssist.length > 0) {
                                dumpString = element.querySelector('div > div.smv__assist > a').getAttribute('href');
                                dumpStringArray = dumpString.split('/');
                                dumpStringArraySecondary = dumpStringArray[2].split('-');
                                lastName = dumpStringArraySecondary[0];
                                firstName = dumpStringArraySecondary[1];
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "soccer footballOwnGoal-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Own Goal";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "substitution ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Substitution";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1)
                            dumpString = element.querySelector('div > div.smv__incidentSubOut > a').getAttribute('href');
                            dumpStringArray = dumpString.split('/');
                            dumpStringArraySecondary = dumpStringArray[2].split('-');
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                            TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "card-ico ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card > Red Card";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "card-ico redCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Red Card";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                        case "var ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "VAR";
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            break;
                    }
                    TMP2.minute = element.querySelector('.smv__timeBox').innerText;
                }
                TMP.summary.push(TMP2);
            });

            TMP.stadium = document.querySelector('#detail > div.section > div.mi__data > div:nth-child(2) > span.mi__item__val').innerText;
            TMP.attendance = parseInt(document.querySelector('#detail > div.section > div.mi__data > div:nth-child(3) > span.mi__item__val').innerText.replace(/\s/g, ''));
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
        match.stats = MATCH.stats;
        match.summary = MATCH.summary;
        match.stadium = MATCH.stadium;
        match.attendance = MATCH.attendance;
    }

    for (let match of RESULT.matchesIteration) {
        await PAGE.goto(match.link + "/#/match-summary/match-statistics/0", { 'waitUntil': 'networkidle0' });
        console.log(match.link + "/#/match-summary/match-statistics/0");
        const MATCH_STATS = await PAGE.evaluate(() => {
            const TMP = {};
            const STAT_ROWS = document.querySelectorAll('.stat__row');
            STAT_ROWS.forEach(element => {
                categoryName = element.querySelector('.stat__categoryName').innerText;
                switch (categoryName) {
                    case "Ball Possession":
                        TMP.ballPossessionHome = element.querySelector('.stat__homeValue').innerText;
                        TMP.ballPossessionAway = element.querySelector('.stat__awayValue').innerText;
                        break;
                    case "Goal Attempts":
                        TMP.goalAttemptsHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.goalAttemptsAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Shots on Goal":
                        TMP.shotsOnGoalHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.shotsOnGoalaway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Shots off Goal":
                        TMP.shotsOffGoalHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.shotsOffGoalAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Blocked Shots":
                        TMP.blockedShotsHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.blockedShotsAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Free Kicks":
                        TMP.freeKicksHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.freeKicksAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Corner Kicks":
                        TMP.cornerKicksHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.cornerKicksAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Offsides":
                        TMP.offsidesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.offsidesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Throw-in":
                        TMP.throwInHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.throwInAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Goalkeeper Saves":
                        TMP.goalKeeperSavesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.goalKeeperSavesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Fouls":
                        TMP.foulsHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.foulsAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Yellow Cards":
                        TMP.yellowCardsHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.yellowCardsAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Red Cards":
                        TMP.redCardsHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.redCardsAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Total Passes":
                        TMP.totalPassesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.totalPassesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Completed Passes":
                        TMP.completedPassesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.completedPassesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Tackles":
                        TMP.tacklesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.tacklesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Attacks":
                        TMP.attacksHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.attacksAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Dangerous Attacks":
                        TMP.dangerousAttacksHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.dangerousAttacksAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                }
            })

            return TMP;
        });
        match.stats = MATCH_STATS;
    }

    for (var i = 0; i <= RESULT.matchesIteration.length - 1; i++) {
        var pushIt = false;
        var j = 0;
        while (j <= RESULT.season.length && pushIt == false) {
            if (RESULT.matchesIteration[i].round == RESULT.season[j].round) {
                RESULT.season[j].matches.push(RESULT.matchesIteration[i]);
                pushIt = true;
            }
            j++
        }
    }

    delete RESULT.matchesIteration;

    switch (RESULT.name) {
        case "LaLiga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matches/matchesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Primera Division": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matches/matchesLaLiga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Bundesliga": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matches/matchesBundesliga" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Serie A": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matches/matchesSerieA" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Ligue 1": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matches/matchesLigue1" + RESULT.yearStart + "Flashcore.json");
            break;
        case "Premier League": var fileLocation = PATH.join(process.cwd(), "./db/" + RESULT.yearStart + "/matches/matchesPremierLeague" + RESULT.yearStart + "Flashcore.json");
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
getMatches(URLS.spain_matches_2016);