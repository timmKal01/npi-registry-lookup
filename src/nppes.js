const BASE = 'https://npiregistry.cms.hhs.gov/api/';

export async function searchNpi({ npiNumber, lastName, firstName, state, taxonomyDescription, maxResults = 10 }) {
    const params = new URLSearchParams({ version: '2.1', limit: String(Math.min(maxResults, 200)) });
    if (npiNumber) params.set('number', npiNumber);
    if (lastName) params.set('last_name', lastName);
    if (firstName) params.set('first_name', firstName);
    if (state) params.set('state', state);
    if (taxonomyDescription) params.set('taxonomy_description', taxonomyDescription);

    const res = await fetch(`${BASE}?${params.toString()}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; npi-registry-lookup/0.1)' },
    });
    if (!res.ok) {
        throw new Error(`NPPES request failed: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return (data.results ?? []).map(normalize);
}

function normalize(r) {
    const b = r.basic ?? {};
    const primaryTaxonomy = (r.taxonomies ?? []).find((t) => t.primary) ?? r.taxonomies?.[0] ?? null;
    const location = (r.addresses ?? []).find((a) => a.address_purpose === 'LOCATION') ?? r.addresses?.[0] ?? null;
    const isOrg = r.enumeration_type === 'NPI-2';

    return {
        npi: r.number,
        type: isOrg ? 'organization' : 'individual',
        name: isOrg ? b.organization_name : [b.first_name, b.middle_name, b.last_name].filter(Boolean).join(' '),
        credential: b.credential ?? null,
        status: b.status === 'A' ? 'Active' : (b.status ?? null),
        primaryTaxonomy: primaryTaxonomy?.desc ?? null,
        licenseNumber: primaryTaxonomy?.license ?? null,
        licenseState: primaryTaxonomy?.state ?? null,
        city: location?.city ?? null,
        state: location?.state ?? null,
        phone: location?.telephone_number ?? null,
        enumerationDate: b.enumeration_date ?? null,
        lastUpdated: b.last_updated ?? null,
    };
}
