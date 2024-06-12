// Import dependencies.
import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Import all files.
import competitions from '../db/competitions.json';
import standingsLaLiga from '../db/2023/standings/standingsLaLiga2023Flashscore.json';

// Initialize the Hono application.
const app = new Hono();
const baseURL = 'https://api.footballr.workers.dev';
const apiVersion = 'v10062024';

// Apply CORS middleware to all routes.
app.use('/*', cors());

// Helper function to generate API parameter objects.
function generateParameter(name, endpoint, description, example, status) {
    return { name, endpoint, description, example, status };
}

// Define the competitions endpoint metadata.
const competitionsEndpoint = {
    name: 'competitions',
    endpoint: '/competitions',
    description: 'List all available competitions 🏆',
    example: `${baseURL}/competitions`,
    status: 'Available 🟢',
    parameters: [
        generateParameter('id', '/competitions/:id', 'List one competition given by id 🔍', `${baseURL}/competitions/LAL`, 'Available 🟢'),
        generateParameter('standings', '/competitions/:id/standings', 'List the current standings for a league 🔝', `${baseURL}/competitions/LAL/standings`, 'Available 🟢'),
    ],
};

// Helper function to format the API version date.
function formatDate(apiVersion) {
    const day = apiVersion.substring(1, 3);
    const month = apiVersion.substring(3, 5);
    const year = apiVersion.substring(5);
    return `${day}.${month}.${year}`;
}

// Define the base API information.
const footballrEndpoint = {
    name: 'FootballR Api ⚽',
    version: apiVersion,
    updated: formatDate(apiVersion),
    message: 'Created with 💙 by Miguel Zafra',
};

// Root endpoint: returns API documentation.
app.get('/', (ctx) => {
    const data = {
        name: footballrEndpoint.name,
        version: footballrEndpoint.version,
        updated: footballrEndpoint.updated,
        message: footballrEndpoint.message,
        endpoints: [competitionsEndpoint]
    };
    return ctx.json(data);
});

// Endpoint to list all competitions.
app.get('/competitions', (ctx) => {
    return ctx.json(competitions);
});

// Endpoint to get a specific competition by ID.
app.get('/competitions/:id', (ctx) => {
    const id = ctx.req.param('id').toUpperCase();
    const competition = competitions.competitions.find((comp) => comp.id === id);
    return competition ? ctx.json(competition) : ctx.json({ message: 'Not Found. 😔' }, 404);
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
                return ctx.json({ message: 'Not Found. 😔' }, 404);
        }
    } else {
        return ctx.json({ message: 'Not Found. 😔' }, 404);
    }
});

// Handle 404 Not Found errors.
app.notFound((ctx) => {
    const { pathname } = new URL(ctx.req.url);
    if (ctx.req.url.endsWith('/')) {
        return ctx.redirect(pathname.slice(0, -1)); // Redirect if URL ends with a slash.
    }
    return ctx.json({ message: 'Not Found. 😔' }, 404);
});

// Export the application.
export default app;
