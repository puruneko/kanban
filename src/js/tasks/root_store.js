
export default class RootStore {

  constructor(root_dispatcher) {
      this.store = {}
      this.toRoot = root_dispatcher
      this.toRoot.on('getStore', this.getStore.bind(this))
      this.toRoot.on('setStore', this.setStore.bind(this))
      this.toRoot.on('getXmlDb', this.getXmlDb.bind(this))
      this.toRoot.on('setXmlDb', this.setXmlDb.bind(this))
  }
  getStore() {
      return this.store
  }
  setStore(entity) {
      this.store = entity.store
  }
  getXmlDb() {
    return this.store.xmlDb
  }
  setXmlDb(xmlDb) {
    this.store.xmlDb = xmlDb
    console.log('store xmlDb', this.store.xmlDb)
  }
}