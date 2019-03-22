import React from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export const MenuTemplateTypes = {
  'label': 1,
  'fileSelector': 2
}

export class MenuTemplate extends React.Component{

  constructor(props) {
    super(props)
    this.name = props.name
    this.icon = props.icon
    this.onClick = props.onClick ? props.onClick : this.onClick.bind(this)
    this.onClose = props.onClose ? props.onClose : this.onClose.bind(this)
    this.menuList = props.menuList
    this.state = {
      selectedMenu: null
    }
  }
  onClick(event) {
    this.setState( {selectedMenu: event.currentTarget} )
  }
  onClose() {
    this.setState( {selectedMenu: null} )
  }

  render() {
    return (
        <div>
          <Button
            aria-owns={this.state.selectedMenu ? this.name : undefined}
            aria-haspopup="true"
            onClick={this.onClick}
          >
              {this.icon}
          </Button>
          <Menu
            id={this.name}
            anchorEl={this.state.selectedMenu}
            open={Boolean(this.state.selectedMenu)}
            onClose={this.onClose}
          >
            <MenuList menuList={this.menuList} onClose={this.onClose}/>
          </Menu>
        </div>
    )
  }
}

class MenuList extends React.Component {

  constructor(props) {
    super(props)
    this.onClose = props.onClose
    this.state = {
      menuList: props.menuList
    }
  }

  render() {
    return (
      <div>
        {
          this.state.menuList.map((menu) => {
            const key = `MenuItemCreatedByTemplate/${menu.label}`
            const onClickWithClose = (evt) => {
              menu.onClick(evt)
              this.onClose()
            }
            if (menu.type == MenuTemplateTypes.label) {
              return (
                <MenuItem key={key} onClick={onClickWithClose}>
                  <label>{menu.label}</label>
                </MenuItem>
              )
            }
            else if (menu.type == MenuTemplateTypes.fileSelector) {
              const inputKey = `${key}/input`
              return (
                <MenuItem key={key}>
                  <input key={inputKey} id={inputKey} type="file" onChange={onClickWithClose} style={{display: "none"}}/>
                  <label htmlFor={inputKey}>{menu.label}</label>
                </MenuItem>
              )
            }
          })
        }
      </div>
    )
  }
}