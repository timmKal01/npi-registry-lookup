# NPI Registry Lookup — Healthcare Provider Verification

Look up US healthcare providers and organizations by NPI number, name, or
location. Get back credential, specialty/taxonomy, license number and
state, registration status, and practice address, straight from the
official CMS NPPES NPI Registry.

Built for credentialing checks, provider directory upkeep, and healthcare
sales/marketing teams verifying a provider before outreach. Pairs well with
this portfolio's other CMS-quality-data actors.

## Input

```json
{
  "lastName": "Smith",
  "firstName": "",
  "state": "NY",
  "taxonomyDescription": "Dentist",
  "maxResults": 10
}
```

| Field | Type | Description |
|---|---|---|
| `npiNumber` | string | Direct 10-digit NPI lookup. |
| `lastName` | string | Individual last name or organization name, for a single search. |
| `firstName` | string | Optional, individual providers only. |
| `state` | string | Optional two-letter state filter. |
| `taxonomyDescription` | string | Optional specialty filter, e.g. `"Family Medicine"`. |
| `queries` | array | For several lookups in one run: `{ "npiNumber" }` or `{ "lastName", "firstName", "state", "taxonomyDescription" }`. Ignored if NPI number/Last name above is filled in. |
| `maxResults` | integer | Max matches per query (default 10, API max 200). |

## Output

```json
{
  "npi": "1366148975",
  "type": "individual",
  "name": "RACHEL M AMSEL",
  "credential": "DDS",
  "status": "Active",
  "primaryTaxonomy": "Dentist, Pediatric Dentistry",
  "licenseNumber": "064991",
  "licenseState": "NY",
  "city": "RIVERHEAD",
  "state": "NY",
  "phone": "631-727-8585",
  "enumerationDate": "2023-02-06",
  "lastUpdated": "2025-10-27"
}
```

## How it works

Direct calls to the official CMS NPPES NPI Registry API
(`npiregistry.cms.hhs.gov/api`) — no scraping, no proxy, no key.

## Pricing note

Billed per **query**, not per result returned.

## Related products

- [Hospital Quality Lookup](https://github.com/timmKal01/hospital-quality-lookup)
- [Nursing Home Quality Lookup](https://github.com/timmKal01/nursing-home-quality-lookup)
- [Home Health Agency Lookup](https://github.com/timmKal01/home-health-agency-lookup)
