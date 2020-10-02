const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.post('/list-items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => res.send(rows))
})

app.post('/add-item', (req, res) => {
  const item = req.body
  db.run('INSERT INTO items (date,author,name,description) VALUES (?,?,?,?)',
         item.date, item.author, item.name, item.description,
    err => {
      if (err) {
        console.log('Error', err)
        return res.send({})
      }
      console.log(this)
      res.send({id: this.lastID, ...item})
    }
  )
})

app.post('/update-item', (req, res) => {
  res.send('Hello World!')
})

app.post('/delete-item', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})