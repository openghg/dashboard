# OpenGHG Dashboard

![OpenGHG Dashboard CI](https://github.com/openghg/dashboard/workflows/OpenGHG%20Dashboard%20CI/badge.svg)

A simple React and Plotly.js based visualisation dashboard for the [OpenGHG project](https://openghg.org/).

![Screenshot of app](./img/dashboard_20210825.jpg?raw=true)

## Run locally

To run the app locally please make sure you have [node installed](https://nodejs.org/en/). Then you can clone this repo and run

```bash
$ npm install
```

This will install all of the dependencies required to run the app. You can then start the app using

```bash
$ npm start
```

You should then be able to access the app at [http://localhost:3000](http://localhost:3000).

## Development

### Testing

If you'd like to make changes and/or add components to this project please make sure each component is tested. We make use
of the React Testing Library to test the application as a user would interact with it. Please refer to [their documentation](https://testing-library.com/docs/react-testing-library/intro/) for instructions on how to get started.

You can run the tests using

```bash
$ npm test
```

### Code Quality

Code quality is checked using ESLint, this can be run using

```bash
$ npm run lint
```

## Customisation

The dashboard is intended to be a modular template that can be customised for different projects. It is currently serving data from Glasgow and the surrounding area for COP26 but this can easily be changed. Here we'll give an example of how we update the dashboard to use some recent data from the [BEACO2N project](http://beacon.berkeley.edu/about/).

### Retrieve and process

Please see our [web scraping repo](https://github.com/openghg/web-scrape) for the scripts we use to retrieve and process the data from the BEACO2N project. At the end of that process we end up with two files: `glasgow_nodes_parsed.json` and `glasgow_data.json`. These files can then be placed in the
`src/data` directory.

### Update data import

For the dashboard to use this new data we need to tell it to import the data and process it. Open `Dashboard.js` and import the data using

```javascript
import glasgowData from "./data/glasgow_data.json";
```

Then within the constructor (see line ~ 30) change

```javascript
const completeData = < some variable >;
```

to

```javascript
const completeData = glasgowData;
```

### Update site data import

Next we need to update the site data import, first we need to import the file

```javascript
import glasgowSiteData from "./data/glasgow_nodes_parsed.json";
```

Next update constructor so we have (see line ~ 60)

```javascript
const sites = glasgowSiteData;
```

This will then tell the dashboard to import and process the correct site data. If you haven't already, start the dashboard using `npm start` and you should have a freshly updated version.

## Data Specification

The dashboard expects data in a JSON format

{
    network: {
        species: {
            site: {
                data: {
                    unix_timestamp_ms: measurement
                },
                metadata: {
                    site: "site_name"
                }
            }
        }
    }
}

