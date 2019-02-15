import React from "react"
import ReactDOM from "react-dom"
import Button from "@material-ui/core/Button"

class App extends React.Component {
  render() {
    return (
        <Button variant="raised" color="primary">
        Hello World
        </Button>
    )
  }
}

ReactDOM.render(<App />, document.querySelector("#app"))
