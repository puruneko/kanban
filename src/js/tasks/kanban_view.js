// カンバンの状態はstateで一時管理
// 状態が変化したら即DBに反映してリロード -> stateとDBを同期
// storeはDBのみ保持

import React from 'react'
import Muuri from 'muuri'
import KanbanStore from './kanban_store'
import KanbanAction from './kaban_action'
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import AddBox from '@material-ui/icons/addBox';
import MenuIcon from '@material-ui/icons/Menu';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, Divider } from '@material-ui/core';

import Balloon from './utils/balloon'

export default class Kanban extends React.Component {

    constructor(props) {
        super(props)
        this.kanbanName = ''
        this.toRoot = props.Root_dispatcher
        this.toKanban = props.Kanban_dispatcher
        this.store = new KanbanStore(this.toKanban)
        this.action = new KanbanAction(this.toKanban)

        this.boardGrid = null
        this.columnGrids = []
        this.state = {
            meta: {},
            id: 0,
            kanban: []
        }
        
        this.toKanban.on('redraw', this.redraw.bind(this))
    }
    redraw() {
        const metaPromise = this.toKanban.emit('getMetaQuery')
        metaPromise.then((meta) => {
            const kanbanPromise = this.toKanban.emit('getCardsQuery')
            kanbanPromise.then((kanban) => {
                const state = {
                    meta: meta,
                    id: this.toKanban.emit('getId'),
                    kanban: kanban
                }
                console.log('kanban redraw' ,state)
                this.setState(state)
            })
        })
    }
    render() {
        this.kanbanName = `kanban${this.state.id}`
        const headerHeight = 64
        const footerHeight = 64
        const paddingHeight = 5
        const windowHeight = window.innerHeight
        const maxLaneHeight = windowHeight - headerHeight - footerHeight - headerHeight - paddingHeight * 2
        const maxLaneWidth = parseInt(80/this.state.kanban.length)
        const params = {
            board: {
                key: `kanban/${this.state.id}/${Date.now().toString()}`,
                class: 'board',
                id: this.kanbanName, // essential
                style: {
                    position: 'relative',
                    'margin-left': '1%'
                }
            }
        }
        return (
            <div key={params.board.key} className={params.board.class} id={params.board.id}>
                {
                    this.state.kanban.map((lane) => {
                        console.log('kanban render', lane)
                        const abspath = `${params.board.key}/${lane.name}`
                        const laneStyle = {
                            color: lane.color,
                            maxWidth: `${maxLaneWidth}%`,
                            maxHeight: maxLaneHeight,
                        }
                        return (
                            <KanbanLane
                                key={abspath}
                                toKanban={this.toKanban}
                                abspath={abspath}
                                theme={this.theme}
                                name={lane.name}
                                items={lane.items}
                                laneStyle={laneStyle}
                                meta={this.state.meta}
                            />
                        )
                    })
                }
            </div>
        )
    }
    muuriUpdate() {
        this.boardGrid = undefined
        this.columnGrids = []
        const itemContainers = [].slice.call(document.querySelectorAll('.board-column-content'))
        console.log('itemContainers', itemContainers)
        // Define the column grids so we can drag those
        // items around.
        itemContainers.forEach((container) => {
            // Instantiate column grid.
            const grid = new Muuri(container, {
                items: '.board-item',
                layoutDuration: 400,
                layoutEasing: 'ease',
                dragEnabled: true,
                dragSort: () => {
                    return this.columnGrids
                },
                dragSortInterval: 0,
                dragContainer: document.getElementById(this.kanbanName),
                dragReleaseDuration: 400,
                dragReleaseEasing: 'ease'
            }).on('dragStart', (item) => {
                // Let's set fixed widht/height to the dragged item
                // so that it does not stretch unwillingly when
                // it's appended to the document body for the
                // duration of the drag.
                item.getElement().style.width = `${item.getWidth()}px`
                item.getElement().style.height = `${item.getHeight()}px`
            }).on('dragReleaseEnd', (item) => {
                // Let's remove the fixed width/height from the
                // dragged item now that it is back in a grid
                // column and can freely adjust to it's
                // surroundings.
                item.getElement().style.width = ''
                item.getElement().style.height = ''
                // Just in case, let's refresh the dimensions of all items
                // in case dragging the item caused some other items to
                // be different size.
                this.columnGrids.forEach( (grid) => {
                    grid.refreshItems()
                })
            }).on('layoutStart', () => {
                // Let's keep the board grid up to date with the
                // dimensions changes of column grids.
                this.boardGrid.refreshItems().layout()
            })
            // Add the column grid reference to the column grids
            // array, so we can access it later on.
            this.columnGrids.push(grid)
        })
        
        // Instantiate the board grid so we can drag those
        // columns around.
        this.boardGrid = new Muuri('.board', {
            layoutDuration: 400,
            layoutEasing: 'ease',
            dragEnabled: true,
            dragSortInterval: 0,
            dragStartPredicate: {
                handle: '.board-column-header'
            },
            dragReleaseDuration: 400,
            dragReleaseEasing: 'ease'
        })
        //this.boardGrid.layout()
    }
    componentDidUpdate() {
        console.log('componentDidUpdate', this.state.kanban)
        if (this.state.kanban.length != 0) {
            console.log('---> synchronize')
            if (document.getElementsByClassName('.board-column-header')) {
                console.log('----> Muuri update')
                this.muuriUpdate()
                console.log('<---- Muuri update')
            }
            console.log('<--- synchronize')
        }
    }
}

