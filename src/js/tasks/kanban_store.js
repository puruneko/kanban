
export default class KanbanStore {

    constructor(dispatcher) {
        this.store = {}
        this.dispatcher = dispatcher
        this.dispatcher.on('getStore', this.getStore.bind(this))
        this.dispatcher.on('setStore', this.setStore.bind(this))
        this.dispatcher.on('setBoard', this.setBoard.bind(this))
    }
    getStore() {
        return this.store
    }
    setStore(entity) {
        this.store = entity.store
    }
    setBoard(entity) {
        this.store.board = entity.board
    }
}