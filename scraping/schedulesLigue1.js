const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    france: "https://www.flashscore.com/football/france/ligue-1/fixtures",
}

const SCHEDULED_URLS = {
    FRANCE: URLS.france,
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
        const ROUNDS_SELECTOR = document.querySelectorAll('.event__round');
        var round = 0;
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

getSchedules(SCHEDULED_URLS.FRANCE);