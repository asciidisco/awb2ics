# awb2ics

Abfuhrkalender ICS Generator für Köln AWB

Da die Stadt Köln & die AWB Betriebe es seit Jahren nicht hinbekommen die Abfuhrtermine
als [ICS anzubieten](https://www.offenedaten-koeln.de/anfragen/abfuhrtermine-im-ical-format), gibt es hier die inoffizielle Lösung.

Als gehostete Version: [https://asciidisco.github.io/awb2ics/](https://asciidisco.github.io/awb2ics/)

## Install

```
npm i awb2ics -g
```

## CLI

```
  Usage: awb2ics <options> > my_cal.ics

  Options:

    -h, --help                  output usage information
    -s, --street <street_name>  Ihr Streaßenname
    -p, --plz <zipcode>         Ihre Postleitzahl
    -n, --bn <building_number>  Ihre Hausnummer
    -y, --year <year>           Jahr der Abfuhrtermine
```

## Programmatically

```
const awb2ics = require('awb2ics')
awb2ics(street_name, building_number, year, zipcode, (err, data) => {})
```

## Website

```
git clone git@github.com:asciidisco/awb2ics.git
npm run browser
open index.html 
```