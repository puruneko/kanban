// https://saruwakakun.com/html-css/reference/speech-bubble

// TODO:アバターの下に名前を表示

import React from 'react'
import Grid from '@material-ui/core/Grid'
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
            arrowBorderWidth: props.arrowBorderWidth ? props.arrowBorderWidth : 8,
            arrowDegree: props.arrowDegree ? props.arrowDegree : 25,
        }
    }
    toCamel(s) {
        return s.toLowerCase().replace(/^[a-z]/g, (s) => {
            return s.toUpperCase()
        })
    }
    render() {
        const arrowMargin = 3
        const flexDirection = this.state.direction == 'left' ? 'row-reverse' : 'row'
        const balloonMargin = this.state.direction == 'left' ? 20 : 35
        const rotDirection = this.state.direction == 'left' ? '+' : '-'
        const currentDirectionUpper = this.state.direction == 'left' ? 'Left' : 'Right'
        const reverseDirectionUpper = this.state.direction == 'left' ? 'Right' : 'Left'
        const reverseDirection = this.state.direction == 'left' ? 'right' : 'left'
        const marginForArrow = parseInt(this.state.arrowBorderWidth * Math.sin(this.state.arrowDegree/180*Math.PI)) * 2
        console.log(`check[${this.state.direction}]`, rotDirection, balloonMargin, reverseDirection, marginForArrow)
        /*
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
                    //max-width: 250px,
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
                    //overflow: 'hidden',
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
                    //maxWidth: '250px',
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
        */
        const params = {
            top: {
                style: {
                    dispaly: 'block',
                    width: '100%',
                    margin: '5px 5px 5px 5px',
                }
            },
            balloonWrap: {
                xs: 11,
                style: {
                    display: 'block',
                    position: 'relative',
                    width: this.state.width,
                    [`margin${reverseDirectionUpper}`]: 'auto',
                    [this.state.direction]: balloonMargin,
                    //display: 'inline-flex',
                    //flexWrap: 'nowrap',
                    //justifyContent: 'flex-end',
                    //alignItems: 'flex-start'
                }
            },
            balloon: {
                style: {
                    //display: 'inline-block',
                    //display: 'block',
                    position: 'relative',
                    //margin: balloonMargin,
                    padding: '8px',
                    //maxWidth: '250px',
                    width: '100%',//chattingWidth,
                    borderRadius: '12px',
                    background: this.state.backgroundColor,
                    //fontSize: '15px',
                }
            },
            balloonArrow: {
                style: {
                    content: '',
                    position: 'absolute',
                    top: arrowMargin,
                    [reverseDirection]: `calc(100% - ${marginForArrow}px)`,//'-19px',
                    border: `${this.state.arrowBorderWidth}px solid transparent`,
                    [`border${reverseDirectionUpper}`]: `${this.state.arrowBorderWidth*2.5}px solid ${this.state.backgroundColor}`,
                    msTransform: `rotate(${rotDirection}${this.state.arrowDegree}deg)`,
                    webKitTransform: `rotate(${rotDirection}${this.state.arrowDegree}deg)`,
                    transform: `rotate(${rotDirection}${this.state.arrowDegree}deg)`,
                }
            },
            iconWrap: {
                style: {
                    display: 'block',
                    width: 'auto',
                    height: 'auto',
                    flexWrap: 'nowrap',
                }
            },
            iconJustify: {
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            }
        }
        console.log('params', params)
        const balloonElement = {
            left: (
                <div style={params.balloon.style}>
                    <div style={params.balloonArrow.style} />
                    {this.state.children}
                </div>
            ),
            right: (
                <div style={params.balloon.style}>
                    {this.state.children}
                    <div style={params.balloonArrow.style} />
                </div>
            )
        }
        console.log('balloonElement', balloonElement)
        return (
            <div style={params.top.style}>
                <Grid container
                    direction={flexDirection}
                    justify='flex-end'  // 横
                    alignItems='flex-start' // 縦
                    wrap='nowrap'
                >
                    <Grid item xs={11}>
                        <div style={params.balloonWrap.style}>
                            {balloonElement[this.state.direction]}
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        <div style={params.iconWrap.style}>
                            <div style={params.iconJustify.style}>
                                {this.state.avator}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}