
export default class WBSStore {

    constructor(WBS_dispatcher) {
        this.store = {
            contextMenu: [
                'loadKanban',
                'test',
            ],
            tree: []
        }
        this.toWBS = WBS_dispatcher
        this.toWBS.on('setStore', this.setStore.bind(this))
        this.toWBS.on('getStore', this.getStore.bind(this))
        this.toWBS.on('setTree', this.setTree.bind(this))
        this.toWBS.on('getTree', this.getTree.bind(this))
        this.toWBS.on('setContextMenu', this.setContextMenu.bind(this))
        this.toWBS.on('getContextMenu', this.getContextMenu.bind(this))
        /*
        this.toWBS.on('setNode', this.setNode.bind(this))
        this.toWBS.on('insert', this.insert.bind(this))
        */
    }
    /*
    access(root, path) {
        const path_arr = path.split('/')
        let now = this.store[root]
        path_arr.forEach(name => {
            now = now[name]
        })
        return now
    }
    */
    getStore() {
        return this.store
    }
    setStore(entity){
        this.store = entity.store
        this.toWBS.emit('update')
    }
    getTree() {
        if (this.store.tree.length == 0) {
            this.toWBS.emit('reloadTree')
        }
        return this.store.tree
    }
    setTree(treeData) {
        this.store.tree = treeData
        this.toWBS.emit('update')
    }
    getContextMenu() {
        return this.store.contextMenu
    }
    setContextMenu(contextMenu) {
        this.store.contextMenu = contextMenu
    }
    /*
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
    */
}