const getData = require('./index')

const download = (filename, text) => {
  var element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

document.getElementById('exec').addEventListener('click', (event) => {
    event.preventDefault()
    let street_name = document.getElementById('street_name').value.trim()
    let building_number = document.getElementById('building_number').value.trim()
    let building_number_addition = document.getElementById('building_number_addition').value.trim()
    let year = document.getElementById('year').value.trim()
    let plz = document.getElementById('plz').value.trim()
    getData(street_name, building_number, year, plz, building_number_addition, (err, data) => {
        if (err) return document.getElementById('result').value = err
        document.getElementById('result').value = data
        document.getElementById('result').style.visibility = 'visible'
        document.getElementById('download').style.visibility = 'visible'
    })
}, false)

document.getElementById('download').addEventListener('click', (event) => {
    let street_name = document.getElementById('street_name').value
    let building_number = document.getElementById('building_number').value
    let building_number_addition = document.getElementById('building_number_addition').value
    let year = document.getElementById('year').value
    download('abfuhrkalender_' + year.trim() + '_' + encodeURIComponent(street_name.trim().replace('.', '')) + '_' + building_number.trim() + '.ics', document.getElementById('result').value)
})