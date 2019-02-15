import React from 'react'
import ReactAddon from 'react'
import ReactDOM from 'react-dom'
import Header from './header'
import Footer from './footer'

export default class Root extends React.Component{

    constructor(props){
        super(props)
    }
    render() {
        
        const rootDOM = (
            <div className="root">
                <header className="header">
                    <Header />
                </header>
                <div className="main">
                    <a href="./tasks.html">tasks</a>
                </div>
                <footer className="footer">
                    <Footer />
                </footer>
            </div>
        )

        return rootDOM
    }
}
