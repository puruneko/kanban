import React from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import {indigo, pink, red} from '@material-ui/core/colors/blue'
import Header from './header'
import WBS from './wbs_view'
import Kanban from './kanban_view'
import Footer from './footer'
import Dispatcher from './dispatcher'
import { Drawer } from '@material-ui/core'

export default class Root extends React.Component{

    constructor(props){
        super(props)
        this.toWBS = new Dispatcher()
        this.toKanban = new Dispatcher()
        this.naviWidth = '25vw'
        this.state = {
            showWBS: true,
        }
        this.theme = createMuiTheme({
            palette: {
              primary: indigo,
              secondary: pink,
              error: red,
              contrastThreshold: 3,
              tonalOffset: 0.2,
            },
        })
    }
    getHeaderTheme(theme) {
        return {
            position: 'absolute',
            transition: theme.transitions.create(['margin','width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        }
    }
    render() {
        /*
        const styles = {
            root: {
              flexGrow: 1,
            },
            appFrame: {
              height: 430,
              zIndex: 1,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              width: '100%',
            },
            appBar: {
              position: 'absolute',
              transition: this.theme.transitions.create(['margin', 'width'], {
                easing: this.theme.transitions.easing.sharp,
                duration: this.theme.transitions.duration.leavingScreen,
              }),
            },
            appBarShift: {
              width: `calc(100% - ${drawerWidth}px)`,
              transition: this.theme.transitions.create(['margin', 'width'], {
                easing: this.theme.transitions.easing.easeOut,
                duration: this.theme.transitions.duration.enteringScreen,
              }),
            },
            'appBarShift-left': {
              marginLeft: drawerWidth,
            },
            'appBarShift-right': {
              marginRight: drawerWidth,
            },
            menuButton: {
              marginLeft: 12,
              marginRight: 20,
            },
            hide: {
              display: 'none',
            },
            drawerPaper: {
              position: 'relative',
              width: drawerWidth,
            },
            drawerHeader: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '0 8px',
              //...theme.mixins.toolbar,
            },
            content: {
              flexGrow: 1,
              backgroundColor: this.theme.palette.background.default,
              padding: this.theme.spacing.unit * 3,
              transition: this.theme.transitions.create('margin', {
                easing: this.theme.transitions.easing.sharp,
                duration: this.theme.transitions.duration.leavingScreen,
              }),
            },
            'content-left': {
              marginLeft: -drawerWidth,
            },
            'content-right': {
              marginRight: -drawerWidth,
            },
            contentShift: {
              transition: this.theme.transitions.create('margin', {
                easing: this.theme.transitions.easing.easeOut,
                duration: this.theme.transitions.duration.enteringScreen,
              }),
            },
            'contentShift-left': {
              marginLeft: 0,
            },
            'contentShift-right': {
              marginRight: 0,
            },
          }
        */
       /*
        return (
            <div className="root">
                <header>
                    <Header />
                </header>
                <div className="main">
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        open={this.state.showWBS}
                        style={{'position':'relative','width':this.naviWidth}}
                    >
                        <div className="wbs_container">
                            <WBS theme={this.theme} WBS_dispatcher={this.toWBS} Kanban_dispatcher={this.toKanban}/>
                        </div>
                    </Drawer>
                    <div className="kanban_container">
                        <Kanban theme={this.theme} Kanban_dispatcher={this.toKanban}/>
                    </div>
                </div>
                <footer className="footer">
                    <Footer />
                </footer>
            </div>
        )
        */
        return (
            <div className="root">
                <header>
                    <Header />
                </header>
                <div className="main">
                    <div className="wbs_container">
                                <WBS style={{'position':'absolute', 'top':'0px'}} theme={this.theme} WBS_dispatcher={this.toWBS} Kanban_dispatcher={this.toKanban}/>
                    </div>
                    <div className="kanban_container">
                        <Kanban theme={this.theme} Kanban_dispatcher={this.toKanban}/>
                    </div>
                </div>
                <footer className="footer">
                    <Footer />
                </footer>
            </div>
        )
    }
    /*
    _____render() {
        return (
            <div className="root">
                <header className="header">
                    <Header />
                </header>
                <div className="main">
                    <nav className="wbs_container">
                        <WBS theme={this.theme} WBS_dispatcher={this.toWBS} Kanban_dispatcher={this.toKanban}/>
                    </nav>
                    <div className="kanban_container">
                        <Kanban theme={this.theme} Kanban_dispatcher={this.toKanban}/>
                    </div>
                </div>
                <footer className="footer">
                    <Footer />
                </footer>
            </div>
        )
    }
    */
}
