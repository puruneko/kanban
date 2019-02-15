import React from 'react'
import ReactDOM from 'react-dom'

export default class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {'text':'HEADER!'}
    }
    render() {
        return (<p>{this.state.text}</p>)
    }
}