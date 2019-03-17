// https://github.com/SimulatedGREG/electron-vue/blob/99f044896bf3add09d072e9f278ef9d8380337f4/docs/ja/savingreading-local-files.md

import Datastore from 'nedb'

export default function(json_data) {
  //const dbdata = JSON.parse(dbdata_raw)
  const dbdata = JSON.parse(json_data)

  var db = new Datastore()
  const promise = new Promise((resolve, reject) => {
    db.insert(dbdata, (err,ins) => {
      if (err) {
        console.error("init insert error")
      }
      else {
        console.log('init insert finished', ins)
      }
    })
    resolve(db)
  })
  return promise
}

