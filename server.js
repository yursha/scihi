const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('db')

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

function db_all(query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(error)
      else resolve(rows)
    })
  })
}

function db_run(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, err => {
      if (err) reject(error)
      else resolve(this.lastID)
    })
  })
}

app.post('/list-items', async (req, res) => {
  const rows = await db_all(`
    SELECT items.rowid id, items.*, GROUP_CONCAT(tags.name) tags
      FROM items
      LEFT JOIN items_tags on items.rowid=items_tags.item_id
      LEFT JOIN tags on tags.rowid=items_tags.tag_id GROUP by items.rowid
  `)
  res.send(rows)
})

app.post('/add-item', async (req, res) => {
  const item = req.body
  console.log('Adding item', item)
  const id = await db_run(
    'INSERT INTO items (date,author,name,description) VALUES (?,?,?,?)',
    [item.date, item.author, item.name, item.description]
  )
  return res.send({id, ...item})
})

app.post('/update-item', async (req, res) => {
  const item = req.body
  console.log('Updating item', item)
  await db_run(
    'UPDATE items SET date = ?, author = ?, name = ?, description = ? WHERE rowid = ?',
    [item.date, item.author, item.name, item.description, item.id]
  )
  return res.send({ status: 'ok' })
})

app.post('/delete-item', async (req, res) => {
  const itemId = req.body.itemId
  await db_run('DELETE FROM items WHERE rowid=?', [itemId])
  return res.send({})
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
