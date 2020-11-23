import React, { useEffect, useState } from 'react'
import ChatRoom from './ChatRoom'
import axios from 'axios';
import { ip } from '../../store/ip'

import { Grid, IconButton, Tooltip } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import CachedRoundedIcon from '@material-ui/icons/CachedRounded';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    notification: {
        float: 'right',
        borderRadius: '50%',
        padding: '10% 5%',

        backgroundColor: 'red',
        color: 'white',
        font: 'bold Helvetica, Verdana, Tahoma',
    },
    chatlist: {
        padding: "1rem",  width: '300px', maxHeight: '500px', overflow: "auto",
        border: "1px solid gray", background: '#FFF', borderRadius: '2%'
    },
    chatroom: {
        width: '480px', padding: "1rem", 
        border: "1px solid gray", background: '#FFF', borderRadius: '2%'
    },
    border: {
        padding: '5px 0px 5px 5px',
        marginBottom: '5px',
        borderBottom: '1px solid #efefef',
    },
    icon: {
        float: 'right',
        margin: '5px',
        fontSize: '20px'
    }
}));

function Chat() {
    const classes = useStyles();

    const user_id = window.sessionStorage.getItem("id")
    const [room, setRoom] = useState({})
    const [roomList, setRoomList] = useState([])
    const [view, setView] = React.useState('all');

    useEffect(() => {
        getRooms()
    }, [])

    // type 'all': 전체  'shopping': 구매  'selling': 판매
    const getRooms = (type = view) => {
        axios.get(ip + "/chat", { params: { id: user_id, type: type } })
            .then(res => {
                setRoomList(res.data.chats[0])
            })
            .catch(err => {
                console.log(err)
                alert(err)
            })  
    }
    const clickRoom = (item) => {
        if (room === item)
            return setRoom({})

        updateRead(item.id)
        setRoom(item)
    }
    // 채팅 읽음
    const updateRead=(chat_id)=>{
        axios.post(ip + "/chat/updateRead", {chat_id: chat_id})
            .catch(err => {
                console.log(err)
                alert('채팅 읽기 에러')
            })
    }

    const toggleChange = (event, nextView) => {
        if (nextView === null)
            return
        getRooms(nextView)
        setView(nextView)
    }
    const showRoomTitle = (room) => {
        const other_user = room.seller_id === user_id ? room.buyer_id : room.seller_id
        if (other_user === null) {
            return <p style={{ color: "#cd5c5c", float: 'left' }}>상대방 나감</p>
        } else {
            return <p style={{ color: "#556b2f", float: 'left' }}>{other_user}</p>
        }
    }
    const showTime = (time) => {
        if(typeof(time) !== 'string')
            return

        const nowDate = moment().format('YYYY-MM-DD')
        if (nowDate === time.slice(0, 10))
            return time.slice(11, 16)
        else
            return time.slice(0, 10)
    }

    // 채팅방들
    const renderLists = roomList.map((item, idx) => {
        return (
            <Grid container spacing={1} key={idx} onClick={() => { clickRoom(item) }} className={classes.border}>
                <Grid item>
                    <Avatar alt="img" src={item.images} />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={0}>
                        <Grid item xs> 
                            <h3 style={{ width: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                        </Grid>
                        <Grid item xs> 
                            <div>{String(item.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원 </div> 
                        </Grid>
                        <Grid item xs style={{marginTop: '3px'}}> 
                            <div>{showRoomTitle(item)} </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <p style={{color:'gray', fontSize:'10px'}}>{showTime(item.updateTime)}</p> 
                    {item.unread === 0 ? '' : <NotificationsActiveIcon className={classes.icon} color='action' fontSize='small'/>}
                </Grid>
            </Grid>
        )
    })
    return (
        <Grid container spacing={3}>
            {/* 채팅방 토글 필터 */}
            <Grid item style={{ textAlign: 'center' }}>
                <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={toggleChange}>
                    <ToggleButton value="all">
                        <h4>전체</h4>
                    </ToggleButton>
                    <Tooltip title='내가 구매하는 채팅'>
                        <ToggleButton value="shopping">
                            <ShoppingCartIcon />
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip title='내가 판매하는 채팅'>
                        <ToggleButton value="selling">
                            <AttachMoneyIcon />
                        </ToggleButton>
                    </Tooltip>
                </ToggleButtonGroup>
            </Grid>
            {/* 채팅방 리스트 */}
            <Grid item>
                <div className={classes.chatlist}>
                    <div style={{display: 'flex'}}>
                        <h2 className={classes.border}>Messenger</h2>
                        <IconButton style={{marginLeft: '140px'}} onClick={() => getRooms()}>
                            <CachedRoundedIcon/>
                        </IconButton>
                    </div>
                    <List className={classes.root}>
                        {roomList.length ? renderLists : <div> 채팅방이 없습니다 </div>}
                    </List>
                </div>
            </Grid>
            {/* 1대1 채팅방 */}
            <Grid item>
                {!("id" in room) ? null :
                    <div className={classes.chatroom}>
                        <ChatRoom useRoom={[room, setRoom]} updateRead={updateRead}/>
                    </div>
                }
            </Grid>
        </Grid>
    )
}

export default Chat
