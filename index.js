const fs = require('fs')
const http = require('https')
const uuid = require('node-uuid')
const icalendar = require('icalendar')
const ical = new icalendar.iCalendar()

const tranformSubject = (subject) => {
  switch (subject) {
    case 'grey':
      return "Graue Tonne"
    case 'green':
      return "Grüne Tonne"
    case 'blue':
      return "Blaue Tonne"
    case 'yellow':
      return "Gelbe Tonne"
    case 'brown':
      return "Braune Tonne"      
    case 'wertstoff':
      return "Wertstoff Tonne"
    default:
      return subject
  }
}

const checkForError = (statusCode, contentType) => {
    if (statusCode !== 200) {
    return new Error(`Request Failed.\n` + `Status Code: ${statusCode}`)
  } else if (!/^application\/json/.test(contentType)) {
    return new Error(`Invalid content-type.\n` + `Expected application/json but received ${contentType}`)
  }
  return false
}

const parseStreetCodeResponseData = (rawData, plz, cb) => {
  try {
    let parsedData = JSON.parse(rawData);
    parsedData.data.forEach(function (item) {
      if (item.zipcode == plz) cb(null, item)
    })
  } catch (e) {
    cb(e.message, null);
  }
}

const parseCollectionEventsResponseData = (rawData, cb) => {
  try {
    let parsedData = JSON.parse(rawData);
      parsedData.data.forEach((item) => {
        var event = new icalendar.VEvent(uuid.v4())
        event.setSummary(tranformSubject(item.type))
        event.setDate(new Date(item.year,item.month-1,item.day,6,0,0), 60*60)
        ical.addComponent(event)
      })
      cb(null, ical.toString())
  } catch (e) {
    cb(e.message, null);
  }
}

const getStreetCode = (street_name, building_number, building_number_addition, plz, cb) => {
  if (!building_number_addition) building_number_addition = ''
  let streetCodeApiEndpoint = `https://www.awbkoeln.de/api/streets?street_name=${street_name}&building_number=${building_number}&building_number_addition=${building_number_addition}&form=json`
  http.get(streetCodeApiEndpoint, (res) => {
    let error = checkForError(res.statusCode, res.headers['content-type'])
    if (error) {
      res.resume()
      cb(error, null)
      return;
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk)
    res.on('end', () => parseStreetCodeResponseData(rawData, plz, cb))
  })
}

const getCollectionEvents = (street_code, building_number, building_number_addition, year, cb) => {
  if (!building_number_addition) building_number_addition = ''  
  let collectionEventsApiEndpoint = `https://www.awbkoeln.de/api/calendar?building_number=${building_number}&street_code=${street_code}&start_year=${year}&end_year=${year}&start_month=1&end_month=12&building_number_addition=${building_number_addition}&form=json`
  http.get(collectionEventsApiEndpoint, (res) => {
    let error = checkForError(res.statusCode, res.headers['content-type'])
    if (error) {
      res.resume()
      cb(error, null)
      return;
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk)
    res.on('end', () => parseCollectionEventsResponseData(rawData, cb))
  })
}

module.exports = (street, building_number, year, plz, building_number_addition, cb) => {
  if (!cb && typeof building_number_addition === 'function') {
    cb = building_number_addition
    building_number_addition = ''
  }
  getStreetCode(street, building_number, building_number_addition, plz, (err, data) => {
    if (err) return cb(err, null)
    getCollectionEvents(data.street_code, data.building_number, building_number_addition, year, (err, data) => {
      cb(err, data)
    })
  })
}

