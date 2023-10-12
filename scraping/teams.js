const PUPPETER = require('puppeteer');
const FS = require('fs');
const PATH = require('path');

const URLS = {
    england: "http://clubelo.com/ENG",
    spain: "http://clubelo.com/ESP",
    france: "http://clubelo.com/FRA",
    italy: "http://clubelo.com/ITA",
    germany: "http://clubelo.com/GER",
};

const TEAMS_URLS = {
    ENGLAND: URLS.england,
    SPAIN: URLS.spain,
    FRANCE: URLS.france,
    ITALY: URLS.italy,
    GERMANY: URLS.germany
};

async function getElos(url, startIndex, endIndex) {
    const BROWSER = await PUPPETER.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const PAGE = await BROWSER.newPage();
    await PAGE.goto(url, { waitUntil: "networkidle0" });
    await PAGE.waitForSelector('.liste tbody');
    const RESULT = await PAGE.evaluate((startIndex, endIndex) => {
        const teamRows = document.querySelectorAll('.liste tbody tr');
        const teams = [];
        for (let i = startIndex - 1; i < endIndex; i++) {
            const row = teamRows[i];
            const nameElement = row.querySelector('.l > a');
            const eloElement = row.querySelector('.r');
            if (nameElement && eloElement) {
                const name = nameElement.innerText.trim();
                const elo = eloElement.innerText.trim();
                teams.push({ name, elo });
            }
        }
        return teams;
    }, startIndex, endIndex);

    console.log(RESULT);

    const fileLocation = PATH.join(process.cwd(), './db/teams.json');
    const original = require(fileLocation);
    RESULT.forEach((resultTeam) => {
        switch (resultTeam.name) {
            case "Atlético": resultTeam.name = "Atlético Madrid";
                break;
            case "Cadiz": resultTeam.name = "Cádiz";
                break;
            case "Betis": resultTeam.name = "Real Betis";
                break;
            case "Bilbao": resultTeam.name = "Athletic Bilbao";
                break;
            case "Alavés": resultTeam.name = "Deportivo Alavés";
                break;
            case "Celta": resultTeam.name = "Celta Vigo";
                break;
            case "Man City": resultTeam.name = "Manchester City";
                break;
            case "Newcastle": resultTeam.name = "Newcastle United";
                break;
            case "Tottenham": resultTeam.name = "Tottenham Hotspur";
                break;
            case "Man United": resultTeam.name = "Manchester United";
                break;
            case "West Ham": resultTeam.name = "West Ham United";
                break;
            case "Wolves": resultTeam.name = "Wolverhampton Wanderers";
                break;
            case "Forest": resultTeam.name = "Nottingham Forest";
                break;
            case "Bournemouth": resultTeam.name = "Athletic Bournemouth";
                break;
            case "Paris SG": resultTeam.name = "Paris Saint-Germain";
                break;



            case "Lens": resultTeam.name = "Racing Lens";
                break;
            case "Rennes": resultTeam.name = "Stade Rennais";
                break;
            case "Marseille": resultTeam.name = "Olympique Marseille";
                break;
            case "Nice": resultTeam.name = "Olympique Nice";
                break;
            case "Lille": resultTeam.name = "Olympique Lille";
                break;
            case "Lyon": resultTeam.name = "Olympique Lyonnais";
                break;
            case "Reims": resultTeam.name = "Stade Reims";
                break;
            case "Brest": resultTeam.name = "Stade Brestois";
                break;
            case "Strasbourg": resultTeam.name = "Racing Strasbourg";
                break;



            case "Inter": resultTeam.name = "Inter Milan";
                break;
            case "Napoli": resultTeam.name = "Calcio Napoli";
                break;
            case "Milan": resultTeam.name = "Calcio Milan";
                break;
            case "Fiorentina": resultTeam.name = "Calcio Fiorentina";
                break;
            case "Atalanta": resultTeam.name = "Calcio Atalanta";
                break;
            case "Monza": resultTeam.name = "Calcio Monza";
                break;
            case "Sassuolo": resultTeam.name = "Calcio Sassuolo";
                break;
            case "Udinese": resultTeam.name = "Calcio Udinese";
                break;
            case "Frosinone": resultTeam.name = "Calcio Frosinone";
                break;
            case "Verona": resultTeam.name = "Hellas Verona";
                break;
            case "Cagliari": resultTeam.name = "Calcio Cagliari";
                break;

                case "Bayern": resultTeam.name = "Bayern Munich";
                break;
                case "Dortmund": resultTeam.name = "Borussia Dortmund";
                break;
                case "RB Leipzig": resultTeam.name = "RasenBallsport Leipzig";
                break;
                case "Leverkusen": resultTeam.name = "Bayer Leverkusen";
                break;
                case "Frankfurt": resultTeam.name = "Eintracht Frankfurt";
                break;
                case "Gladbach": resultTeam.name = "Borussia Mönchengladbach";
                break;
                case "Werder": resultTeam.name = "Werder Bremen";
                break;
                case "Darmstadt": resultTeam.name = "Darmstadt Sport-Verein";
                break;
        }
        const teamToUpdate = original.teams.find((team) => team.name === resultTeam.name);
        if (teamToUpdate) {
            teamToUpdate.lastElo = teamToUpdate.currentElo;
            teamToUpdate.lastPosition = teamToUpdate.currentPosition;
            teamToUpdate.currentElo = parseInt(resultTeam.elo);
            console.log(teamToUpdate.name);
        }
    });

    // Ordenar el arreglo por "currentElo" de mayor a menor
    original.teams.sort((a, b) => b.currentElo - a.currentElo);

    // Asignar la posición basada en el orden
    original.teams.forEach((team, index) => {
        team.currentPosition = index + 1;
    });

    FS.writeFile(fileLocation, JSON.stringify(original), (err) => {
        if (err) {
            console.error('Error al guardar el archivo teams.json:', err);
        } else {
            console.log('Archivo teams.json actualizado con éxito.');
        }
    });
    await BROWSER.close();
}

getElos(TEAMS_URLS.ENGLAND, 9, 28);
getElos(TEAMS_URLS.SPAIN, 12, 31);
getElos(TEAMS_URLS.FRANCE, 20, 38);
getElos(TEAMS_URLS.ITALY, 18, 37);
getElos(TEAMS_URLS.GERMANY, 15, 32);