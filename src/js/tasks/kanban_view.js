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
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

export default class Kanban extends React.Component {

    constructor(props) {
        super(props)
        this.kanbanName = ''
        this.theme = props.theme
        this.toRoot = props.Root_dispatcher
        this.toKanban = props.Kanban_dispatcher
        this.store = new KanbanStore(this.toKanban)
        this.action = new KanbanAction(this.toKanban)

        this.boardGrid = null
        this.columnGrids = []
        this.state = {
            id: 0,
            kanban: []
        }
        
        this.toKanban.on('redraw', this.redraw.bind(this))
    }
    redraw() {
        const kanbanPromise = this.toKanban.emit('getCardsQuery')
        kanbanPromise.then((kanban) => {
            const state = {
                id: this.toKanban.emit('getId'),
                kanban: kanban
            }
            console.log('kanban redraw' ,state)
            this.setState(state)
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
                            maxHeight: `${maxLaneHeight}px`,
                        }
                        return (
                            <KanbanLane
                                key={abspath}
                                abspath={abspath}
                                theme={this.theme}
                                name={lane.name}
                                items={lane.items}
                                laneStyle={laneStyle}
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
        console.log('---> synchronize')
        console.log('componentDidUpdate', this.state.kanban)
        if (document.getElementsByClassName('.board-column-header')) {
            console.log('----> Muuri update')
            this.muuriUpdate()
            console.log('<---- Muuri update')
        }
        console.log('<--- synchronize')
    }
}

class KanbanLane extends React.Component {
    constructor(props) {
        super(props)
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            name: props.name,
            items: props.items,
            laneStyle: props.laneStyle
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
                <KanbanItems key={params.item.key} abspath={params.item.key} theme={params.item.theme} items={params.item.items} laneStyle={params.item.laneStyle} />
            </div>
        )
    }
}

class KanbanItems extends React.Component {
    constructor(props) {
        super(props)
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            laneStyle: props.laneStyle,
            items: props.items,
        }
    }
    render() {
        const params = {
            content: {
                key: `${this.state.abspath}/contents`,
                class: 'board-column-content',
                style: {
                    "maxHeight": this.state.laneStyle.maxHeight,
                    "minHeight": this.state.laneStyle.maxHeight,
                }
            }
        }
        return (
            <div key={params.content.key} className={params.content.class} style={params.content.style} >
                {
                    this.state.items.map((item) => {
                        const key = `${params.content.key}/${item.title}`
                        return <KanbanItem key={key} abspath={key} theme={this.theme} item={item}/>
                    })
                }
            </div>
        )
    }
}

class KanbanItem extends React.Component {
    constructor(props)  {
        super(props)
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            item: props.item,
            tip: false,
        }
        this.onClick = this.onClickHander.bind(this)
    }
    onClickHander(e){
        console.log(this.state.item.name + ' is clicked!')
        this.setState({tip: !this.state.tip})
    }
    render() {
        //const KanbanItemResponsible = withStyles(this.kanbanItemStyles)(KanbanItemController)
        const params = {
            boardItem: {
                key: `${this.state.abspath}/wrapper`,
                class: 'board-item',
                style: {}
            },
            content: {
                key: `${this.state.abspath}/content`,
                class: 'board-item-content',
                style: {}
            },
            controller: {
                key: `${this.state.abspath}/controller`,
                theme: this.theme,
                item: this.state.item
            }
        }
        return (
            <div key={params.boardItem.key} className={params.boardItem.class} style={params.boardItem.style}>
                <div key={params.content.key} className={params.content.class} style={params.content.style}>
                    {/*
                        <span key={this.state.abspath + '/msg'} onClick={this.onClick}>
                            {this.state.item.name}
                        </span>
                    */}
                    <KanbanItemController key={params.controller.key} abspath={params.controller.key} theme={params.controller.theme} item={params.controller.item} />
                </div>
            </div>
        )
    }
}

class KanbanItemController extends React.Component {
    constructor(props){
        super(props)
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            item: props.item,
            showDetail: false,
            paper: this.kanbanItemStyles(props.theme),
        }/*
        this.propTypes = {
            classes: PropTypes.object.isRequired,
        }*/
        this.handleOpenner = this.handleOpen.bind(this)
        this.handleCloser = this.handleClose.bind(this)
        this.modalStyle = this.getModalStyle.bind(this)
        console.log(this)
    }
    handleOpen() {
        this.setState({ showDetail: true })
    }
    handleClose() {
        this.setState({ showDetail: false })
    }
    kanbanItemStyles(theme) {
        return {
            position: 'absolute',
            width: theme.spacing.unit * 50,
            backgroundColor: '#000000',//theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing.unit * 4,
        }
    }
    getModalStyle(theme) {
        const top = 30 + 'px'
        const left = 20 + 'vw'
        return {
            top: top,
            left: left,
            transform: `translate(${left}, ${top})`,
            position: 'absolute',
            width: theme.spacing.unit * 50,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing.unit * 4,
        }
    }
    render() {
        return (
            <div key={`${this.state.abspath}/div`}>
                <Typography gutterBottom onClick={this.handleOpenner}>
                    {this.state.item.title}
                </Typography>
                <Dialog
                    open={this.state.showDetail}
                    onClose={this.handleCloser}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog.description"
                >
                    <DialogTitle>
                        {this.state.item.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.item.description}
                        </DialogContentText>
                        <Grid container spacing={24}>
                            <Grid item xs={6}>
                                <FormControl aria-describedby="name-helper-text">
                                    <InputLabel htmlFor="name-helper">Assignee</InputLabel>
                                    <Input id="name-helper" value={this.state.item.asignee}/>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl aria-describedby="name-helper-text">
                                    <InputLabel htmlFor="name-helper">Date</InputLabel>
                                    <Input id="name-helper" value={this.state.item.end}/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </div>

        )
    }
    _____render() {
        return (
            <div>
                <Typography gutterBottom onClick={this.handleOpenner}>{this.state.item.title}</Typography>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.showDetail}
                    onClose={this.handleCloser}
                >
                    <div style={this.modalStyle(this.theme)}>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <Typography variant="title" id="modal-title">
                                    {this.state.item.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subheading" id="simple-modal-description">
                                    {this.state.item.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl aria-describedby="name-helper-text">
                                    <InputLabel htmlFor="name-helper">Assignee</InputLabel>
                                    <Input id="name-helper" value={this.state.item.asignee}/>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl aria-describedby="name-helper-text">
                                    <InputLabel htmlFor="name-helper">Date</InputLabel>
                                    <Input id="name-helper" value={this.state.item.end}/>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>
                </Modal>
            </div>
        )
    }
}

