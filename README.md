# OpenGHG Dashboard

> [!NOTE]  
> This repository is now archived and may not work with more recent versions of Node. Please see the more recent dashboards within the OpenGHG organisation.

![OpenGHG Dashboard CI](https://github.com/openghg/dashboard/workflows/OpenGHG%20Dashboard%20CI/badge.svg)

A simple React and Plotly.js based visualisation dashboard for the [OpenGHG project](https://openghg.org/).

![Screenshot of app](./img/dashboard_cop26.jpg?raw=true)

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
$ npm run test
```

### Code Quality

Code quality is checked using ESLint, this can be run using

```bash
$ npm run lint
```

## Customisation

The dashboard is intended to be a modular template that can be customised for different projects. It is currently serving data from Glasgow and the surrounding area for COP26 but was designed to be used in conjunction with OpenGHG. This makes it easy for researchers to create their own data dashboard.

## Live Data

The data for the dashboard is updated multiple times a day and comes from a network of sensors run by a large community of researchers. See 'Observations' on the [dashboard homepage](https://openghg.github.io/dashboard/). This data is pulled down from [our data repository](https://github.com/openghg/dashboard_data) which is updated automatically when raw sensor data is pushed to our serverless functions.

