import React from 'react'
import { createMuiTheme } from '@material-ui/core/styles'
import {indigo, pink, red} from '@material-ui/core/colors/blue'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'

import RootAction from './root_action'
import RootStore from './root_store'
import Header from './header'
import WBS from './wbs_view'
import WBSAction from './WBS_action'
import WBSStore from './WBS_store'
import Kanban from './kanban_view'
import KanbanStore from './kanban_store'
import KanbanAction from './kaban_action'
import Footer from './footer'
import Dispatcher from './dispatcher'

export default class Root extends React.Component{

    constructor(props){
        super(props)
        this.toRoot = new Dispatcher('root')
        this.toWBS = new Dispatcher('WBS')
        this.toKanban = new Dispatcher('kanban')
        this.Action = new RootAction(this.toRoot,this.toWBS,this.toKanban)
        this.Store = new RootStore(this.toRoot)

        this.WBS_store = new WBSStore(this.toWBS)
        this.WBS_action = new WBSAction(this.toRoot, this.toWBS, this.toKanban)
        this.kanban_store = new KanbanStore(this.toKanban)
        this.kanban_action = new KanbanAction(this.toKanban)

        this.naviWidth = '25vw'
        this.state = {
            showWBS: false,
        }

        this.onOpen = this.onOpenHandler.bind(this)
        this.onClose = this.onCloseHandler.bind(this)
        this.onClickDbLoadButton = this.onClickDbLoadButton.bind(this)

        this.toRoot.on('drawerOpen', this.onOpen)
    }
    onOpenHandler() {
        console.log('onOpenHandler')
        this.setState({showWBS: true})
    }
    onCloseHandler() {
        console.log('onCloseHandler')
        this.setState({showWBS: false})
        this.toKanban.emit('redraw')
    }
    onClickDbLoadButton(evt) {
        var file = evt.target.files[0]
        console.log(file.path)
        this.toRoot.emit('loadDatabase', file.path)
        this.toWBS.emit('redraw')
        this.onOpen()
    }
    componentWillMount() {
        //
        this.toRoot.emit('loadDatabase', 'C:\\Users\\Ryutaro\\Dropbox\\prog\\git\\github\\kanban\\src\\db_sample\\db_sample.xml')
        const dbPromise = this.toRoot.emit('getKanbanDb', 1)
        dbPromise.then((db) => {
            return new Promise((resolve, reject) => {
            this.toKanban.emit('setId', 1)
            this.toKanban.emit('setKanbanDb', db)
            //this.toKanban.emit('redraw')
            console.log('componentWillMount', db)
            resolve()
            })
        })
        .then(() => {
            this.setState({dummy: undefined})
            this.toKanban.emit('redraw')
            console.log('state', this.state)
        })
        //
    }
    render() {
        const navigatorHeight = 64
        const params = {
            top: {
                style: {
                    position: 'static',
                    width: '100%',
                    //height: 'auto !important',
                    height: '100%',
                    minHeight: '100%',
                    padding: '0 0 0 0',
                    margin: '0 0 0 0',
                }
            },
            header: {
                style: {
                    //position: 'static',
                    bottom: 0,
                    width: '100%',
                    height: navigatorHeight,
                }
            },
            kanban: {
                display: 'block',
                position: 'absolute',
                padding: '5 0',
            },
            footer: {
                style: {
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    height: navigatorHeight,
                }
            },
            drawerDiv: {
                style: {
                    width: '100%',
                    height: '100%',
                }
            }
        }
        /*
        return (
            <div className="root">
                <header>
                    <Header Root_dispatcher={this.toRoot} WBS_dispatcher={this.toWBS} />
                </header>
                <div className="main">
                    <div className="wbs_container">
                        <WBS style={{'position':'absolute', 'top':'0px'}} theme={this.theme} Root_dispatcher={this.toRoot} WBS_dispatcher={this.toWBS} Kanban_dispatcher={this.toKanban}/>
                    </div>
                    <div className="kanban_container">
                        <Kanban theme={this.theme} Root_dispatcher={this.toRoot} Kanban_dispatcher={this.toKanban}/>
                    </div>
                </div>
                <footer className="footer">
                    <Footer />
                </footer>
            </div>
        )
        */
        const WBS_View = (
            <WBS
                //key={`WBS/${this.showWBS}`}
                Root_dispatcher={this.toRoot}
                WBS_dispatcher={this.toWBS}
                Kanban_dispatcher={this.toKanban}
                WBS_store={this.WBS_store}
                WBS_action={this.WBS_action}
            />
        )
        return (
            <div style={params.top.style}>
                <Grid container
                    direction='column'
                    justify='center'
                    alignItems='stretch'
                    spacing={0}
                >
                    <Grid item>
                        <header style={params.header.style}>
                            <Header Root_dispatcher={this.toRoot} WBS_dispatcher={this.toWBS}/>
                        </header>
                    </Grid>
                    <Grid item>
                        <div id='kanbanContainer' style={params.kanban.style}>
                            <Kanban
                                Root_dispatcher={this.toRoot}
                                Kanban_dispatcher={this.toKanban}
                                kanban_action={this.kanban_action}
                                kanban_store={this.kanban_store}
                                navigatorHeight={navigatorHeight}
                            />
                        </div>
                    </Grid>
                    <Grid item>
                        <footer style={params.footer.style}>
                            <Footer height={navigatorHeight}/>
                        </footer>
                    </Grid>
                </Grid>
                <Drawer open={this.state.showWBS} onClose={this.onClose}>
                    <div
                        tabIndex={0}
                        role="button"
                        //onClick={this.onClose}
                        //onKeyDown={this.onClose}
                        style={params.drawerDiv.style}
                    >
                        <Grid container
                            direction='column'
                            justify='center'
                            alignItems='stretch'
                        >
                            <Grid item xs={12}>
                                <div style={{'height':50}}>
                                    <input key='dbLoadButton' id='dbLoadButton' type="file" onChange={this.onClickDbLoadButton} style={{display: "none"}}/>
                                    <label htmlFor='dbLoadButton'>Load Database</label>
                                </div>
                            </Grid>
                            <Divider variant='inset'/>
                            <Grid item xs={12}>
                                <p>test</p>
                                {WBS_View}
                            </Grid>
                        </Grid>
                    </div>
                </Drawer>
            </div>
        )
    }
}
