const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../db')
const data = require('./data')

function process(year, events) {
  console.log(year)
  for (let event of events) {
    //console.log(year + '-01-01', event.authors, event.title, event.description)
    db.run('INSERT INTO items (date,author,name,description) VALUES (?,?,?,?) on conflict do nothing',
           year + '-01-01', event.authors, event.title, event.description,
      err => {
        if (err) {
          console.log('Error', err)
          return res.send({})
        }
      }
    )
  }
}

const years = Object.keys(data)
years.sort()
for (let year of years) {
  console.log('processing year', year)
  process(year, data[year])
}

/*
Object.keys(data).forEach(year => process(year, data[year]))
*/
