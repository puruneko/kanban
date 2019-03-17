import React from 'react'
import ReactDOM from 'react-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


export default class Header extends React.Component {

    constructor(props) {
        super(props)
        this.toRoot = props.Root_dispatcher
        this.toWBS = props.WBS_dispatcher
        this.state = {
          'menu': null,
          'text':'HEADER!'
        }
        this.onClick = this.handleClick.bind(this)
        this.onClose = this.handleClose.bind(this)
        this.dbLoader = this.handleDbLoader.bind(this)
    }
    handleClick(event) {
        this.setState({menu:event.currentTarget})
    }
    handleClose() {
        this.setState({menu:null})
    }
    handleDbLoader(evt) {
        var file = evt.target.files[0]
        console.log(file.path)
        this.toRoot.emit('loadSettings', file.path)
        console.log(this.toWBS.listup())
        this.toWBS.emit('redraw')
        this.onClose()
    }
    render() {
        const header = {
            'style': {
                flexGrow: 1,
            }
        }
        const iconButton = {
            'style': {
                marginLeft: -12,
                marginRight: 20,
            },
            'color': 'inherit',
        }
        const typography = {
            'style': {
                'flex': 1,
            }
        }
        return (
            <div style={header.style}>
                <AppBar position="static">
                    <Toolbar>
                        <div>
                            <Button
                              aria-owns={this.state.menu ? 'simple-menu' : undefined}
                              aria-haspopup="true"
                              onClick={this.onClick}
                            >
                                <MenuIcon />
                            </Button>
                            <Menu
                              id="simple-menu"
                              anchorEl={this.state.menu}
                              open={Boolean(this.state.menu)}
                              onClose={this.onClose}
                            >
                              <MenuItem>
                                <input id="icon_button_file" type="file" onChange={this.dbLoader} style={{display: "none"}}/>
                                <label htmlFor="icon_button_file">
                                    Import Data
                                </label>
                              </MenuItem>
                              <MenuItem onClick={this.onClose}>Test Menu1</MenuItem>
                              <MenuItem onClick={this.onClose}>Test Menu2</MenuItem>
                            </Menu>
                        </div>
                        <Typography variant="title" color="inherit" style={typography.style}>
                            {this.state.text}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}