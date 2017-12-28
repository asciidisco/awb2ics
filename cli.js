var program = require('commander')
var getData = require('./index')

program
  .usage('<options>')
  .option('-s, --street <street_name>', 'Ihr Streaßenname')
  .option('-p, --plz <zipcode>', 'Ihre Postleitzahl')
  .option('-n, --bn <building_number>', 'Ihre Hausnummer')
  .option('-z, --hz <building_number_addition>', 'Ihr Hausnummernzusatz')  
  .option('-y, --year <year>', 'Jahr der Abfuhrtermine')
  .parse(process.argv)

if (typeof program.street === 'undefined' || typeof program.bn  === 'undefined' || typeof program.year  === 'undefined' || typeof program.plz  === 'undefined') {
  program.help()
}

getData(program.street, program.bn, program.year, program.plz, program.hz, (err, data) => {
    if (err) return console.error(err)
    console.log(data)
})