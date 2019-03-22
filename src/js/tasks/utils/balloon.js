// https://saruwakakun.com/html-css/reference/speech-bubble

// TODO:アバターの下に名前を表示

import React from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

export default class Balloon extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      direction: props.direction,
      avator: props.avator,
      children: props.children,
      backgroundColor: props.color ? props.color : '#30e852',
      width: props.width ? props.width : parseInt(window.innerWidth/3),
      arrowDegree: props.arrowDegree ? props.arrowDegree : 25,
    }
  }
  render() {
    const iconWidth = 40
    const chattingWidth = this.state.width - iconWidth
    const style = {
      top: {
        display: 'block',
        width: '100%',
      },
      left: {
        balloon: {
          width: '100%',
          margin: '10px 0',
          //overflow: 'hidden',
          display: 'inline-flex',
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          alignItems: 'flex-start'
        },
        balloonFaceIcon: {
          //float: 'left',
          //marginRight: '-50px',
          flexBasis: iconWidth,
        },
        balloonFaceiconImg: {
          width: '100%',
          height: 'auto',
          borderRadius: '50%',
        },
        balloonChatting: {
          flexBasis: chattingWidth,
          textAlign: 'left',
        },
        balloonBox: {
          //display: 'inline-block',
          display: 'block',
          position: 'relative',
          margin: '0 0 0 0px',
          padding: '8px',
          /*max-width: 250px,*/
          width: chattingWidth,
          borderRadius: '12px',
          background: this.state.backgroundColor,
        },
        balloonBoxAfter: {
          content: '',
          //display: 'inline-block',
          position: 'absolute',
          top: '3px',
          left: '-19px',
          border: '8px solid transparent',
          borderRight: `18px solid ${this.state.backgroundColor}`,
          msTransform: `rotate(${this.state.arrowDegree}deg)`,
          webKitTransform: `rotate(${this.state.arrowDegree}deg)`,
          transform: `rotate(${this.state.arrowDegree}deg)`,
        }
      },
      right: {
        balloon: {
          width: '100%',
          margin: '0 10px',
          /*overflow: 'hidden',*/
          display: 'inline-flex',
          flexWrap: 'nowrap',
          justifyContent: 'flex-end',
          alignItems: 'flex-start'
        },
        balloonFaceIcon: {
          //float: 'right',
          //marginLeft: '-50px',
          flexBasis: iconWidth,
        },
        balloonFaceiconImg:{
          width: '100%',
          height: 'auto',
          borderRadius: '50%',
        },
        balloonChatting: {
          flexBasis: chattingWidth,
          textAlign: 'left',
        },
        balloonBox: {
          //display: 'inline-block',
          display: 'block',
          position: 'relative',
          margin: '0 20px 0 0',
          padding: '8px',
          /*maxWidth: '250px',*/
          width: chattingWidth,
          borderRadius: '12px',
          background: this.state.backgroundColor,
          //fontSize: '15px',
        },
        balloonBoxAfter: {
          content: '',
          position: 'absolute',
          top: '3px',
          right: '-19px',
          border: '8px solid transparent',
          borderLeft: `18px solid ${this.state.backgroundColor}`,
          msTransform: `rotate(-${this.state.arrowDegree}deg)`,
          webKitTransform: `rotate(-${this.state.arrowDegree}deg)`,
          transform: `rotate(-${this.state.arrowDegree}deg)`,
        },
      }
    }
    if (this.state.direction == 'left') {
      return (
        <div style={style.top}>
          <div style={style.left.balloon}>
            <div style={style.left.balloonFaceIcon}>
                {this.state.avator}
            </div>
            <div style={style.left.balloonChatting}>
                <div style={style.left.balloonBox}>
                  {this.state.children}
                  <div style={style.left.balloonBoxAfter} />
                </div>
            </div>
          </div>
        </div>
      )
    }
    else if (this.state.direction == 'right') {
      return (
        <div style={style.top}>
          <div style={style.right.balloon}>
            <div style={style.right.balloonChatting}>
                <div style={style.right.balloonBox}>
                  {this.state.children}
                  <div style={style.right.balloonBoxAfter} />
                </div>
            </div>
            <div style={style.right.balloonFaceIcon}>
                {this.state.avator}
            </div>
          </div>
        </div>
      )
    }
  }
}