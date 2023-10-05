const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "https://www.flashscore.com/football/england/premier-league/results/",
}

const MATCHES_URLS = {
    ENGLAND: URLS.england,
};

async function getLast10Matches(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    var fileLocation = PATH.join(process.cwd(), "./db/2023/matches/matchesPremierLeague2023Flashcore.json");
    var original = require(fileLocation);
    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.season = [];
        JSON.matchesIteration = [];
        const ROUNDS_SELECTOR = document.querySelectorAll('.event__round');
        const MATCHES_SELECTOR = document.querySelectorAll('.event__match');
        var round = 0;
        var ok = Array.prototype.slice.call(MATCHES_SELECTOR);
        const LAST_10 = ok.slice(0, 10);
        ok = Array.prototype.slice.call(ROUNDS_SELECTOR);
        const ROUNDS_ARRAY = ok;
        for (var i = LAST_10.length - 1; i >= 0; i--) {
            const TMP = {};
            TMP.id = LAST_10[i].id.substring(4);
            TMP.link = "https://www.flashscore.com/match/" + TMP.id;
            JSON.matchesIteration.push(TMP);
        }
        for (var i = ROUNDS_ARRAY.length - 1; i >= 0; i--) {
            const TMP = {};
            var found = false;
            TMP.round = parseInt(ROUNDS_ARRAY[i].innerText.substring(6));
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

    console.log(RESULT.season);
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
            TMP.homeTeam.lineup = [];
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
            TMP.awayTeam.lineup = [];
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
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "soccer ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            var hasAssist = element.querySelectorAll('div > div.smv__assist > a');
                            if (hasAssist.length > 0) {
                                dumpString = element.querySelector('div > div.smv__assist > a').getAttribute('href');
                                dumpStringArray = dumpString.split('/');
                                dumpStringArraySecondary = dumpStringArray[2].split('-');
                                lastName = dumpStringArraySecondary[0];
                                firstName = dumpStringArraySecondary[1];
                                if (firstName == undefined) {
                                    TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                } else if (lastName == undefined) {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                                } else {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                }
                            }
                            break;
                        case "soccer footballOwnGoal-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Own Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "substitution ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Substitution";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            dumpString = element.querySelector('div > div.smv__incidentSubOut > a').getAttribute('href');
                            dumpStringArray = dumpString.split('/');
                            dumpStringArraySecondary = dumpStringArray[2].split('-');
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                            if (firstName == undefined) {
                                TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card > Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico redCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "var ":
                            TMP2.type = "VAR > Goal Disallowed";
                            break;
                        case "warning ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Penalty Missed";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                        default:
                            TMP2.type = "-";
                            TMP2.player = "-";
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
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "soccer ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            var hasAssist = element.querySelectorAll('div > div.smv__assist > a');
                            if (hasAssist.length > 0) {
                                dumpString = element.querySelector('div > div.smv__assist > a').getAttribute('href');
                                dumpStringArray = dumpString.split('/');
                                dumpStringArraySecondary = dumpStringArray[2].split('-');
                                lastName = dumpStringArraySecondary[0];
                                firstName = dumpStringArraySecondary[1];
                                if (firstName == undefined) {
                                    TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                } else if (lastName == undefined) {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                                } else {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                }
                            }
                            break;
                        case "soccer footballOwnGoal-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Own Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "substitution ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Substitution";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            dumpString = element.querySelector('div > div.smv__incidentSubOut > a').getAttribute('href');
                            dumpStringArray = dumpString.split('/');
                            dumpStringArraySecondary = dumpStringArray[2].split('-');
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                            if (firstName == undefined) {
                                TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card > Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico redCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "var ":
                            TMP2.type = "VAR > Goal Disallowed";
                            break;
                        case "warning ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Penalty Missed";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                        default:
                            TMP2.type = "-";
                            TMP2.player = "-";
                            break;
                    }
                    TMP2.minute = element.querySelector('.smv__timeBox').innerText;
                }
                TMP.summary.push(TMP2);
            });
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
    }

    for (let match of RESULT.matchesIteration) {
        await PAGE.goto(match.link + "/#/match-summary/match-statistics/0", { 'waitUntil': 'networkidle0' });
        console.log(match.link + "/#/match-summary/match-statistics/0");
        await delay(2000);
        const MATCH_STATS = await PAGE.evaluate(() => {
            const TMP = {};
            const STAT_ROWS = document.querySelectorAll('._row_1gfjz_9');
            STAT_ROWS.forEach(element => {
                categoryName = element.querySelector('._categoryName_11si3_5').innerText;
                switch (categoryName) {
                    case "Ball Possession":
                        TMP.ballPossessionHome = element.querySelector('._homeValue_v26p1_10').innerText;
                        TMP.ballPossessionAway = element.querySelector('._awayValue_v26p1_14').innerText;
                        break;
                    case "Goal Attempts":
                        TMP.goalAttemptsHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.goalAttemptsAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Offsides":
                        TMP.offsidesHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.offsidesAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Fouls":
                        TMP.foulsHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.foulsAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Total Passes":
                        TMP.totalPassesHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.totalPassesAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Attacks":
                        TMP.attacksHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.attacksAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                }
            });
            return TMP;
        });
        match.stats = MATCH_STATS;
    }

    for (let match of RESULT.matchesIteration) {
        // 'waitUntil' : ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        await PAGE.goto(match.link + "/#/match-summary/lineups", { 'waitUntil': 'networkidle0' });
        delay(2000);
        console.log(match.link + "/#/match-summary/lineups");
        const MATCH_LINEUPS = await PAGE.evaluate(() => {
            const TMP = {};
            var hasDiffStadium = document.querySelectorAll('#detail > div.infoBox__wrapper.infoBoxModule');
            TMP.homeTeam = {};
            TMP.homeTeam.players = [];
            TMP.awayTeam = {};
            TMP.awayTeam.players = [];
            if (hasDiffStadium.length > 0) {
                TMP.homeTeam.formation = document.querySelector('#detail > div:nth-child(9) > div.lf__header.section__title > span:nth-child(1)').innerText;
                TMP.awayTeam.formation = document.querySelector('#detail > div:nth-child(9) > div.lf__header.section__title > span:nth-child(3)').innerText;

            } else if (hasDiffStadium.length == 0) {
                var homeColumns = document.querySelectorAll('#detail > div:nth-child(8) > div.lf__fieldWrap > div > div:nth-child(1) > .lf__line');
                var awayColumns = document.querySelectorAll('#detail > div:nth-child(8) > div.lf__fieldWrap > div > div.lf__formation.lf__formationAway.lf__formationDense > .lf__line');
                TMP.homeTeam.formation = document.querySelector('#detail > div:nth-child(8) > div.lf__header.section__title > span:nth-child(1)').innerText;
                TMP.awayTeam.formation = document.querySelector('#detail > div:nth-child(8) > div.lf__header.section__title > span:nth-child(3)').innerText;
                homeColumns.forEach(element => {
                    var homePlayers = element.querySelectorAll('.lf__player');
                    homePlayers.forEach(player => {
                        TMP2 = {};
                        var dumpString = player.querySelector('a').getAttribute('href');
                        var dumpStringArray = dumpString.split('/');
                        var dumpStringArraySecondary = dumpStringArray[2].split('-');
                        var lastName = undefined;
                        var firstName = undefined;
                        var middleName = undefined;
                        TMP2.id = dumpStringArray[3];
                        if (dumpStringArraySecondary.length == 2) {
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                        } else if (dumpStringArraySecondary.length == 3) {
                            lastName = dumpStringArraySecondary[1];
                            middleName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[2];
                        } else {
                            firstName = dumpStringArraySecondary[0];
                        }
                        if (firstName == undefined) {
                            TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        } else if (lastName == undefined) {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                        } else if (middleName == undefined) {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        } else {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(middleName).charAt(0).toUpperCase() + String(middleName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        }
                        TMP.homeTeam.players.push(TMP2);
                    });
                });

                awayColumns.forEach(element => {
                    var awayPlayers = element.querySelectorAll('.lf__player');
                    awayPlayers.forEach(player => {
                        TMP2 = {};
                        var dumpString = player.querySelector('a').getAttribute('href');
                        var dumpStringArray = dumpString.split('/');
                        var dumpStringArraySecondary = dumpStringArray[2].split('-');
                        var lastName = dumpStringArraySecondary[0];
                        var firstName = dumpStringArraySecondary[1];
                        TMP2.id = dumpStringArray[3];
                        if (firstName == undefined) {
                            TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        } else if (lastName == undefined) {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                        } else {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        }
                        TMP.awayTeam.players.push(TMP2);
                    });
                });
            }
            return TMP;
        });
        match.homeTeam.lineup = MATCH_LINEUPS.homeTeam;
        match.awayTeam.lineup = MATCH_LINEUPS.awayTeam;
    }

    //original.season = RESULT.season;
    original.matchesIteration = RESULT.matchesIteration;
    console.log(original);
    FS.truncate(fileLocation, 0, function (err) {
        if (err) {
            console.log('An error occurred while truncating the file.');
            return console.log(err);
        }
        console.log('JSON has been cleared.');
    });
    for (var i = 0; i < original.matchesIteration.length; i++) {
        var pushIt = true; // Suponemos que podemos agregar el partido por defecto
        var matchToInsert = original.matchesIteration[i];
        
        for (var j = 0; j < original.season.length; j++) {
            if (matchToInsert.round === original.season[j].round) {
                // Comprobar si ya existe un partido con el mismo identificador
                var existingMatch = original.season[j].matches.find(
                    match => match.id === matchToInsert.id
                );
                
                if (existingMatch) {
                    pushIt = false; // Ya existe un partido con el mismo identificador en esta ronda
                    break; // No es necesario seguir buscando en esta ronda
                } else {
                    original.season[j].matches.push(matchToInsert);
                    delete matchToInsert.link;
                    break; // Hemos agregado el partido, no es necesario seguir buscando en esta ronda
                }
            }
        }
    }
    
    delete original.matchesIteration;
    FS.writeFile(fileLocation, JSON.stringify(original), function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}

async function getAllMatches(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    // // // // // REPETIR EL SIGUIENTE CODIGO TANTAS VECES COMO BOTON DE MOSTRAR MÁS PARTIDOS HAYA
    /*await PAGE.waitForSelector('.event__more', { visible: true });
    await PAGE.evaluate(() => {
        document.querySelector('.event__more').click();
    });
    await delay(4000);*/
    /////////////////////////////////////////////////////////////////////////////////////

    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
        switch (JSON.name) {
            case "LaLiga": JSON.area = "ESP";
                break;
            case "Primera Division":
                JSON.name = "LaLiga";
                JSON.area = "ESP";
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
            TMP.homeTeam.lineup = [];
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
            TMP.awayTeam.lineup = [];
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
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "soccer ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            var hasAssist = element.querySelectorAll('div > div.smv__assist > a');
                            if (hasAssist.length > 0) {
                                dumpString = element.querySelector('div > div.smv__assist > a').getAttribute('href');
                                dumpStringArray = dumpString.split('/');
                                dumpStringArraySecondary = dumpStringArray[2].split('-');
                                lastName = dumpStringArraySecondary[0];
                                firstName = dumpStringArraySecondary[1];
                                if (firstName == undefined) {
                                    TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                } else if (lastName == undefined) {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                                } else {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                }
                            }
                            break;
                        case "soccer footballOwnGoal-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Own Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "substitution ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Substitution";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            dumpString = element.querySelector('div > div.smv__incidentSubOut > a').getAttribute('href');
                            dumpStringArray = dumpString.split('/');
                            dumpStringArraySecondary = dumpStringArray[2].split('-');
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                            if (firstName == undefined) {
                                TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card > Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico redCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "var ":
                            TMP2.type = "VAR > Goal Disallowed";
                            break;
                        case "warning ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Penalty Missed";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                        default:
                            TMP2.type = "-";
                            TMP2.player = "-";
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
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "soccer ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            var hasAssist = element.querySelectorAll('div > div.smv__assist > a');
                            if (hasAssist.length > 0) {
                                dumpString = element.querySelector('div > div.smv__assist > a').getAttribute('href');
                                dumpStringArray = dumpString.split('/');
                                dumpStringArraySecondary = dumpStringArray[2].split('-');
                                lastName = dumpStringArraySecondary[0];
                                firstName = dumpStringArraySecondary[1];
                                if (firstName == undefined) {
                                    TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                } else if (lastName == undefined) {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                                } else {
                                    TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                                }
                            }
                            break;
                        case "soccer footballOwnGoal-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Own Goal";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "substitution ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Substitution";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            dumpString = element.querySelector('div > div.smv__incidentSubOut > a').getAttribute('href');
                            dumpStringArray = dumpString.split('/');
                            dumpStringArraySecondary = dumpStringArray[2].split('-');
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                            if (firstName == undefined) {
                                TMP2.assist = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.assist = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Yellow Card > Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "card-ico redCard-ico":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Red Card";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                            break;
                        case "var ":
                            TMP2.type = "VAR > Goal Disallowed";
                            break;
                        case "warning ":
                            var dumpString = element.querySelector('a').getAttribute('href');
                            var dumpStringArray = dumpString.split('/');
                            var dumpStringArraySecondary = dumpStringArray[2].split('-');
                            var lastName = dumpStringArraySecondary[0];
                            var firstName = dumpStringArraySecondary[1];
                            TMP2.type = "Penalty Missed";
                            if (firstName == undefined) {
                                TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            } else if (lastName == undefined) {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                            } else {
                                TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                            }
                        default:
                            TMP2.type = "-";
                            TMP2.player = "-";
                            break;
                    }
                    TMP2.minute = element.querySelector('.smv__timeBox').innerText;
                }
                TMP.summary.push(TMP2);
            });
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
    }

    for (let match of RESULT.matchesIteration) {
        await PAGE.goto(match.link + "/#/match-summary/match-statistics/0", { 'waitUntil': 'networkidle0' });
        console.log(match.link + "/#/match-summary/match-statistics/0");
        await delay(2000);
        const MATCH_STATS = await PAGE.evaluate(() => {
            const TMP = {};
            const STAT_ROWS = document.querySelectorAll('._row_1gfjz_9');
            STAT_ROWS.forEach(element => {
                categoryName = element.querySelector('._categoryName_11si3_5').innerText;
                switch (categoryName) {
                    case "Ball Possession":
                        TMP.ballPossessionHome = element.querySelector('._homeValue_v26p1_10').innerText;
                        TMP.ballPossessionAway = element.querySelector('._awayValue_v26p1_14').innerText;
                        break;
                    case "Goal Attempts":
                        TMP.goalAttemptsHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.goalAttemptsAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Offsides":
                        TMP.offsidesHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.offsidesAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Fouls":
                        TMP.foulsHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.foulsAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Total Passes":
                        TMP.totalPassesHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.totalPassesAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                    case "Attacks":
                        TMP.attacksHome = parseInt(element.querySelector('._homeValue_v26p1_10').innerText);
                        TMP.attacksAway = parseInt(element.querySelector('._awayValue_v26p1_14').innerText);
                        break;
                }
            });
            return TMP;
        });
        match.stats = MATCH_STATS;
    }

    for (let match of RESULT.matchesIteration) {
        // 'waitUntil' : ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
        await PAGE.goto(match.link + "/#/match-summary/lineups", { 'waitUntil': 'networkidle0' });
        delay(2000);
        console.log(match.link + "/#/match-summary/lineups");
        const MATCH_LINEUPS = await PAGE.evaluate(() => {
            const TMP = {};
            var hasDiffStadium = document.querySelectorAll('#detail > div.infoBox__wrapper.infoBoxModule');
            TMP.homeTeam = {};
            TMP.homeTeam.players = [];
            TMP.awayTeam = {};
            TMP.awayTeam.players = [];
            if (hasDiffStadium.length > 0) {
                TMP.homeTeam.formation = document.querySelector('#detail > div:nth-child(9) > div.lf__header.section__title > span:nth-child(1)').innerText;
                TMP.awayTeam.formation = document.querySelector('#detail > div:nth-child(9) > div.lf__header.section__title > span:nth-child(3)').innerText;

            } else if (hasDiffStadium.length == 0) {
                var homeColumns = document.querySelectorAll('#detail > div:nth-child(8) > div.lf__fieldWrap > div > div:nth-child(1) > .lf__line');
                var awayColumns = document.querySelectorAll('#detail > div:nth-child(8) > div.lf__fieldWrap > div > div.lf__formation.lf__formationAway.lf__formationDense > .lf__line');
                TMP.homeTeam.formation = document.querySelector('#detail > div:nth-child(8) > div.lf__header.section__title > span:nth-child(1)').innerText;
                TMP.awayTeam.formation = document.querySelector('#detail > div:nth-child(8) > div.lf__header.section__title > span:nth-child(3)').innerText;
                homeColumns.forEach(element => {
                    var homePlayers = element.querySelectorAll('.lf__player');
                    homePlayers.forEach(player => {
                        TMP2 = {};
                        var dumpString = player.querySelector('a').getAttribute('href');
                        var dumpStringArray = dumpString.split('/');
                        var dumpStringArraySecondary = dumpStringArray[2].split('-');
                        var lastName = undefined;
                        var firstName = undefined;
                        var middleName = undefined;
                        TMP2.id = dumpStringArray[3];
                        if (dumpStringArraySecondary.length == 2) {
                            lastName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[1];
                        } else if (dumpStringArraySecondary.length == 3) {
                            lastName = dumpStringArraySecondary[1];
                            middleName = dumpStringArraySecondary[0];
                            firstName = dumpStringArraySecondary[2];
                        } else {
                            firstName = dumpStringArraySecondary[0];
                        }
                        if (firstName == undefined) {
                            TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        } else if (lastName == undefined) {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                        } else if (middleName == undefined) {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        } else {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(middleName).charAt(0).toUpperCase() + String(middleName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        }
                        TMP.homeTeam.players.push(TMP2);
                    });
                });

                awayColumns.forEach(element => {
                    var awayPlayers = element.querySelectorAll('.lf__player');
                    awayPlayers.forEach(player => {
                        TMP2 = {};
                        var dumpString = player.querySelector('a').getAttribute('href');
                        var dumpStringArray = dumpString.split('/');
                        var dumpStringArraySecondary = dumpStringArray[2].split('-');
                        var lastName = dumpStringArraySecondary[0];
                        var firstName = dumpStringArraySecondary[1];
                        TMP2.id = dumpStringArray[3];
                        if (firstName == undefined) {
                            TMP2.player = String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        } else if (lastName == undefined) {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1);
                        } else {
                            TMP2.player = String(firstName).charAt(0).toUpperCase() + String(firstName).slice(1) + " " + String(lastName).charAt(0).toUpperCase() + String(lastName).slice(1);
                        }
                        TMP.awayTeam.players.push(TMP2);
                    });
                });
            }
            return TMP;
        });
        match.homeTeam.lineup = MATCH_LINEUPS.homeTeam;
        match.awayTeam.lineup = MATCH_LINEUPS.awayTeam;
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

async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

getLast10Matches(MATCHES_URLS.ENGLAND);
// getAllMatches(MATCHES_URLS.ENGLAND);