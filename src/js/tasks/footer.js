import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default class Footer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            height: props.height,
            'text':'FOOTER!'
        }
    }
    render() {
        const params = {
            footer: {
                style: {
                    flexGrow: 1,
                }
            },
            typography: {
                style: {
                    'flex': 1,
                }
            },
            appBar: {
                style: {
                    height: this.state.height,
                    boxShadow: '0 0',
                    padding: '0 0 0 0',
                    margin: '0 0 0 0',
                }
            }
        }
        return (
            <div style={params.footer.style}>
                <AppBar position="static" style={params.appBar.style}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" style={params.typography.style}>
                            {this.state.text}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}