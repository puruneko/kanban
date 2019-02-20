//import Sqlite from 'sqlite3-offline'

import path from 'path'
const a = path.join(__dirname, 'aaaa')
const sqlite3 = require('sqlite3').verbose()
 
export default function db_test() {
  
  var db = new sqlite3.Database('sample.sqlite')

  var selectTest = ((condition) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all('select * from test where id > $id',
          {$id: condition.id},
          ((err, res) => {
            if (err) return reject(err)
            resolve(res)
          })
        )
      })
    })
  })

  var condition = {
    id: '5'
  }

  selectTest(condition).then((res) => {
    console.log('Success:', res)
  }).catch((err) => {
    console.log('Failure:', err)
  })

}
