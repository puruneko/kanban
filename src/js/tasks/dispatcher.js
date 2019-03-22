
// 呼び出し方
// dispatcher.emit(id, arg)
// dispatcher.chain.id(arg)

export default class Dispatcher {
    constructor(whoami) {
        this.whoami = whoami
        this.chain = {}
    }
    on(id, _handler){
        this.chain[id] = _handler
        console.log('register handler --->', this.whoami, id)
    }
    emit(id, entity){
        if (id in this.chain) {
            return this.chain[id](entity)
        }
        else {
            throw new Error(`${id} is not found in dispatcher.(entity: ${entity})`)
        }
    }
    listup(){
        return this.chain
    }
}
