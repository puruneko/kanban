import React from 'react'
import ReactDOM from 'react-dom'

export default class Footer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {'text':'FOOTER!'}
    }
    render() {
        return (<p>{this.state.text}</p>)
    }
}