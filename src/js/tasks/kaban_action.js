import { FormLabel } from "@material-ui/core";

// ~~Query系はDBに対しての操作 -> 初期設定に使う
// ~~FromPageは現在のページに対しての操作 -> アップデート／セーブに使う

export default class KanbanAction {

    constructor(Kanban_dispatcher) {
        this.toKanban = Kanban_dispatcher
        this.toKanban.on('getMetaQuery', this.getMetaQuery.bind(this))
        this.toKanban.on('getLaneTagQuery', this.getLaneTagQuery.bind(this))
        this.toKanban.on('getNormalTagQuery', this.getNormalTagQuery.bind(this))
        this.toKanban.on('getCardsQuery', this.getCardsQuery.bind(this))
        this.toKanban.on('findTagQuery', this.findTagQuery.bind(this))
    }
    getKanbanDb() {
        return this.toKanban.emit('getKanbanDb')
    }
    findPromise(db, condition) {
        const promise = new Promise((resolve, reject) => {
            db.find(condition, (err,docs) => {
                resolve({err: err, docs, docs})
            })
        })
        return promise
    }
    getMetaQuery() {
        const kanbanDb = this.getKanbanDb()
        if (kanbanDb === undefined) {
            console.log('getMetaQuery', 'DB is undefined!')
            return undefined
        }
        const metaPromise = () => {
            return new Promise((resolve, reject) => {
                const p = this.findPromise(kanbanDb, {'type':'meta'})
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
        const promise = new Promise((resolve, reject) => {
            metaPromise().then((meta) => {
                var metaList = {}
                meta.forEach((m) => {
                    metaList[m.kind] = m.value
                })
                resolve(metaList)
            })
        })
        return promise
    }
    getLaneTagQuery() {
        const kanbanDb = this.getKanbanDb()
        if (kanbanDb === undefined) {
            console.log('getCardsQuery', 'DB is undefined!')
            return undefined
        }
        // cardをゲット
        const lanePromise = () => {
            return new Promise((resolve, reject) => {
                const p = this.findPromise(kanbanDb, {'type': 'tag', 'kind': 'lane'})
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
        const promise = new Promise((resolve, reject) => {
            lanePromise().then((lanes) => resolve(lanes))
        })
        return promise
    }
    getNormalTagQuery() {
        const kanbanDb = this.getKanbanDb()
        if (kanbanDb === undefined) {
            console.error('getCardsQuery', 'DB is undefined!')
            return undefined
        }
        // cardをゲット
        const lanePromise = () => {
            return new Promise((resolve, reject) => {
                const p = this.findPromise(kanbanDb, {'type': 'tag', 'kind': 'tag'})
                p.then((res) => {
                    if (!res.err) {
                        resolve(res.docs)
                    }
                    else {
                        reject(res.err)
                    }
                })
            })
        }
        const promise = new Promise((resolve, reject) => {
            lanePromise()
                .then((lanes) => resolve(lanes))
                .catch((e) => {
                    reject(e)
                })
        })
        return promise
    }
    getCardsQuery() {
        const kanbanDb = this.getKanbanDb()
        if (kanbanDb === undefined) {
            console.log('getCardsQuery', 'DB is undefined!')
            return undefined
        }
        // cardをゲット
        const cardPromise = (lane) => {
            return new Promise((resolve, reject) => {
                    const p = this.findPromise(kanbanDb, {'type':'card', 'label': {$elemMatch: lane.Id}})
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
            this.getLaneTagQuery()
                .then((lanes) => cardsPromise(lanes))
                .then((kanban) => resolve(kanban))
        })
        return promise
    }
    findTagQuery(tagId) {
        const kanbanDb = this.getKanbanDb()
        if (kanbanDb === undefined) {
            console.log('getMetaQuery', 'DB is undefined!')
            return undefined
        }
        const tagPromise = () => {
            return new Promise((resolve, reject) => {
                const p = this.findPromise(kanbanDb, {'type':'tag', 'Id':tagId})
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
        const promise = new Promise((resolve, reject) => {
            tagPromise().then((tag) => resolve(tag))
        })
        return promise
    }
    setCardQuery(newStateCard) {
        // TODO:書く
    }
    getKanbanFromPage(page) {
        // TODO:書く
    }
 }