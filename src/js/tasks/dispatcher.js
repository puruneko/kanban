
export default class Dispatcher {
    constructor() {
        this.handlers = {}
    }
    on(id, _handler){
        this.handlers[id] = _handler
        console.log(this.handlers)
    }
    emit(id, entity){
        return this.handlers[id](entity)
    }
}
