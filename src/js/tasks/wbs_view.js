import React from 'react'
//import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu'

export default class WBS extends React.Component {

    constructor(props) {
        super(props)
        this.toRoot = props.Root_dispatcher
        this.toWBS = props.WBS_dispatcher
        this.toKanban = props.Kanban_dispatcher
        this.store = props.WBS_store
        this.action = props.WBS_action
        this.state = {
            tree: [],
            contextMenu: this.toWBS.emit('getContextMenu')
        }

        this.toWBS.on('update', this.update.bind(this))

        this.update()
    }
    // tree.jsの初期設定
    init_treejs() {
        const customMenuControll = (node) =>
        {
            let items = {}
            this.state.contextMenu.forEach(menu => {
                items[menu] = {
                    'label': menu,
                    'action': () => {
                        this.toWBS.emit('rightClick', {
                            'name': menu,
                            'node': node
                        })
                    }
                }
            })
            return items
        }
        
        $( () =>
        {
            // create an instance when the DOM is ready
            $('#jstree').jstree({
                'core': {
                    'themes': {
                        'responsive': true,
                        //'variant': 'large',
                        'stripes': true,
                    },
                    'check_callback': true,
                },
                'contextmenu': {
                    'items': customMenuControll.bind(this),
                },
                'plugins': [
                    'contextmenu',
                    'dnd',
                ],
            })
            // bind to events triggered on the tree
            $('#jstree').on("changed.jstree", (e, data) => {
                let selectedList = []
                data.selected.map( (s) => {
                    selectedList.push(data.instance.get_node(s).text)
                })
                console.log(selectedList)
            })
        })
    }
    // viewのアップデート
    update() {
        this.init_treejs()
        console.log('WBS update')
        this.setState(this.toWBS.emit('getStore'))
    }
    render() {
        if (this.state.tree.length != 0) {
            return (
                <div className="wbs_tree">
                    <div id="jstree">
                        <NodeTree key={this.state.tree.toString()} node={this.state.tree} />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div key={this.state.tree.toString()}></div>
            )
        }
    }
}

class NodeTree extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            abspath: 'jstree',
            node: props.node,
        }
    }
    render() {
        console.log('NodeTree', this.state.node)
        return (
            <ul key={this.state.abspath + '/ul'}>
                {
                    this.state.node.map( node => {
                        console.log('NodeTree', node)
                        const abspath = this.state.abspath + '/' + node.name
                        return (
                            <Node key={abspath + '/node'} node={node} abspath={abspath}/>
                        )
                    })
                }
            </ul>
        )
    }
}

class Node extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            abspath: props.abspath,
            node: props.node,
        }
        this.onClick = this.onClickHandler.bind(this)
        console.log('Node', this.state)
    }
    onClickHandler(e, data) {
        this.toWBS.emit('leftClick', data)
    }
    render() {
        if (this.state.node.children && this.state.node.children.length != 0) {
            return (
                <li key={this.state.abspath + '/li'} path={this.state.abspath} id={this.state.node.id}>
                    {this.state.node.name}
                    <ul key={this.state.abspath + '/ul'}>
                        {
                            this.state.node.children.map( child => {
                                const abspath = this.state.abspath + '/' + child.name
                                return (
                                    <Node key={abspath + '/node'} node={child} abspath={abspath}/>
                                )
                            })
                        }
                    </ul>
                </li>
            )
        }
        else {
            return (
                <li key={this.state.abspath + '/li'} path={this.state.abspath} id={this.state.node.id}>
                    {this.state.node.name}
                </li>
            )
        }
    }
}