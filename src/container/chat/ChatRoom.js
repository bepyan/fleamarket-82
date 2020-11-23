import React, { useEffect, useState } from 'react';
import { ip } from '../../store/ip'
import axios from 'axios';
import ChatContent from "./ChatContent";
import { storage } from '../../firebase/firebase'
import Contract from "../contract/Contract"
import { Grid, IconButton, InputBase, makeStyles } from '@material-ui/core';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';
import CachedRoundedIcon from '@material-ui/icons/CachedRounded';

import moment from 'moment';

const time = moment().format('YYYY-MM-DD hh:mm:ss');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        background: '#FFF',
        borderBottom:'1px solid gray'
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    icon: {
        fontSize: '20px'
    },
    input: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    }
}));


function ChatRoom(props) {
    const classes = useStyles();
    const user_id = window.sessionStorage.getItem('id')
    const hiddenFileInput = React.useRef(null)
    const updateRead = props.updateRead
    const [room, setRoom] = props.useRoom

    const [text, setText] = useState("")
    const [chatlog, setChatlog] = useState([])
    const [other_user, setOtherUser] = useState('')
    
    useEffect(() => {
        getChatlog()
        setOtherUser(room.seller_id === user_id ? room.buyer_id : room.seller_id)
    }, room)
    
    /* 채팅로그 조회 */
    const getChatlog = () => {
        if (!room.id)
            return

        axios.get(ip + "/chat/chatlog", { params: { id: room.id } })
            .then(res => {
                const data =  res.data.chatlog[0]
                if (chatlog !== data)
                    setChatlog(data)
            })
            .catch(err => {
                console.log(err)
                alert('채팅로그 조회 실패')
            })
    }
    /* 채팅방 새로고침 */
    const clickRefresh = () => {
        getChatlog()
        updateRead(room.id)
    }

    // type 0: 일반 메시지 1: 구매요청 2: 구매수락 3: 물품구매 4: 구매확정 5: 거래완료 10: 거래취소
    const sendMessage = (type, url = "") => {
        if (!type && !text)
            return
        const log = { chat_id: room.id, user_id: user_id, contents: type ? url : text, type: type, sendTime:time }
        axios.post(ip + "/chat/chatlog", log)
            .then(() => {
                clickRefresh()
                setText("")
            })
            .catch(err => {
                console.log(err)
                alert(err)
            })
    }
    /* 채팅방 나가기 */
    const exitRoom = () => {
        if (room.state === 0 || room.state === 1 || room.state === 7 || room.state === 9 || room.state === 11) {
            let result = window.confirm("정말 방을 나가시겠습니까?\n대화내용이 삭제됩니다")
            if (result) {
                sendMessage(9)
                var type = room.seller_id === user_id ? 'seller' : 'buyer'

                axios.post(ip + "/chat/exit", { type: type, id: room.id })
                    .then(() => {
                        setRoom({})
                    })
                    .catch(err => {
                        console.log(err)
                        alert(err)
                    })
            }
        } else
            alert('거래 중일 때는 방을 나가실 수 없습니다')
    }
 
    // 사진 업로드
    const handleClick = () => {
        hiddenFileInput.current.click();
    }
    const uploadImage = (e) => {
        if (e.target.files[0]) {
            const img = e.target.files[0]
            const uploadTask = storage.ref(`images/${img.name}`).put(img);
            uploadTask.on('state_changed',
                (snapshot) => {
                    console.log(snapshot)
                }, (err) => {
                    console.log(err)
                }, () => {
                    storage.ref('images').child(img.name).getDownloadURL().then(url => {
                        sendMessage(20, url)
                    })
                })
        }
    }

    // 채팅 enter키로 전송 
    const sendClick = () => {
        sendMessage(0)
    }
    const appKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendClick();
        }
    }
    
    // 방제목용 상대방 id표시
    const showRoomTitle = () => {
        if(other_user === ''){
            return <h3 style={{color:'#cd5c5c'}}>상대방이 나감</h3>
        } else{
            return <h3 style={{color:'#000',fontSize:"18px"}}>{other_user}</h3>
        }
    }
    return (
        <div>
            <header className={classes.root}>
                <Grid container spacing={3} direction="row" justify="space-between" alignItems="center" >
                    <Grid item> 
                        <IconButton onClick={() => { setRoom({})  }}>
                            <ArrowBackIcon  style={{fontSize:30 }} />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: "center"}}>
                        {showRoomTitle()}
                    </Grid>
                    <Grid item style={{ float: "right" }}>
                        <IconButton size="large" onClick={() => { exitRoom() }}>
                            <ExitToAppIcon style={{fontSize:30 }} />
                        </IconButton>
                    </Grid>
                </Grid>
                <div style={{borderTop:'1px solid gray'}}/>
                <Grid container spacing={1} style={{ marginTop: '5px', marginBottom:'5px' }}>
                    <Grid item>
                        <Avatar alt="img" src={room.images} />
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={0}>
                            <Grid item xs> 
                                <h3 style={{ width: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.title}</h3>
                            </Grid>
                            <Grid item xs> 
                                <div style={{ marginTop: '0px' }}>{String(room.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                    </Grid>
                </Grid>
            </header>

            <div style={{ overflowX: "auto", height: "480px", background:"#fff"}}>
                {
                    chatlog.map((message, idx) => {
                        const align = (message.user_id === user_id) ? "right" : "left"
                        return (
                            <li key={idx} style={{textAlign: align, margin: '1rem' }}>
                                <ChatContent message={message} user_id={user_id} sendMessage={sendMessage} />
                            </li>
                        )
                    })
                }
            </div>

            <Grid container direction={'column'} style={{ borderTop: '1px solid gray' }}>
                <Grid item>
                    {/* Enter하면 바로 메시지 전송하고 Ctrl+Enter로 행바꿈 */}
                    <InputBase onChange={(e) => setText(e.target.value.substring(0,100))}
                        value={text}
                        style={{ paddingLeft: '1rem' }}
                        inputProps={{ size: 'small' }}
                        type="text"
                        fullWidth multiline rows={3}
                        autoFocus
                        placeholder='메시지를 입력하세요 (글자 수 제한 : 100) '
                        rowsMax={5}
                        onKeyPress={appKeyPress} />
                </Grid>
                <div style={{borderTop:'1px solid gray'}}/>
                <Grid item style={{ display: 'flex', direction: 'rtl' }}>
                    <IconButton size="small" onClick={() => sendClick()} >
                        <SendOutlinedIcon style={{fontSize:30 }}/>
                    </IconButton>
                    <div>
                        <IconButton size="small" onClick={handleClick}>
                            <ImageOutlinedIcon style={{fontSize:30 }} />
                            <input accept="image/*" type="file"
                                onChange={uploadImage}
                                ref={hiddenFileInput}
                                style={{ display: 'none' }}
                            />
                        </IconButton >
                    </div>
                    <IconButton size="small" onClick={() => clickRefresh()} style={{marginLeft: '10px'}}>
                        <CachedRoundedIcon style={{fontSize:30 }}/>
                    </IconButton>
                    <Contract useRoom={[room, setRoom]} ViewType={room.buyer_id===user_id?1:2} chatlog={[chatlog, setChatlog]} sendMessage={sendMessage}/>
                </Grid>
            </Grid>
        </div>
    )
}

export default ChatRoom;