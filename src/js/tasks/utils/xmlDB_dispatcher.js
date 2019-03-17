// https://github.com/SimulatedGREG/electron-vue/blob/99f044896bf3add09d072e9f278ef9d8380337f4/docs/ja/savingreading-local-files.md

import xml_js from 'xml-js'
import filesystem from './filesystem_dispatcher'
import db_dispatcher from './db_dispatcher'


export default class xmlDB {

  constructor(path) {
    this.xmlDoc = filesystem(path)
    const parser = new DOMParser()
    this.xmlDom = parser.parseFromString(this.xmlDoc, 'text/xml')
    console.log(this.xmlDom)
  }

  simpleXPath(xpath, resultType) {
    if (resultType === undefined) {
      resultType = XPathResult.STRING_TYPE
    }
    console.log('simpleXpath', xpath, resultType)
    return this.xmlDom.evaluate(xpath, this.xmlDom, null, resultType, null)
  }
  getTreeJson(treeObjectNode) {
    var tree = []
    const children = treeObjectNode.children
    for (var i = 0; i < children.length; i++){
      var ch = children[i]
      var c = {name: ch.attributes.name.value, id: ch.attributes.id.value, children: []}
      var chch = this.getTreeJson(ch)
      if (chch.lenght != 0) {
        c.children = chch
      }
      else {
        c.children = undefined
      }
      tree.push(c)
    }
    return tree
  }
  getTree() {
    const treeData = this.simpleXPath(`//treeObject`, XPathResult.FIRST_ORDERED_NODE_TYPE)
    console.log('treeData', treeData)
    var treeDict = this.getTreeJson(treeData.singleNodeValue)
    return treeDict
  }
  getKanbanDb(treeid) {
    const dbJsonData = this.simpleXPath(`//contentsObject/contents[@idFor='${treeid}']`).stringValue
    console.log('dbJsonData', dbJsonData)
    return db_dispatcher(dbJsonData)
  }

}