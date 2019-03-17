
export default class WBSAction {

    constructor(Root_dispatcher, WBS_dispatcher, Kanban_dispatcher) {
        this.toRoot = Root_dispatcher
        this.toWBS = WBS_dispatcher
        this.toKanban = Kanban_dispatcher

        this.toWBS.on('redraw', this.redraw.bind(this))
        this.toWBS.on('reloadTree', this.reloadTree.bind(this))
        this.toWBS.on('leftClick', this.leftClick.bind(this))
        this.toWBS.on('rightClick', this.rightClick.bind(this))
    }
    // WBSの再描写処理
    redraw() {
        const entity = {
            store: {
                tree: this.toWBS.emit('getTree'),
                contextMenu: this.toWBS.emit('getContextMenu'),
            }
        }
        console.log('----- reload tree -----')
        console.log(entity.store.tree)
        this.toWBS.emit('setStore', entity)
    }
    // ツリーのリロード
    reloadTree() {
        var treeData = this.toRoot.emit('getTree')
        this.toWBS.emit('setTree', treeData)
    }
    insert(payload) {
        if (payload.path) {
            if (payload.name) {
                this.toWBS.emit('insert', payload)
            }
        }
    }
    leftClick(payload) {
        console.log(payload.name)
    }
    rightClick(payload) {
        console.log('rightClick received')
        const name = payload.name
        switch (name) {
            case 'loadKanban':
                console.log('loadKanban', payload.node)
                this.rightClick_loadKanban(payload.node.id)
                break
            case 'test':
                console.log('rightClick test')
                break
            default:
                console.log('不明なrightClick')
                break
        }
    }
    rightClick_loadKanban(treeid) {
        console.log('DEBUG', this.toRoot.chain.dbg())
        const dbPromise = this.toRoot.emit('getKanbanDb', parseInt(treeid))
        dbPromise.then((db) => {
            this.toKanban.emit('setId', treeid)
            this.toKanban.emit('setKanbanDb', db)
            this.toKanban.emit('redraw')
        })
    }
}




/*
        const board = [
            {
                'name':'To Do',
                'color': '#4A9FF9',
                'items':
                    [
                        {
                            name: 'りんご',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'いちご',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'ばなな',
                            contents: 'タスクの詳細\n'
                        },
                    ]
            },
            {
                'name':'Doing',
                'color': '#f9944a',
                'items':
                    [
                        {
                            name: 'つくえ',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'いす',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'たな',
                            contents: 'タスクの詳細\n'
                        },
                    ]
            },
            {
                'name':'onReview',
                'color': '#000000',
                'items':
                    [
                        {
                            name: 'しょうゆ',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'ごま油',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'オリーブオイル',
                            contents: 'タスクの詳細\n'
                        },
                    ]
            },
            {
                'name':'Done',
                'color': '#2ac06d',
                'items':
                    [
                        {
                            name: 'きゅうり',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'とまと',
                            contents: 'タスクの詳細\n'
                        },
                        {
                            name: 'にんじん',
                            contents: 'タスクの詳細\n'
                        },
                    ]
            },
        ] */