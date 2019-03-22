import React from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import {indigo, pink, red} from '@material-ui/core/colors/blue'
import RootAction from './root_action'
import RootStore from './root_store'
import Header from './header'
import WBS from './wbs_view'
import Kanban from './kanban_view'
import Footer from './footer'
import Dispatcher from './dispatcher'
import { Drawer } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

export default class Root extends React.Component{

    constructor(props){
        super(props)
        this.toRoot = new Dispatcher('root')
        this.toWBS = new Dispatcher('WBS')
        this.toKanban = new Dispatcher('kanban')
        this.Action = new RootAction(this.toRoot,this.toWBS,this.toKanban)
        this.Store = new RootStore(this.toRoot)

        this.naviWidth = '25vw'
        this.state = {
            showWBS: false,
        }

        this.onClick = this.onClickHandler.bind(this)
        this.onClose = this.onCloseHandler.bind(this)
    }
    onClickHandler() {
        console.log('onClickHandler')
        this.setState({showWBS: true})
    }
    onCloseHandler() {
        console.log('onCloseHandler')
        this.setState({showWBS: false})
    }
    render() {
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
        return (
            <div>
                <Grid container
                    direction='column'
                    justify='center'
                    alignItems='stretch'
                >
                    <Grid item>
                        <header>
                            <Header Root_dispatcher={this.toRoot} WBS_dispatcher={this.toWBS} />
                        </header>
                    </Grid>

                    <Grid item>
                        <div>
                            <Kanban Root_dispatcher={this.toRoot} Kanban_dispatcher={this.toKanban}/>
                        </div>
                    </Grid>
                    <Grid item>
                        <footer className="footer">
                            <Footer />
                        </footer>
                    </Grid>
                </Grid>
                <Drawer open={this.state.showWBS} onClose={this.onClose}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.onClose}
                        onKeyDown={this.onClose}
                    >
                        <WBS key={`WBS/${this.showWBS}`} Root_dispatcher={this.toRoot} WBS_dispatcher={this.toWBS} Kanban_dispatcher={this.toKanban}/>
                    </div>
                </Drawer>
            </div>
        )
    }
}