class KanbanLane extends React.Component {
    constructor(props) {
        super(props)
        this.toKanban = props.toKanban
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            name: props.name,
            items: props.items,
            laneStyle: props.laneStyle,
            meta: props.meta,
        }
        console.log('kanban lane', this.state)
    }
    render() {
        const params = {
            board: {
                key: `${this.state.abspath}/board-column`,
                class: `board-column ${this.state.name}`,
                style: {
                    'width': this.state.laneStyle.maxWidth,
                    'maxWidth': this.state.laneStyle.maxWidth,
                },
            },
            header: {
                key: `${this.state.abspath}/header`,
                class: "board-column-header",
                style: {
                    "backgroundColor": this.state.laneStyle.color,
                },
            },
            item: {
                key: `${this.state.abspath}/KanbanItems`,
                theme: this.theme,
                items: this.state.items,
                laneStyle: this.state.laneStyle
            }
        }
        return (
            <div key={params.board.key} className={params.board.class} style={params.board.style}>
                <div key={params.header.key} className={params.header.class} style={params.header.style}>
                    <Grid container justify="space-between">
                        <Grid item>
                            {this.state.name}
                        </Grid>
                        <Grid item>
                            <Button color="default">
                                +
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <KanbanItems
                    key={params.item.key}
                    toKanban={this.toKanban}
                    abspath={params.item.key}
                    theme={params.item.theme}
                    items={params.item.items}
                    laneStyle={params.item.laneStyle}
                    meta={this.state.meta}
                />
            </div>
        )
    }
}

