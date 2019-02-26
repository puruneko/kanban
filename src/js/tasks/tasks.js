import React from 'react'
import ReactDOM from 'react-dom'
import Root from './root'
import db_dispatcher from './db_dispatcher'

const dbpath = 'U:/99_個人フォルダ/aritarut/testDB.json'//'//cafis/filesv/A-27_プリカ/10_プロジェクト/52_ブランドプリカセンタ更改/99_work/aritarut/01_管理/testDB.json'//
var db = db_dispatcher(dbpath)
db.find({}, (error, docs) => {
  console.log("---- db find ----")
  if (error) console.log(error)
  console.log(docs)
  console.log("--------")
})

ReactDOM.render(<Root />, document.getElementById('app'))
