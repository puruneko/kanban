
export default class WBSStore {

    constructor(dispatcher) {
        this.store = {}
        this.dispatcher = dispatcher
        this.dispatcher.on('setStore', this.setStore.bind(this))
        this.dispatcher.on('getStore', this.getStore.bind(this))
        this.dispatcher.on('setNode', this.setNode.bind(this))
        this.dispatcher.on('insert', this.insert.bind(this))
    }
    access(root, path) {
        const path_arr = path.split('/')
        let now = this.store[root]
        path_arr.forEach(name => {
            now = now[name]
        })
        return now
    }
    getStore() {
        return this.store
    }
    setStore(entity){
        this.store = entity.store
    }
    //TODO:書く
    setNode(entity){
        console.log('setNode')
    }
    insert(entity) {
        target = this.access('tree', entity.path)
        target.children.push({
            name: entity.name,
            children: []
        })
    }
}