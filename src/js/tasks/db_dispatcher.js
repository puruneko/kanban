// https://github.com/SimulatedGREG/electron-vue/blob/99f044896bf3add09d072e9f278ef9d8380337f4/docs/ja/savingreading-local-files.md

import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import child_process from "child_process"
var fs = remote.require('fs')


const toWindowsPath = (path) => {
  return path.replace(/\//g, '\\')
}

const toUnc = (server) => {
  return `//${server}`
}

const toUncPath = (server, share) => {
  return toWindowsPath(`${toUnc(server)}/${share}`)
}

const getUncPath = (_path) => {
  var unc_root = path.parse(_path).root
  const dirname = path.dirname(_path)
  const unc_path = dirname.replace(unc_root, "")
  unc_root = unc_root.replace(/^[/][/](.*?)[/]$/, "$1")
  return toUncPath(unc_root, unc_path)
}

export default function(dbpath) {
  const msg = child_process.execSync('net use * ' + getUncPath(dbpath)).toString()
  const letter = /([A-Z]):/.exec(msg)[0]
  const newpath = path.join(letter, path.basename(dbpath))
  const dbdata = JSON.parse(fs.readFileSync(newpath).toString())
  // /yオプションで強制アンマウント
  child_process.execSync('net use ' + letter +' /delete' + ' /y')

  var db = new Datastore()
  db.insert(dbdata, (err,ins) => {
    if (err) {
      console.log("insert error")
    }
    else {
      console.log(ins)
    }
  })
  return db
}

