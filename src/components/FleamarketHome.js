import React, { useEffect, useState } from "react";
import axios from 'axios'
import {ip} from "../store/ip"
import { withRouter } from "react-router-dom";
import UploadBoard from "../container/board/UploadBoard";
import Chat from "../container/chat/Chat"
import Filter from "../container/home/Filter"
import Search from "../container/home/Search"
import Board from "../container/board/Board"

import { Collapse, Grid, IconButton } from "@material-ui/core";
import { useSnackbar } from 'notistack';

function FleamarketHome(props){
  const user_id = window.sessionStorage.getItem("id")
  const { enqueueSnackbar } = useSnackbar()
  const [openUL, setOpenUL] = useState(false)
  const [openChat, setOpenChat] = useState(false) 
  
  const [boards, setBoards] = useState([])
  const [word, setWord] = useState("")
  const [school, SetSchool] = useState('')
  
  const SHOW_CNT = 6
  const [type, setType] = useState('all')
  const [align, setAlign] = useState('time')
  const [desc, setDesc] = useState(true)
  const [viewNoContract, setViewNoContract] = useState(false)

  const clickUL = () => {
    if(!window.sessionStorage.getItem("id")){
      props.history.push("/login")
      return enqueueSnackbar('로그인하셔야 합니다', { variant: 'error'})
    }
    if(!openUL)
      setOpenChat(false)
    setOpenUL(!openUL)
  }
  const clickMyPage = () => {
    if(!window.sessionStorage.getItem("id")){
      props.history.push("/login")
      return enqueueSnackbar('로그인하셔야 합니다', { variant: 'error'})
    }
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
  }, []) 

  return (
    <div>
      <Grid spacing={1} container justify="center" alignItems="center" style={{marginTop: '1rem'}}>
        {/* 액션창 */}
        <Grid item xs={12}>
          <div style={{textAlign: 'center'}}>
            <IconButton onClick={() => clickUL()} >              
              <img src="https://img.icons8.com/cotton/64/000000/upload-to-cloud--v1.png" alt='bt1'/>
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