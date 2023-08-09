const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "http://www.elofootball.com/country.php?countryiso=ENG&season=2023-2024",
    spain: "http://www.elofootball.com/country.php?countryiso=ESP&season=2023-2024",
    france: "http://www.elofootball.com/country.php?countryiso=FRA&season=2023-2024",
    italy: "http://www.elofootball.com/country.php?countryiso=ITA&season=2023-2024",
    germany: "http://www.elofootball.com/country.php?countryiso=DEU&season=2023-2024"
}

const ELOS_URLS = {
    ELOS_SPAIN: URLS.spain,
};

async function getElos(url) {
    const BROWSER = await PUPPETER.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });

    const RESULT = await PAGE.evaluate(() => {
        const JSON = {};
        JSON.elos = [];
        const ROWS = document.querySelectorAll('#body > table > tbody > tr');
        var dump = 0;
        var dumpForm = 0;
        ROWS.forEach(element => {
            dump++;
            var TMP = {};
            TMP.name = element.querySelector('#body > table > tbody > tr:nth-child(' + dump + ') > td:nth-child(2)').innerText.trimEnd();
            TMP.currentElo = parseInt(element.querySelector('#body > table > tbody > tr:nth-child(' + dump + ') > td:nth-child(9) > div').innerText);
            // FORM REVISAR
            TMP.form = "-";
            TMP.lastElos = "-";
            JSON.elos.push(TMP);
        });
        return JSON;
    });

    var fileLocation = PATH.join(process.cwd(), "./db/2023/elos/elos.json");

    FS.writeFile(fileLocation, JSON.stringify(RESULT), 'utf8', function (err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });
    await BROWSER.close();
}

getElos(ELOS_URLS.ELOS_SPAIN);