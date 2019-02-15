
export default class KanbanAction {

    constructor(dispatcher) {
        this.dispatcher = dispatcher
        this.dispatcher.on('setBoardFromWBS', this.setBoardFromWBS.bind(this))
        this.initAction()
    }
    initAction() {
        const entity = {
            store: {
                board: [],
            }
        }
        this.dispatcher.emit('setStore', entity)
    }
    clear() {
        const payload = {
            board: []
        }
        this.setStore(payload)
    }
    getStore() {
        return this.dispatcher.emit('getStore')
    }
    getBoard(payload) {
        return this.getStore().board
    }
    setStore(payload) {
        const entity = {
            store:{
                board:payload.board
            }
        }
        this.dispatcher.emit('setStore', entity)
        this.dispatcher.emit('update')
    }
    setBoard(payload) {
        console.log('----- setBoard -----')
        console.log(payload)
        const entity = {
            store: {
                'board': payload.board
            }
        }
        this.dispatcher.emit('setStore', entity)
        this.dispatcher.emit('update')
    }
    setBoardFromWBS(payload) {
        this.clear()
        this.setBoard(payload)
    }
}