class KanbanItems extends React.Component {
    constructor(props) {
        super(props)
        this.toKanban = props.toKanban
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            laneStyle: props.laneStyle,
            items: props.items,
            meta: props.meta,
        }
    }
    render() {
        const params = {
            content: {
                key: `${this.state.abspath}/contents`,
                class: 'board-column-content',
                style: {
                    maxHeight: this.state.laneStyle.maxHeight,
                    minHeight: this.state.laneStyle.maxHeight,
                }
            },
            item: {
                style: {
                    height: parseInt(this.state.laneStyle.maxHeight / this.state.meta.maxCardCount)
                }
            }
        }
        console.log('itemHeight', params.item.style.height)
        return (
            <div key={params.content.key} className={params.content.class} style={params.content.style} >
                {
                    this.state.items.map((item) => {
                        const key = `${params.content.key}/${item.title}`
                        return (
                            <KanbanItem 
                                key={key}
                                toKanban={this.toKanban}
                                abspath={key}
                                theme={this.theme}
                                item={item}
                                itemHeight={params.item.style.height}
                                meta={this.state.meta}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

class KanbanItem extends React.Component {
    constructor(props)  {
        super(props)
        this.toKanban = props.toKanban
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            item: props.item,
            itemHeight: props.itemHeight,
            meta: props.meta,
            tip: false,
        }
        this.onClick = this.onClickHander.bind(this)
    }
    onClickHander(evt){
        console.log(this.state.item.name + ' is clicked!')
        this.setState({tip: !this.state.tip})
    }
    render() {
        const params = {
            boardItem: {
                key: `${this.state.abspath}/wrapper`,
                class: 'board-item',
                style: {
                    maxHeight: this.state.itemHeight,
                    margin: '0 0 0 0',
                }
            },
            content: {
                key: `${this.state.abspath}/content`,
                class: 'board-item-content',
            },
            face: {
                key: `${this.state.abspath}/controller`,
                theme: this.theme,
                item: this.state.item
            }
        }
        return (
            <div key={params.boardItem.key} className={params.boardItem.class} style={params.boardItem.style}>
                <div key={params.content.key} className={params.content.class} style={params.content.style}>
                    <KanbanItemFace
                        key={params.face.key}
                        toKanban={this.toKanban}
                        abspath={params.face.key}
                        theme={params.face.theme}
                        item={params.face.item}
                        itemeight={this.state.itemHeight}
                        meta={this.state.meta}
                    />
                </div>
            </div>
        )
    }
}

class KanbanItemFace extends React.Component {
    constructor(props){
        super(props)
        this.toKanban = props.toKanban
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            item: props.item,
            itemHeight: props.itemHeight,
            meta: props.meta,
            dialogWidth: undefined,
            normalTag: undefined,
            showCard: false,
        }
        this.onOpen = this.handleOpen.bind(this)
        this.onClose = this.handleClose.bind(this)
        this.onEnter = this.handleEnter.bind(this)
    }
    handleOpen() {
        this.setState({ showCard: true })
    }
    handleEnter(evt) {
        const width = parseInt(evt.getBoundingClientRect().width)
        console.log('entering', width)
        this.setState( {dialogWidth: width} )
    }
    handleClose() {
        this.setState({ showCard: false })
        // TODO:ここにDB Update処理を追加する
    }
    render() {
        const windowWidth = window.innerWidth
        const params = {
            dialog: {
                maxWidth: windowWidth < 600 ? 'md' : 'sm',
                fullWidth: true
            },
            gridConteiner: {
                style: {
                    alignContent: 'center',
                    height: this.state.itemHeight,
                }
            },
            gridItem: {
                style: {
                    alignItems: 'center',
                    height: '100%',
                }
            }
        }
        const kanbanItemCard_place = (
            this.state.dialogWidth
            ? <KanbanItemCard item={this.state.item} dialogWidth={this.state.dialogWidth} />
            : <div />
        )
        if (this.state.normalTag === undefined) {
            const tagPromise = this.toKanban.emit('getNormalTagQuery')
            tagPromise
                .then((tags) => {
                    console.log(tags)
                    this.setState({normalTag: tags.slice(0,this.state.meta.maxTagCount)})
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        console.log('normal tag', this.state.normalTag)
        const xs = parseInt(12/this.state.meta.maxTagCount)
        console.log('xs', xs)
        return (
            <div key={`${this.state.abspath}/div`}>
                <Grid container key={`${this.state.abspath}/GridContainer/${xs}`} spacing={0} style={params.gridConteiner.style}>
                    {/*
                    <Typography gutterBottom onClick={this.onOpen}>
                        {this.state.item.title}
                    </Typography>
                    */}
                    <Grid item xs={12}>
                        <Typography onClick={this.onOpen}>
                            {this.state.item.title}
                        </Typography>
                    </Grid>
                    {
                        this.state.normalTag ? this.state.normalTag.map((tag) => {
                            return (
                                <Grid item key={`${this.state.abspath}/chip/${tag.name}`} xs={xs} style={params.gridItem.style}>
                                    <MiniChip
                                        label={tag.name}
                                        colorHex={tag.color ? tag.color : '#000000'}
                                    />
                                </Grid>
                            )
                        }) : []
                    }
                </Grid>
                <Dialog
                    id='card_dialog'
                    open={this.state.showCard}
                    onEnter={this.onEnter}
                    onClose={this.onClose}
                    aria-labelledby="card-dialog-title"
                    aria-describedby="card-dialog-description"
                    maxWidth={params.dialog.maxWidth}
                    fullWidth={params.dialog.fullWidth}
                >
                    {kanbanItemCard_place}
                </Dialog>
            </div>
        )
    }
}

class MiniChip extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            label: props.label,
            chipStyle: props.chipStyle,
            labelStyle: props.labelStyle,
            colorHex: props.colorHex,
            width: props.width
        }
    }
    colorCode2RGB(colorCode) {
        const R = parseInt(colorCode.substr(1,2), 16)
        const G = parseInt(colorCode.substr(3,2), 16)
        const B = parseInt(colorCode.substr(5,2), 16)
        return [R,G,B]
    }
    colorCode2RGBACSS(colorCode, alpha=1) {
        const arr = this.colorCode2RGB(colorCode)
        return `rgba(${arr.join(',')},${alpha})`
    }
    render() {
        var params = {
            wrap: {
                style: {
                    display: 'block',
                    margin: '2px 2px',
                    overflow: 'hidden'
                }
            },
            chip: {
                style: {}
            },
            label: {
                style: {}
            }
        }
        Object.assign(params.chip.style, this.state.chipStyle ? this.state.chipStyle : {})
        Object.assign(params.label.style, this.state.labelStyle ? this.state.labelStyle : {})
        //params.chip.style['display'] = 'none'
        //params.chip.style['position'] = 'absolute'
        params.chip.style['width'] = this.props.width ? this.props.width : (params.chip.style.width ? params.chip.style.width : '100%')
        params.chip.style['borderRadius'] = params.chip.style.borderRadius ? params.chip.style.borderRadius : '0.75vw'
        params.chip.style['backgroundColor'] = this.props.colorHex
                                                ? this.colorCode2RGBACSS(this.props.colorHex, 0.5)
                                                : (params.chip.style.color ? this.colorCode2RGBACSS(params.chip.style.color, 0.5) : this.colorCode2RGBACSS('#000000', 0.5))
        params.chip.style['borderColor'] = params.chip.style.borderColor ? params.chip.style.borderColor : 'gray'
        params.label.style['width'] = params.label.style.width ? params.label.style.width : '100%'
        //params.label.style['margin'] = params.label.style.margin ? params.label.style.margin : '0.5vw'
        params.label.style['fontSize'] = params.label.style.fontSize ? params.label.style.fontSize : '1vw'
        params.label.style['fontColor'] = params.label.style.fontColor ? params.label.style.fontColor : 'white'
        params.label.style['textAlign'] = params.label.style.textAlign ? params.label.style.textAlign : 'center'
        params.label.style['textOverflow'] = params.label.style.textOverflow ? params.label.style.textOverflow : 'ellipsis'
        return (
            <div style={params.wrap.style}>
                <div style={params.chip.style}>
                    <p style={params.label.style}>
                        {this.state.label}
                    </p>
                </div>
            </div>
        )
    }
}

class KanbanItemCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            item: props.item,
            dialogWidth: props.dialogWidth,
        }
        this.onAssigneeChange = this.handleAssigneeChange.bind(this)
        this.onDeadlineChange = this.handleDeadlineChange.bind(this)
    }
    handleAssigneeChange(evt) {
        console.log('assignee change', evt.target.value)
    }
    handleDeadlineChange(evt) {
        console.log('deadline change', evt.target.value)
    }
    render() {
        const dialogWidthRaio = 0.6
        const dialogWidth = this.state.dialogWidth//parseInt(windowWidth * this.state.dialogWidthRaio)
        const textWidth = parseInt(dialogWidth/4)
        const params = {
            textContainer: {
                style: {
                    marginTop: '10px',
                    marginButtom: '10px',
                    display: 'flex',
                    floxWrap: 'wrap'
                }
            },
            label: {
                style: {
                    fontSize: 12,
                }
            },
            assignee: {
                title: '作業者',
                value: this.state.item.assignee,
                style: {
                    marginLeft: '5px',
                    marginRight: '5px',
                    width: textWidth
                }
            },
            deadline: {
                title: '期限',
                value: this.state.item.deadline ? this.state.item.deadline : 'undefined',
                style: {
                    marginLeft: '5px',
                    marginRight: '5px',
                    width: textWidth
                }
            },
            passedTime: {
                title: '経過時間',
                value: 0,
                style: {
                    marginLeft: '5px',
                    marginRight: '5px',
                    width: textWidth
                }
            },
        }
        return (
            <div>
                <DialogTitle id="card-dialog-title">
                    {this.state.item.title}
                </DialogTitle>
                <DialogContent key={`dialogContent/${this.state.dialogWidth}`}>
                    <DialogContentText id="card-dialog-description">
                        {this.state.item.description}
                    </DialogContentText>
                    <Divider/>
                    <div style={params.textContainer.style}>
                        <FormControl>
                            <InputLabel htmlFor="assigneeInput" style={params.label.style}>{params.assignee.title}</InputLabel>
                            <Input
                                id="assigneeInput"
                                style={params.assignee.style}
                                defaultValue={params.assignee.value}
                                onChange={this.onAssigneeChange}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="deadlineInput" style={params.label.style}>{params.deadline.title}</InputLabel>
                            <Input
                                id="deadlineInput"
                                style={params.deadline.style}
                                defaultValue={params.deadline.value}
                                onChange={this.onDeadlineChange}
                            />
                        </FormControl>
                        <TextField
                            id="margin-none"
                            style={params.passedTime.style}
                            label={params.passedTime.title}
                            defaultValue={params.passedTime.value}
                        />
                    </div>
                    <Memo
                        key={`memo/${this.state.dialogWidth}`}
                        memoList={this.state.item.memo}
                        width={dialogWidth*dialogWidthRaio}/>
                </DialogContent>
            </div>
        )
    }
}


class Memo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            memoList: props.memoList,
            width: props.width,
            balloonColor: {
                left: props.balloonColorLeft ? props.balloonColorLeft : '#D5EEFF',
                right: props.balloonColorRight ? props.balloonColorRight : '#BFE9DB',
            }
        }
    }
    render() {
        const params = {
            top: {
                style: {
                    diaplay: 'block',
                    marginTop: 10,
                    marginButtom: 10,
                }
            },
            createAt: {
                style: {
                    fontSize: 7,
                    fontColor: '#cdd8df',
                    textAlign: 'right'
                }
            }
        }
        return (
            <div style={params.top.style}>
                {
                    this.state.memoList.map((memo) => {
                        const direction = memo.isAssignee ? 'right' : 'left'
                        const avator = (<MenuIcon/>) //TODO:アバターを変更
                        const cardStyle = {
                            backgroundColor: this.state.balloonColor[direction],
                            boxShadow: '0px 0px'
                        }
                        return (
                            <Balloon
                                key={`memo/${memo.id}`}
                                direction={direction}
                                width={this.state.width}
                                color={this.state.balloonColor[direction]}
                                avator={avator}
                            >
                                <Card style={cardStyle}>
                                    <Typography>{memo.content}</Typography>
                                    <p style={params.createAt.style}>{memo.createAt}</p>
                                </Card>
                            </Balloon>
                        )
                    })
                }
            </div>
        )
    }
}