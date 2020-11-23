import React, { useEffect, useState } from "react";
import axios from 'axios'
import {ip} from "../store/ip"
import { withRouter } from "react-router-dom";
import UploadBoard from "../container/board/UploadBoard";
import Chat from "../container/chat/Chat"
import Filter from "../container/home/Filter"
import Search from "../container/home/Search"
import Alert from "../container/home/Alert"
import Board from "../container/board/Board"

import { Collapse, Grid, IconButton } from "@material-ui/core";
import socket from '../store/socket'
import { useSnackbar } from 'notistack';

function FleamarketHome(props){
  const user_id = window.sessionStorage.getItem("id")
  const { enqueueSnackbar } = useSnackbar()
  const [openUL, setOpenUL] = useState(false)
  const [openChat, setOpenChat] = useState(false) 
  const [alertOption, setAlertOption] = useState({})
  const loginAlert= {open: true, text: "로그인하시지요..", doAfter: () => {props.history.push("/login")}}
  
  const [boards, setBoards] = useState([])
  const [word, setWord] = useState("")
  const [school, SetSchool] = useState('')
  
  const SHOW_CNT = 6
  const [type, setType] = useState('all')
  const [align, setAlign] = useState('time')
  const [desc, setDesc] = useState(true)
  const [viewNoContract, setViewNoContract] = useState(false)

  const clickUL = () => {
    if(!window.sessionStorage.getItem("id"))
      return setAlertOption(loginAlert)
    if(!openUL)
      setOpenChat(false)
    setOpenUL(!openUL)
  }
  const clickChat = () => {
    if(!window.sessionStorage.getItem("id"))
      return setAlertOption(loginAlert)
    if(!openChat)
      setOpenUL(false)
    setOpenChat(!openChat)
  }
  const clickMyPage = () => {
    if(!window.sessionStorage.getItem("id"))
      return setAlertOption(loginAlert)
    props.history.push('/mypage')

  }
  // SHOW_CNT 개수 만큼 계속 게시물을 가져온다 / 필터링 / 기본 시간순 출력
  const getBoards = (arg={}) => {
    var options = {
      start_idx:    0, 
      cnt:          SHOW_CNT, 
      type:         type, 
      align:        align,
      desc:         desc,
      user_id:      user_id,
      school:       school,
      search:       word,
      viewNoContract: viewNoContract,
    }
    for (var prop in arg)
      options[prop] = arg[prop]

    axios.get(ip+'/board',  { params: options})
      .then(res => {
        const gets = res.data.boards[0]
        setBoards( options.start_idx ? [...boards, ...gets] : [...gets])
      })
      .catch(err => {
        console.log(err)
        alert("상품들을 가져오는데 실패 했습니다.")
      })
  }
  
  useEffect(() => {
    getBoards()
    socket.on("notification", (data) => {
      enqueueSnackbar(data.sender + '님이 ' + messageSnackbar(data.chatlog.type))
    })
  }, []) 

  const messageSnackbar = (type) => {
    switch(type){
      default: case 0: case 20: return '메시지를 보냈습니다'
      case 1: return '[구매요청] 했습니다'
      case 2: return '[구매수락] 했습니다'
      case 3: return '[송금] 했습니다'
      case 4: return '[구매확정] 했습니다'
      case 9: return '채팅방을 나갔습니다'
      case 10: return '거래 취소했습니다'
    }
  }

  return (
    <div>
      <Alert option={alertOption}/>
      <Grid spacing={1} container justify="center" alignItems="center" style={{marginTop: '1rem'}}>
        {/* 액션창 */}
        <Grid item xs={12}>
          <div style={{textAlign: 'center'}}>
            <IconButton onClick={() => clickUL()} >              
              <img src="https://img.icons8.com/cotton/64/000000/upload-to-cloud--v1.png" alt='bt1'/>
            </IconButton>
            <IconButton onClick={() => clickChat()}>
              <img src="https://img.icons8.com/cotton/64/000000/chat.png" alt='bt2'/>  
            </IconButton>
            <IconButton onClick={() => clickMyPage()}>
              <img src="https://img.icons8.com/cotton/64/000000/gender-neutral-user--v1.png" alt='bt3'/>
            </IconButton>
          </div>
          <Grid container direction="column" alignItems="center">
            <Collapse in={openUL}>
              <UploadBoard getBoards={getBoards} setOpenUL={setOpenUL}/>
            </Collapse>
            <Collapse in={openChat}>
              <div  style={{marginTop:"30px",marginBottom:"10px"}}>
                <Chat />
              </div>
            </Collapse>
          </Grid> 
        </Grid>

        {/* 검색 */}
        <Search getBoards={getBoards} useWord={[word, setWord]}/>
        
        {/* 필터링 */}
        <Filter getBoards={getBoards} 
          useSchool={[school, SetSchool]}
          useAlign={[align, setAlign]} 
          useType={[type, setType]} 
          useDesc={[desc, setDesc]}
          useViewNoContract={[viewNoContract, setViewNoContract]}/>
      </Grid>
      
      {/* 게시물 목록 */}
      <Board useBoard={[boards, getBoards]}/>
    </div>
  )
}
export default withRouter(FleamarketHome)