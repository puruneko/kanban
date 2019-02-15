import React from 'react'
import ReactDOM from 'react-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


export default class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {'text':'HEADER!'}
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
                        <IconButton style={iconButton.style} color={iconButton.color} aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="title" color="inherit" style={typography.style}>
                            {this.state.text}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}