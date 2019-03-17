
import xml_dispatcher from './utils/xmlDB_dispatcher'

export default class RootAction {

  constructor(root_dispatcher, WBS_dispatcher, Kanban_dispatcher) {
    this.toRoot = root_dispatcher
    this.toWBS = WBS_dispatcher
    this.toKanban = Kanban_dispatcher

    this.toRoot.on('loadSettings', this.loadSettings.bind(this))
    this.toRoot.on('getTree', this.getTree.bind(this))
    this.toRoot.on('getKanbanDb', this.getKanbanDb.bind(this))

    this.toRoot.on('dbg', this.dbg.bind(this))
  }

  loadSettings(path) {
    var xmlDb = new xml_dispatcher(path)
    this.toRoot.emit('setXmlDb', xmlDb)
  }
  getTree() {
    const xmlDb = this.toRoot.emit('getXmlDb')
    var treeJson = xmlDb.getTree()
    console.log(treeJson)
    return treeJson
  }
  getKanbanDb(treeid) {
    const xmlDb = this.toRoot.emit('getXmlDb')
    var kanbanDb = xmlDb.getKanbanDb(treeid)
    return kanbanDb
  }
  dbg() {
    return 'DEBUG, root_action.dbg'
  }
}