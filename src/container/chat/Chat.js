import React, { useEffect, useState } from 'react'
import ChatRoom from './ChatRoom'
import axios from 'axios';
import { ip } from '../../store/ip'

import { Grid, IconButton } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from '@material-ui/core/styles';
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
        padding: "1rem", border: "1px solid gray", background: '#FFF', width: '300px', maxHeight: '500px', overflow: "auto", borderRadius: '2%'
    },
    chatroom: {
        padding: "1rem", border: "1px solid gray", background: '#FFF', borderRadius: '2%'
    },
    border: {
        padding: '5px 0px 5px 5px',
        marginBottom: '5px',
        borderBottom: '1px solid #efefef',
    },
    icon: {
        float: 'right',
        fontSize: '27px',
        color: 'red'
    }
}));

function    Chat() {
    const user_id = window.sessionStorage.getItem("id")
    const [room, setRoom] = useState({})
    const [roomList, setRoomList] = useState([])
    const [view, setView] = React.useState('all');

    const classes = useStyles();

    useEffect(() => {
        getRooms()
    }, [])

    //새로운 메시지 count
    const setRead = (id, new_msg) => {
        var i = 0;
        var list = roomList.concat()
        while (i < list.length) {
            if (list[i].id === id) {
                if (new_msg === true) {
                    var copy = list[i]
                    copy.unread = copy.unread + 1;
                    copy.updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    list.splice(i, 1)
                    list.unshift(copy)
                } else if (new_msg === false) {
                    list[i].unread = 0;
                }
                break;
            }
            i = i + 1;
        }
        setRoomList(list);
    }

    const updateRoom = (id, type) => {
        var list = roomList.concat()
        if (type === 'exit1') {
            var i = 0;
            while (i < list.length) {
                if (list[i].id === id) {
                    list.splice(i, 1)
                    break;
                }
                i = i + 1;
            }
        } else if (type === 'exit2') {
            i = 0;
            while (i < list.length) {
                if (list[i].id === id) {
                    if (list[i].seller_id === user_id) {
                        list[i].buyer_id = 'out'
                    } else {
                        list[i].seller_id = 'out'
                    }
                    break;
                }
                i = i + 1;
            }
        }
        setRoomList(list);
    }
    //'new_room' 새로운 방 추가 때문에 만듬
    const getNewRoom = (room_id) => {
        axios.get(ip + "/chat/room", { params: { id: room_id } })
            .then(res => {
                var list = roomList.concat()
                list.unshift(res.data.room[0])
                setRoomList(list)   
            })
            .catch(err => {
                console.log(err)
                alert(err)
            }) 
    }
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
    const showRoomTitle = (room) => {
        var other_user = '';
        if (room.seller_id === user_id) {
            other_user = room.buyer_id
        } else {
            other_user = room.seller_id
        }

        if (other_user === null) {
            return <p style={{ color: "#cd5c5c", float: 'left' }}>상대방 나감</p>
        } else {
            return <p style={{ color: "#556b2f", float: 'left' }}>{other_user}</p>
        }
    }
    const showTime = (time) => {
        const nowDate = moment().format('YYYY-MM-DD');

        if (nowDate === time.slice(0, 10)) {
            return time.slice(11, 16)
        } else {
            return time.slice(0, 10)
        }
    }
    // 가격에 단위수 마다 ,콤마 찍는 함수
    Number.prototype.format = function () {
        if (this === 0) return 0;

        var reg = /(^[+-]?\d+)(\d{3})/;
        var n = (this + '');

        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

        return n;
    };

    // 채팅방들
    const renderLists = roomList.map((item, idx) => {
        return (
            <Grid container spacing={1} key={idx} onClick={() => { updateRead(item) }} className={classes.border}>
                <Grid item>
                    <Avatar alt="img" src={item.images} />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={0}>
                        <Grid item xs> 
                            <h3 style={{ width: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</h3>
                        </Grid>
                        <Grid item xs> 
                            <div>{item.price.format()}원 </div> 
                        </Grid>
                        <Grid item xs style={{marginTop: '3px'}}> 
                            <div>{showRoomTitle(item)} </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <p style={{color:'gray', fontSize:'10px'}}>{showTime(item.updateTime)}</p> 
                    {item.unread === 0 ? '' : <NotificationsActiveIcon className={classes.icon} />}
                </Grid>
            </Grid>
        )
    })

    const updateRead=(item)=>{
        setRoom(room === item ? {} : item)
        var id = {id:item.id}
        axios.post(ip + "/chat/updateRead", id)
        .then(res => {
            
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
    }

    const toggleChange = (event, nextView) => {
        if (nextView === null)
            return
        getRooms(nextView)
        setView(nextView)
    }
    return (
        <Grid container spacing={3}>
            <Grid item style={{ textAlign: 'center' }}>
                <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={toggleChange}>
                    <ToggleButton value="all">
                        <h4>전체</h4>
                    </ToggleButton>
                    <ToggleButton value="shopping">
                        <ShoppingCartIcon />
                    </ToggleButton>
                    <ToggleButton value="selling">
                        <AttachMoneyIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            {/* 채팅방 리스트 */}
            <Grid item>
                <div className={classes.chatlist}>
                    <div style={{display: 'flex'}}>
                        <h2 className={classes.border}>Messenger</h2>
                        <IconButton style={{marginLeft: '140px'}}>
                            <CachedRoundedIcon/>
                        </IconButton>
                    </div>
                    <List className={classes.root}>
                        {roomList.length ? renderLists : <div> 채팅방이 없습니다 </div>}
                    </List>
                </div>
            </Grid>
            {/* 1대1 채팅방 */}
            <Grid item style={{ width: '480px' }}>
                {!("id" in room) ? null :
                    <div className={classes.chatroom}>
                        <ChatRoom useRoom={[room, setRoom]} setRead={setRead}/>
                    </div>
                }
            </Grid>
        </Grid>
    )
}

export default Chat
