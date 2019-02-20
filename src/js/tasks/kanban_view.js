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
        this.theme = props.theme
        this.dispatcher = props.Kanban_dispatcher
        this.store = new KanbanStore(this.dispatcher)
        this.action = new KanbanAction(this.dispatcher)
        this.dispatcher.on('update', this.update.bind(this))
        this.boardGrid = null
        this.columnGrids = []
        this.state ={
            board: this.action.getBoard()
        }
    }
    update() {
        console.log('---- updateします ----')
        console.log(this.action.getStore())
        this.setState(this.action.getStore())
        //this.render()
    }
    render() {
        const headerHeight = 30
        const footerHeight = 30
        const paddingHeight = 5
        const windowHeight = window.innerHeight
        const maxHeight = windowHeight - headerHeight - footerHeight - headerHeight - paddingHeight * 2
        const maxWidth = parseInt(80/this.state.board.length)
        return (
            <div key="board" className="board" id="board">
                {
                    this.state.board.map((lane) => {
                        const abspath = 'kanban/' + lane.name
                        const style = {
                            color: lane.color,
                            maxWidth: maxWidth + '%',
                            maxHeight: maxHeight + 'px',
                        }
                        return (
                            <KanbanLane key={abspath} abspath={abspath} theme={this.theme} name={lane.name} items={lane.items} style={style}/>
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
                dragContainer: document.getElementById('board'),
                dragReleaseDuration: 400,
                dragReleaseEasing: 'ease'
            }).on('dragStart', (item) => {
                // Let's set fixed widht/height to the dragged item
                // so that it does not stretch unwillingly when
                // it's appended to the document body for the
                // duration of the drag.
                item.getElement().style.width = item.getWidth() + 'px'
                item.getElement().style.height = item.getHeight() + 'px'
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
        console.log('----- synchronize -----')
        console.log(this.state.board)
        if (document.getElementsByClassName('.board-column-header')) {
            console.log('----- Muuri update -----')
            this.muuriUpdate()
        }
    }
}

class KanbanLane extends React.Component {
    constructor(props) {
        super(props)
        this.theme = props.theme
        this.state = {
            abspath: props.abspath,
            name: props.name,
            color: props.style.color,
            items: props.items,
            maxHeight: props.style.maxHeight,
            maxWidth: props.style.maxWidth,
        }
        console.log(this.state)
    }
    render() {
        const args = {
            board: {
                key: this.state.abspath + "/" + "board-column",
                class: "board-column " + this.state.name,
                style: {
                    "width": this.state.maxWidth,
                    "maxWidth": this.state.maxWidth,
                },
            },
            header: {
                key: this.state.abspath + "/" + "header",
                class: "board-column-header",
                style: {
                    "backgroundColor":this.state.color,
                },
            },
            wrapper: {
                key: this.state.abspath + "/" + "wrapper",
                class: "board-column-content-wrapper",
                style: {
                    "maxHeight":this.state.maxHeight,
                    "height":this.state.maxHeight,
                },
            },
        }
        return (
            <div key={args.board.key} className={args.board.class} style={args.board.style}>
                <div key={args.header.key} className={args.header.class} style={args.header.style}>
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
                <div key={args.wrapper.key} className={args.wrapper.class} style={args.wrapper.style}>
                    <KanbanItems key={this.state.abspath + "/KanbanItems"} theme={this.theme} items={this.state.items} abspath={this.state.abspath}/>
                </div>
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
            items: props.items,
        }
    }
    render(){
        return (
            <div key={this.state.abspath + '/contents'} className="board-column-content">
                {
                    this.state.items.map((item) => {
                        const abspath =  this.state.abspath + item.title
                        return <KanbanItem key={abspath} theme={this.theme} item={item} abspath={abspath}/>
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
        return (
            <div key={this.state.abspath + '/wrapper'} className="board-item">
                <div key={this.state.abspath + '/content'} className="board-item-content">
                    {/*
                        <span key={this.state.abspath + '/msg'} onClick={this.onClick}>
                            {this.state.item.name}
                        </span>
                    */}
                    <KanbanItemController abspath={this.state.abspath} theme={this.theme} item={this.state.item}/>
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
            <div>
                <Typography gutterBottom onClick={this.handleOpenner}>
                    {this.state.item.title}
                </Typography>
                <Dialog
                    open={this.state.showDetail}
                    onClose={this.handleCloser}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert^-dialog.description"
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

