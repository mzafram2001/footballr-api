const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

// // // // // // // // // // URLs // // // // // // // // // //
const URLS = {
    france_matches_2015: "https://www.flashscore.com/football/france/ligue-1-2015-2016/results/",
    france_matches_2016: "https://www.flashscore.com/football/france/ligue-1-2016-2017/results/",
    france_matches_2017: "https://www.flashscore.com/football/france/ligue-1-2017-2018/results/",
    france_matches_2018: "https://www.flashscore.com/football/france/ligue-1-2018-2019/results/",
    france_matches_2019: "https://www.flashscore.com/football/france/ligue-1-2019-2020/results/",
    france_matches_2020: "https://www.flashscore.com/football/france/ligue-1-2020-2021/results/",
    france_matches_2021: "https://www.flashscore.com/football/france/ligue-1-2021-2022/results/",
    france_matches_2022: "https://www.flashscore.com/football/france/ligue-1/results/",
}

// // // // // // // // // // CODE MATCHES // // // // // // // // // //
async function getAllMatches(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
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
                case "Paris SG": TMP.homeTeam.name = "Paris Saint-Germain";
                    break;
                case "Marseille": TMP.homeTeam.name = "Olympique Marseille";
                    break;
                case "Lens": TMP.homeTeam.name = "Racing Lens";
                    break;
                case "Rennes": TMP.homeTeam.name = "Stade Rennais";
                    break;
                case "Lille": TMP.homeTeam.name = "Olympique Lille";
                    break;
                case "Nice": TMP.homeTeam.name = "Olympique Nice";
                    break;
                case "Reims": TMP.homeTeam.name = "Stade Reims";
                    break;
                case "Lyon": TMP.homeTeam.name = "Olympique Lyonnais";
                    break;
                case "Strasbourg": TMP.homeTeam.name = "Racing Strasbourg";
                    break;
                case "Brest": TMP.homeTeam.name = "Stade Brestois";
                    break;
                case "AC Ajaccio": TMP.homeTeam.name = "Athletic Ajaccien";
                    break;
                case "Angers": TMP.homeTeam.name = "Sporting Angers";
                    break;
                case "St Etienne": TMP.homeTeam.name = "Saint-Étienne Loire";
                    break;
                case "Bordeaux": TMP.homeTeam.name = "Girondins Bordeaux";
                    break;
                case "Nimes": TMP.homeTeam.name = "Olympique Nîmes";
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
                case "Paris SG": TMP.awayTeam.name = "Paris Saint-Germain";
                    break;
                case "Marseille": TMP.awayTeam.name = "Olympique Marseille";
                    break;
                case "Lens": TMP.awayTeam.name = "Racing Lens";
                    break;
                case "Rennes": TMP.awayTeam.name = "Stade Rennais";
                    break;
                case "Lille": TMP.awayTeam.name = "Olympique Lille";
                    break;
                case "Nice": TMP.awayTeam.name = "Olympique Nice";
                    break;
                case "Reims": TMP.awayTeam.name = "Stade Reims";
                    break;
                case "Lyon": TMP.awayTeam.name = "Olympique Lyonnais";
                    break;
                case "Strasbourg": TMP.awayTeam.name = "Racing Strasbourg";
                    break;
                case "Brest": TMP.awayTeam.name = "Stade Brestois";
                    break;
                case "AC Ajaccio": TMP.awayTeam.name = "Athletic Ajaccien";
                    break;
                case "Angers": TMP.awayTeam.name = "Sporting Angers";
                    break;
                case "St Etienne": TMP.awayTeam.name = "Saint-Étienne Loire";
                    break;
                case "Bordeaux": TMP.awayTeam.name = "Girondins Bordeaux";
                    break;
                case "Nimes": TMP.awayTeam.name = "Olympique Nîmes";
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
            TMP.homeGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(1)').innerText);
            TMP.awayGoals = parseInt(document.querySelector('#detail > div.duelParticipant > div.duelParticipant__score > div > div.detailScore__wrapper > span:nth-child(3)').innerText);
            TMP.status = document.querySelector('.fixedHeaderDuel__detailStatus').innerText;
            TMP.stats = [];
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
                    case "Offsides":
                        TMP.offsidesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.offsidesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Fouls":
                        TMP.foulsHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.foulsAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Total Passes":
                        TMP.totalPassesHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.totalPassesAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                    case "Attacks":
                        TMP.attacksHome = parseInt(element.querySelector('.stat__homeValue').innerText);
                        TMP.attacksAway = parseInt(element.querySelector('.stat__awayValue').innerText);
                        break;
                }
            });
            return TMP;
        });
        match.stats = MATCH_STATS;
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

// // // // // // // // // // DELAY // // // // // // // // // //
async function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

// // // // // // // // // // FUNCTION CALL // // // // // // // // // //
getAllMatches(URLS.france_matches_2017);