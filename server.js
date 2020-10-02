const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.post('/list-items', (req, res) => {
  db.all('SELECT rowid as id,* FROM items', (err, rows) => res.send(rows))
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
  const item = req.body
  db.run('UPDATE items SET date = ?, author = ?, name = ?, description = ? WHERE rowid = ?',
         item.date, item.author, item.name, item.description, item.id,
    err => {
      if (err) {
        console.log('Error', err)
        return res.send({})
      }
      return res.send({})
    }
  )
})

app.post('/delete-item', (req, res) => {
  const itemId = req.body.itemId
  db.run('DELETE FROM items WHERE rowid=?', itemId,
    err => {
      if (err) {
        console.log('Error', err)
        return res.send({})
      }
      res.send({})
    }
  )
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
