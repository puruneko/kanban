import { FormLabel } from "@material-ui/core";

// ~~Query系はDBに対しての操作 -> 初期設定に使う
// ~~FromPageは現在のページに対しての操作 -> アップデート／セーブに使う

export default class KanbanAction {

    constructor(Kanban_dispatcher) {
        this.toKanban = Kanban_dispatcher
        this.toKanban.on('getCardsQuery', this.getCardsQuery.bind(this))
    }
    findPromise(db, condition) {
        const promise = new Promise((resolve, reject) => {
            db.find(condition, (err,docs) => {
                resolve({err: err, docs, docs})
            })
        })
        return promise
    }
    getCardsQuery() {
        const kanbanDb = this.toKanban.emit('getKanbanDb')
        if (kanbanDb === undefined) {
            console.log('getCardsQuery', 'DB is undefined!')
            return undefined
        }
        // cardをゲット
        const lanePromise = () => {
            return new Promise((resolve, reject) => {
                const p = this.findPromise(kanbanDb, {'type': 'lane'})
                p.then((res) => {
                    if (!res.err) {
                        resolve(res.docs)
                    }
                    else {
                        resolve([])
                    }
                })
            })
        }
        const cardPromise = (lane) => {
            return new Promise((resolve, reject) => {
                    const p = this.findPromise(kanbanDb, {'type':'card', 'label': {$elemMatch: lane.name}})
                    p.then((res) => {
                        if (!res.err) {
                            resolve({
                                name: lane.name,
                                laneOrder: lane.order,
                                color: lane.color,
                                items: res.docs
                            })
                        }
                        else {
                            resolve(undefined)
                        }
                    })
            })
        }
        const cardsPromise = (lanes) => {
            return new Promise((resolve, reject) => {
                var cardsPromiseArr = []
                lanes.forEach((lane) => {
                    cardsPromiseArr.push(cardPromise(lane))
                })
                const cardsPromiseAll = Promise.all(cardsPromiseArr)
                cardsPromiseAll.then((resArr) => {
                    var kanban = []
                    resArr.forEach((res) => {
                        if (res !== undefined) {
                            kanban.push(res)
                        }
                    })
                    const sortedKanban = kanban.sort((a,b) => {
                        if (a.laneOrder < b.laneOrder) return -1
                        if (a.laneOrder > b.laneOrder) return 1
                        return 0
                    })
                    resolve(sortedKanban)
                })
            })
        }
        const promise = new Promise((resolve, reject) => {
            lanePromise()
                .then((lanes) => cardsPromise(lanes))
                .then((kanban) => resolve(kanban))
        })
        return promise
        /*
        const boardColor = {'ToDo':'#4A9FF9','Doing':'#f9944a','underReview':'#2ac06d','Done':'#000000'}
        const board = []
        Object.keys(boardColor).forEach( (key) => {
            board.push({
                'name': key,
                'color': boardColor[key],
                'items': []
            })
        })
        target.tasks.forEach( task => {
            board.some( b => {
                if (b.name === task.stage) {
                    b.items.push(task)
                    return true
                }
            })
        })
        const entity = {
            'board': board
        }
        console.log('----- Boardをセットします -----')
        console.log(entity)
        this.toKanban.emit('setBoardFromWBS', entity)
        */
    }
    setCardQuery(newStateCard) {
        // TODO:書く
    }
    getKanbanFromPage(page) {
        // TODO:書く
    }
 }