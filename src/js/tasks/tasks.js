import React from 'react'
import ReactDOM from 'react-dom'
import Root from './root'
import db_dispatcher from './db_dispatcher'

const dbpath = "./testDB.json"
var db = db_dispatcher(dbpath)
db.find({}, (error, docs) => {
  console.log("---- db find ----")
  if (error) console.log(error)
  console.log(docs)
  console.log("--------")
})

ReactDOM.render(<Root />, document.getElementById('app'))
