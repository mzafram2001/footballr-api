// Import dependencies.
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Define URLs object.
const URLs = {
    spain: "https://www.flashscore.com/football/spain/laliga/standings/#/dINOZk9Q/table/overall",
};

// Define the properties of teamsEloURLs.
const teamsEloURLs = {
    SPAIN: URLs.spain,
};

// Create the base object.
const footballRAPIObject = {
    "updated": new Date().toISOString().slice(0, 10),
    "teams": []
};

// Define the properties of teamsData.
const teamsData = {
    "Atl. Madrid": { short: "ATM", name: "Atlético Madrid", color: "#FA0000" },
    "Betis": { short: "BET", name: "Real Betis", color: "#25961D" },
    "Ath Bilbao": { short: "BIL", name: "Athletic Bilbao", color: "#FF0A0A" },
    "Real Madrid": { short: "RMA", name: "Real Madrid", color: "#DEDEDE" },
    "Girona": { short: "GIR", name: "Girona", color: "#CD2534" },
    "Barcelona": { short: "BAR", name: "Barcelona", color: "#BF0000" },
    "Real Sociedad": { short: "RSO", name: "Real Sociedad", color: "#1610DE" },
    "Valencia": { short: "VAL", name: "Valencia", color: "#FF8308" },
    "Villarreal": { short: "VIL", name: "Villarreal", color: "#FFF01C" },
    "Getafe": { short: "GET", name: "Getafe", color: "#1611A8" },
    "Alaves": { short: "ALA", name: "Alavés", color: "#0761AF" },
    "Sevilla": { short: "SEV", name: "Sevilla", color: "#FAFAFA" },
    "Osasuna": { short: "OSA", name: "Osasuna", color: "#AB0505" },
    "Las Palmas": { short: "PAL", name: "Las Palmas", color: "#FFE400" },
    "Celta Vigo": { short: "CEL", name: "Celta Vigo", color: "#8ABDFF" },
    "Rayo Vallecano": { short: "RAY", name: "Rayo Vallecano", color: "#F20202" },
    "Mallorca": { short: "MAL", name: "Mallorca", color: "#A10505" },
    "Valladolid": { short: "VLL", name: "Valladolid", color: "#3D1169" },
    "Leganes": { short: "LEG", name: "Leganés", color: "#0C1F6E" },
    "Espanyol": { short: "ESP", name: "Espanyol", color: "#007FC8" },
};

// Main function.
async function getTeamsIndex(url, teamsData, footballRAPIObject) {
    // Launch the Puppeteer browser in headless mode.
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // Open a new page.
    const page = await browser.newPage();

    // Navigate to the specified URL and wait until the network is idle.
    await page.goto(url, { waitUntil: "networkidle0" });

    // Click consent cookies banner.
    await page.waitForSelector('#onetrust-accept-btn-handler', { visible: true, timeout: 3000 });
    await page.click('#onetrust-accept-btn-handler');

    // Create teams object.
    const teams = [];
    const addedTeams = new Set();

    // Get all the teams URL.
    await page.waitForSelector('.ui-table__body');
    const teamUrls = await page.evaluate(() => {
        const links = document.querySelectorAll('.ui-table__body a');
        return Array.from(links).map(link => link.href);
    });

    // For each team, go to URL.
    for (const url of teamUrls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Wait until document is loaded.
            await page.waitForSelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name');

            // Get info from team.
            const teamData = await page.evaluate(() => {
                const urlParts = window.location.href.split('/');
                const id = urlParts[urlParts.length - 2];
                const name = document.querySelector('#mc > div.container__livetable > div.container__heading > div.heading > div.heading__title > div.heading__name').innerText;
                return { id, name };
            });

            // Check if the team has already been added.
            if (addedTeams.has(teamData.id)) {
                continue; // Skip adding this team.
            }

            // Search team info in teamsData.
            const teamInfo = teamsData[teamData.name];
            
            // If found is true, then push it into teams object.
            if (teamInfo) {
                teams.push({
                    id: teamData.id,
                    name: teamInfo.name,
                    short: teamInfo.short,
                    color: teamInfo.color
                });
                addedTeams.add(teamData.id); // Mark this team as added.
            } else {
                console.log("Error searching the team.");
            }
        } catch (error) {
            console.error(`Error al procesar la URL ${url}:`, error);
        }
    }

    // Push to the original object.
    footballRAPIObject.teams.push(teams);

    // Define the file location for saving the data.
    const fileLocation = path.join(__dirname, `../db/teams.json`);

    // Write the data to a JSON file.
    fs.writeFile(fileLocation, JSON.stringify({ updated: footballRAPIObject.updated, teams: teams }), 'utf8', (err) => {
        if (err) {
            console.log(`[Teams | 2024] - An error occurred while writing JSON object to file.`);
            console.log(err);
        } else {
            console.log(`[Teams | 2024] - JSON file has been saved.`);
        }
    });

    browser.close();
}

// Clone the base object for each function call.
function cloneBaseObject(baseObject) {
    return JSON.parse(JSON.stringify(baseObject));
}

// Fetch teams for the specified URL and teams data.
getTeamsIndex(teamsEloURLs.SPAIN, teamsData, cloneBaseObject(footballRAPIObject));
