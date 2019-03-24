import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button'

import {MenuTemplateTypes, MenuTemplate} from './utils/menu_template'


export default class Header extends React.Component {

    constructor(props) {
        super(props)
        this.toRoot = props.Root_dispatcher
        this.toWBS = props.WBS_dispatcher
        this.state = {
            height: props.height,
            text: 'HEADER!'
        }
        this.dbLoader = this.handleDbLoader.bind(this)
        this.onOpen = this.handleOpen.bind(this)
    }
    handleDbLoader(evt) {
        var file = evt.target.files[0]
        console.log(file.path)
        this.toRoot.emit('loadSettings', file.path)
        this.toWBS.emit('redraw')
    }
    handleOpen() {
        this.toRoot.emit('drawerOpen')
    }
    render() {
        const params = {
            header: {
                style: {
                    flexGrow: 1,
                }
            },
            typography: {
                style: {
                    'flex': 1,
                }
            }
        }
        const menuList = [
            {
                type: MenuTemplateTypes.fileSelector,
                label: 'loadSettings',
                onClick: this.dbLoader,
            },
            {
                type: MenuTemplateTypes.label,
                label: 'testMenu1',
                onClick: () => {
                    console.log('testMenu1 is clicked!')
                }
            },
            {
                type: MenuTemplateTypes.label,
                label: 'testMenu2',
                onClick: () => {
                    console.log('testMenu2 is clicked!')
                }
            }
        ]
        const menuIcon = (
            <MenuIcon />
        )
        return (
            <div style={params.header.style}>
                <AppBar position="static">
                    <Toolbar>
                        <div>
                            {/*
                            <MenuTemplate name={'headerMenu'} icon={menuIcon} menuList={menuList} />
                            */}
                            <Button onClick={this.onOpen}>{menuIcon}</Button>
                        </div>
                        <Typography variant="title" color="inherit" style={params.typography.style}>
                            {this.state.text}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}