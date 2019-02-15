import React from 'react'
import ReactDOM from 'react-dom'
import jQuery from 'jquery'
//import {ContextMenu, MenuItem, ContextMenuTrigger} from 'react-contextmenu'
import WBSAction from './WBS_action'
import WBSStore from './WBS_store'

export default class WBS extends React.Component {

    constructor(props) {
        super(props)
        this.store = new WBSStore(props.WBS_dispatcher)
        this.action = new WBSAction(props.WBS_dispatcher, props.Kanban_dispatcher)
        this.state = {
            wbs: this.action.getTree(),
            contextMenu: this.action.getContextMenu()
        }
        this.init_treejs()  
    }
    init_treejs() {
        const customMenuControll = (node) =>
        {
            let items = {}
            this.state.contextMenu.forEach(menu => {
                items[menu] = {
                    'label': menu,
                    'action': () => {
                        this.action.rightClick({
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
    render() {
        // jstree-default-responsive
        return (
            <div className="wbs_tree">
                <div id="jstree">
                    <NodeTree node={this.state.wbs}/>
                </div>
            </div>
        )
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
        return (
            <ul key={this.state.abspath + '/ul'}>
                {
                    this.state.node.map( node => {
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
        console.log(this.state)
        console.log(this.state.node)
    }
    onClickHandler(e, data) {
        this.action.leftClick(data)
    }
    render() {
        if (this.state.node.children && this.state.node.children.length != 0) {
            return (
                <li key={this.state.abspath + '/li'} id={this.state.abspath}>
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
                <li key={this.state.abspath + '/li'} id={this.state.abspath}>
                    {this.state.node.name}
                </li>
            )
        }
    }
}