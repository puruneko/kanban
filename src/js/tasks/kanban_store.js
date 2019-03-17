
export default class KanbanStore {
  
  constructor(kanban_dispatcher) {
    this.toKanban = kanban_dispatcher
    this.store = {
      id: 0,
      kanbanDb: undefined
    }

    this.toKanban.on('getStore', this.getStore.bind(this))
    this.toKanban.on('setStore', this.setStore.bind(this))
    this.toKanban.on('getId', this.getId.bind(this))
    this.toKanban.on('setId', this.setId.bind(this))
    this.toKanban.on('getKanbanDb', this.getKanbanDb.bind(this))
    this.toKanban.on('setKanbanDb', this.setKanbanDb.bind(this))
  }
  getStore() {
    return this.store
  }
  setStore(store) {
    this.store = store
  }
  getId() {
    return this.store.id
  }
  setId(id) {
    this.store.id = id
  }
  getKanbanDb() {
    return this.store.kanbanDb
  }
  setKanbanDb(kanbanDb) {
    this.store.kanbanDb = kanbanDb
  }

}