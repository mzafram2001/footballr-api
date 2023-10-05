const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    italy: "https://www.flashscore.com/football/italy/serie-a/results/",
}

const MATCHES_URLS = {
    ITALY: URLS.italy,
};

async function getLast10Matches(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    var fileLocation = PATH.join(process.cwd(), "./db/2023/matches/matchesSerieA2023Flashcore.json");
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
                case "Napoli": TMP.homeTeam.name = "Calcio Napoli";
                    break;
                case "Inter": TMP.homeTeam.name = "Inter Milan";
                    break;
                case "AC Milan": TMP.homeTeam.name = "Calcio Milan";
                    break;
                case "AS Roma": TMP.homeTeam.name = "Roma";
                    break;
                case "Atalanta": TMP.homeTeam.name = "Calcio Atalanta";
                    break;
                case "Udinese": TMP.homeTeam.name = "Calcio Udinese";
                    break;
                case "Fiorentina": TMP.homeTeam.name = "Calcio Fiorentina";
                    break;
                case "Sassuolo": TMP.homeTeam.name = "Calcio Sassuolo";
                    break;
                case "Monza": TMP.homeTeam.name = "Calcio Monza";
                    break;
                case "Spezia": TMP.homeTeam.name = "Calcio Spezia";
                    break;
                case "Verona": TMP.homeTeam.name = "Hellas Verona";
                    break;
                case "Sampdoria": TMP.homeTeam.name = "Calcio Cagliari";
                    break;
                case "Cagliari": TMP.homeTeam.name = "Calcio Cagliari";
                    break;
                case "Benevento": TMP.homeTeam.name = "Calcio Benevento";
                    break;
                case "Parma": TMP.homeTeam.name = "Calcio Parma";
                    break;
                case "Chievo": TMP.homeTeam.name = "Calcio Chievo";
                    break;
                case "AC Carpi": TMP.homeTeam.name = "Calcio Carpi";
                    break;
                case "Frosinone": TMP.homeTeam.name = "Calcio Frosinone";
                    break;
                case "Pescara": TMP.homeTeam.name = "Delfino Pescara";
                    break;
                case "Brescia": TMP.homeTeam.name = "Calcio Brescia";
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
                case "Napoli": TMP.awayTeam.name = "Calcio Napoli";
                    break;
                case "Inter": TMP.awayTeam.name = "Inter Milan";
                    break;
                case "AC Milan": TMP.awayTeam.name = "Calcio Milan";
                    break;
                case "AS Roma": TMP.awayTeam.name = "Roma";
                    break;
                case "Atalanta": TMP.awayTeam.name = "Calcio Atalanta";
                    break;
                case "Udinese": TMP.awayTeam.name = "Calcio Udinese";
                    break;
                case "Fiorentina": TMP.awayTeam.name = "Calcio Fiorentina";
                    break;
                case "Sassuolo": TMP.awayTeam.name = "Calcio Sassuolo";
                    break;
                case "Monza": TMP.awayTeam.name = "Calcio Monza";
                    break;
                case "Spezia": TMP.awayTeam.name = "Calcio Spezia";
                    break;
                case "Verona": TMP.awayTeam.name = "Hellas Verona";
                    break;
                case "Sampdoria": TMP.awayTeam.name = "Calcio Cagliari";
                    break;
                case "Cagliari": TMP.awayTeam.name = "Calcio Cagliari";
                    break;
                case "Benevento": TMP.awayTeam.name = "Calcio Benevento";
                    break;
                case "Parma": TMP.awayTeam.name = "Calcio Parma";
                    break;
                case "Chievo": TMP.awayTeam.name = "Calcio Chievo";
                    break;
                case "AC Carpi": TMP.awayTeam.name = "Calcio Carpi";
                    break;
                case "Frosinone": TMP.awayTeam.name = "Calcio Frosinone";
                    break;
                case "Pescara": TMP.awayTeam.name = "Delfino Pescara";
                    break;
                case "Brescia": TMP.awayTeam.name = "Calcio Brescia";
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
        await delay(2000);
        const MATCH_STATS = await PAGE.evaluate(() => {
            const TMP = {};
            const STAT_ROWS = document.querySelectorAll('._ho_row_1gfjz_9');
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
                case "Napoli": TMP.homeTeam.name = "Calcio Napoli";
                    break;
                case "Inter": TMP.homeTeam.name = "Inter Milan";
                    break;
                case "AC Milan": TMP.homeTeam.name = "Calcio Milan";
                    break;
                case "AS Roma": TMP.homeTeam.name = "Roma";
                    break;
                case "Atalanta": TMP.homeTeam.name = "Calcio Atalanta";
                    break;
                case "Udinese": TMP.homeTeam.name = "Calcio Udinese";
                    break;
                case "Fiorentina": TMP.homeTeam.name = "Calcio Fiorentina";
                    break;
                case "Sassuolo": TMP.homeTeam.name = "Calcio Sassuolo";
                    break;
                case "Monza": TMP.homeTeam.name = "Calcio Monza";
                    break;
                case "Spezia": TMP.homeTeam.name = "Calcio Spezia";
                    break;
                case "Verona": TMP.homeTeam.name = "Hellas Verona";
                    break;
                case "Sampdoria": TMP.homeTeam.name = "Calcio Cagliari";
                    break;
                case "Cagliari": TMP.homeTeam.name = "Calcio Cagliari";
                    break;
                case "Benevento": TMP.homeTeam.name = "Calcio Benevento";
                    break;
                case "Parma": TMP.homeTeam.name = "Calcio Parma";
                    break;
                case "Chievo": TMP.homeTeam.name = "Calcio Chievo";
                    break;
                case "AC Carpi": TMP.homeTeam.name = "Calcio Carpi";
                    break;
                case "Frosinone": TMP.homeTeam.name = "Calcio Frosinone";
                    break;
                case "Pescara": TMP.homeTeam.name = "Delfino Pescara";
                    break;
                case "Brescia": TMP.homeTeam.name = "Calcio Brescia";
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
                case "Napoli": TMP.awayTeam.name = "Calcio Napoli";
                    break;
                case "Inter": TMP.awayTeam.name = "Inter Milan";
                    break;
                case "AC Milan": TMP.awayTeam.name = "Calcio Milan";
                    break;
                case "AS Roma": TMP.awayTeam.name = "Roma";
                    break;
                case "Atalanta": TMP.awayTeam.name = "Calcio Atalanta";
                    break;
                case "Udinese": TMP.awayTeam.name = "Calcio Udinese";
                    break;
                case "Fiorentina": TMP.awayTeam.name = "Calcio Fiorentina";
                    break;
                case "Sassuolo": TMP.awayTeam.name = "Calcio Sassuolo";
                    break;
                case "Monza": TMP.awayTeam.name = "Calcio Monza";
                    break;
                case "Spezia": TMP.awayTeam.name = "Calcio Spezia";
                    break;
                case "Verona": TMP.awayTeam.name = "Hellas Verona";
                    break;
                case "Sampdoria": TMP.awayTeam.name = "Calcio Cagliari";
                    break;
                case "Cagliari": TMP.awayTeam.name = "Calcio Cagliari";
                    break;
                case "Benevento": TMP.awayTeam.name = "Calcio Benevento";
                    break;
                case "Parma": TMP.awayTeam.name = "Calcio Parma";
                    break;
                case "Chievo": TMP.awayTeam.name = "Calcio Chievo";
                    break;
                case "AC Carpi": TMP.awayTeam.name = "Calcio Carpi";
                    break;
                case "Frosinone": TMP.awayTeam.name = "Calcio Frosinone";
                    break;
                case "Pescara": TMP.awayTeam.name = "Delfino Pescara";
                    break;
                case "Brescia": TMP.awayTeam.name = "Calcio Brescia";
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
        await delay(2000);
        const MATCH_STATS = await PAGE.evaluate(() => {
            const TMP = {};
            const STAT_ROWS = document.querySelectorAll('._ho_row_1gfjz_9');
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

getLast10Matches(MATCHES_URLS.ITALY);
// getAllMatches(MATCHES_URLS.ITALY);
