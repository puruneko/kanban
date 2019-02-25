// https://github.com/SimulatedGREG/electron-vue/blob/99f044896bf3add09d072e9f278ef9d8380337f4/docs/ja/savingreading-local-files.md

import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import dbdata from './testDB.json'

export default function(path) {
  console.log(path)
  var db = new Datastore()
  db.insert(dbdata)
  db.find({}, (error, docs) => {
    console.log("---- db find ----")
    if (error) console.log(error)
    console.log(docs)
    console.log("--------")
  })
  return db
}

