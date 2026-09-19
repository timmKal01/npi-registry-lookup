import { Actor, log } from 'apify';
import { searchNpi } from './nppes.js';

await Actor.init();

const input = (await Actor.getInput()) ?? {};
const {
    npiNumber: singleNpi,
    lastName: singleLastName,
    firstName: singleFirstName,
    state: singleState,
    taxonomyDescription: singleTaxonomy,
    queries: queriesInput,
    maxResults = 10,
} = input;

// The single-lookup fields exist so a Store visitor never has to touch the raw JSON
// "queries" editor just to check one name/NPI. They take priority when filled in;
// "queries" is for the bulk/multi-lookup case.
const queries = (singleNpi || singleLastName)
    ? [{ npiNumber: singleNpi, lastName: singleLastName, firstName: singleFirstName, state: singleState, taxonomyDescription: singleTaxonomy }]
    : (queriesInput?.length ? queriesInput : []);

if (queries.length === 0) {
    throw new Error('No queries provided. Fill in NPI number or Last name, or use the Queries (multiple) field.');
}

/** Must match the event name configured in this Actor's pay-per-event pricing on Apify. */
const QUERY_EVENT = 'lookup-query';

for (const q of queries) {
    const { npiNumber, lastName, firstName, state, taxonomyDescription } = q;
    if (!npiNumber && !lastName) {
        log.warning('Skipping query with no NPI number or last name', { q });
        continue;
    }

    let results = [];
    try {
        results = await searchNpi({ npiNumber, lastName, firstName, state, taxonomyDescription, maxResults });
    } catch (err) {
        log.warning('NPPES search failed', { q, error: err.message });
    }

    if (results.length > 0) {
        await Actor.pushData(results);
    }
    await Actor.charge({ eventName: QUERY_EVENT });

    log.info('Searched NPI Registry', { query: q, results: results.length });
}

await Actor.exit();
