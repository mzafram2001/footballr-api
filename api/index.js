// Import dependencies.
import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Import all files.
import countries from '../db/countries.json';
import competitions from '../db/competitions.json';
import standingsLaLiga from '../db/2024/standings/standingsLaLiga2024.json';
import fixturesLaLiga from '../db/2024/fixtures/fixturesLaLiga2024.json';

// Initialize the Hono application.
const app = new Hono();
const baseURL = 'https://api-footballr.arkeos.workers.dev';
const apiVersion = 'v20240803';

// Apply CORS middleware to all routes.
app.use('/*', cors());

// Helper function to generate API parameter objects.
function generateParameter(name, description, endpoint, example, status) {
    return { name, description, endpoint, example, status };
}

// Define the countries endpoint metadata.
const countriesEndpoint = {
    name: 'countries',
    description: 'List all countries.',
    endpoint: '/countries',
    example: `${baseURL}/countries`,
    status: 'Available',
    parameters: [
        generateParameter('id', 'List one country given by id.', '/countries/:id', `${baseURL}/countries/ES`, 'Available'),
    ],
}

// Define the competitions endpoint metadata.
const competitionsEndpoint = {
    name: 'competitions',
    description: 'List all available competitions.',
    endpoint: '/competitions',
    example: `${baseURL}/competitions`,
    status: 'Available',
    parameters: [
        generateParameter('id', 'List one competition given by id.', '/competitions/:id', `${baseURL}/competitions/LAL`, 'Available'),
        generateParameter('standings', 'List the current standings for a league.', '/competitions/:id/standings', `${baseURL}/competitions/LAL/standings`, 'Available'),
        generateParameter('fixtures', 'List the fixtures for a league.', '/competitions/:id/fixtures', `${baseURL}/competitions/LAL/fixtures`, 'Available'),
    ],
};

// Helper function to format the API version date.
function formatDate(apiVersion) {
    const year = apiVersion.substring(1, 5);
    const month = apiVersion.substring(5, 7);
    const day = apiVersion.substring(7, 9);
    return `${year}-${month}-${day}`;
}

// Define the base API information.
const footballrEndpoint = {
    name: 'FootballR API',
    description: 'Advanced API designed to provide accurate, real-time data on the world of football.',
    repoURL: 'https://github.com/mzafram2001/footballr-api',
    version: apiVersion,
    updated: formatDate(apiVersion),
    message: 'Created with love by Miguel Zafra.',
};

// Root endpoint: returns API documentation.
app.get('/', (ctx) => {
    const data = {
        name: footballrEndpoint.name,
        description: footballrEndpoint.description,
        repoUrl: footballrEndpoint.repoURL,
        version: footballrEndpoint.version,
        updated: footballrEndpoint.updated,
        message: footballrEndpoint.message,
        endpoints: [countriesEndpoint, competitionsEndpoint]
    };
    return ctx.json(data);
});

// Endpoint to list all countries.
app.get('/countries', (ctx) => {
    return ctx.json(countries);
});

// Endpoint to get a specific country by ID.
app.get('/countries/:id', (ctx) => {
    const id = ctx.req.param('id').toUpperCase();
    const country = countries.countries.find((comp) => comp.id === id);

    if (country) {
        const response = {
            updated: "2024-08-03",
            countries: [country]
        };
        return ctx.json(response);
    } else {
        return ctx.json({ errorCode: '404' }, 404);
    }
});

// Endpoint to list all competitions.
app.get('/competitions', (ctx) => {
    return ctx.json(competitions);
});

// Endpoint to get a specific competition by ID.
app.get('/competitions/:id', (ctx) => {
    const id = ctx.req.param('id').toUpperCase();
    const competition = competitions.competitions.find((comp) => comp.id === id);

    if (competition) {
        const response = {
            updated: "2024-08-03",
            competitions: [competition]
        };
        return ctx.json(response);
    } else {
        return ctx.json({ errorCode: '404' }, 404);
    }
});

// Endpoint to get standings for a specific competition by ID.
app.get('/competitions/:id/standings', (ctx) => {
    const id = ctx.req.param('id').toUpperCase();
    const competition = competitions.competitions.find((comp) => comp.id === id);
    if (competition) {
        switch (id) {
            case 'LAL':
                return ctx.json(standingsLaLiga);
            default:
                return ctx.json({ errorCode: '404' }, 404);
        }
    } else {
        return ctx.json({ errorCode: '404' }, 404);
    }
});

// Endpoint to get fixtures for a specific competition by ID.
app.get('/competitions/:id/fixtures', (ctx) => {
    const id = ctx.req.param('id').toUpperCase();
    const competition = competitions.competitions.find((comp) => comp.id === id);
    if (competition) {
        switch (id) {
            case 'LAL':
                return ctx.json(fixturesLaLiga);
            default:
                return ctx.json({ errorCode: '404' }, 404);
        }
    } else {
        return ctx.json({ errorCode: '404' }, 404);
    }
});

// Handle 404 Not Found errors.
app.notFound((ctx) => {
    const { pathname } = new URL(ctx.req.url);
    if (ctx.req.url.endsWith('/')) {
        return ctx.redirect(pathname.slice(0, -1)); // Redirect if URL ends with a slash.
    }
    return ctx.json({ errorCode: '404' }, 404);
});

// Export the application.
export default app;
