# Angular2 Unit Test Samples

This project uses `json-server`, `bootstrap`, and `angular 2` as a RESTful server and client.  There are unit and component and service tests composed for each of the files.

This is a work in progress, pulled from my original samples back in Febrary 2016 during the early betas and release candidates. The tests aren't ideal - not as thought out yet as I'd like, but show what is possible.

## Setup

```bash
npm install -g angular-cli karma-cli
cd angular2-unittest-samples-release
npm install
```

## Running

```bash
# tests
ng test
# servers (there are two, one for the Angular app, and one for the JSON API
ng serve --proxy-config proxy-config.json    # runs on port 4200
node server        # runs on port 3009
```

## Browse to the app
`http://localhost:4200`

# Things off of baseline

* had to do `npm i @types/es6-promise --save` to install es6 promise support in IDE
* Installed the karma story reporter with `npm install --save-dev karma-story-reporter`
