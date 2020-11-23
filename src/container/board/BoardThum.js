import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import {ip} from "../../store/ip"
import BoardDetail from "./BoardDetail";
import noimg from '../../lib/image/noimg.png'

import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@material-ui/core'
import WhatshotIcon from '@material-ui/icons/Whatshot';

// 여러 상세페이지를 띄워 주고 싶은 기능 생각해야
function BoardThum(props) {
    const user_id = window.sessionStorage.getItem("id")
    const [board, getBoards] = props.useBoard
    const [open, setOpen] = useState(false)
    const [wish, setWish] = useState(false)
        
    const printPast = (time) => {
        var past = parseInt((new Date() - new Date(time))/1000)
        if(past < 60)
            return past + "초 전"
        if(past < 3600)
            return parseInt(past/60) + "분 전"
        if(past < 86400)
            return parseInt(past/3600) + "시간 전"
        past /= 86400
        if(past > 365)
            return parseInt(past/365) + "년 전"
        return past < 31 ? parseInt(past) + "일 전" : parseInt(past/12) + "달 전" 
    }

    const clickBoard = () => {
        axios.get(ip+'/board/hit', { params: { id: board.id }})
        .then(() => {
            board.hit += 1
            getWish()
            setOpen(true)
        })
        .catch(err => {
            console.log(err)
            alert("게시물 클릭응답 오류")
        })
    }
    const getWish = () => {
        axios.get(ip + '/board/wish', { params: {board_id: board.id, user_id: user_id}})
            .then(res => {
                setWish(res.data.isWish)
            })
            .catch(err => {
                console.log(err)
                alert("찜상태조회 응답 오류")
            })
    }

    const boardState = (state) => {
        switch(state){
            default: case 0: case 1:
                break
            case 2: case 3:
                return <span style={{fontWeight: "bold", color: '#cd5c5c', paddingRight: '1rem'}}>거래중</span>
            case 4:
                return <span style={{fontWeight: "bold", color: '#2f4f4f', paddingRight: '1rem'}}>거래완료</span>
        }
    }
    return (
        <div>
            {/* 게시판 썸네일 */}
            <CardActionArea onClick={clickBoard}>
                <Card style={{display: 'flex', height: 150}}>
                    <CardMedia style={{ width: 150, height: 150}}
                     image={board.images==='' ? noimg : board.images }
                    />
                    <CardContent style={{flex: 1}}>
                        <Typography variant="h6" align='left' noWrap style={{maxWidth: 345}}>
                            {board.title}
                        </Typography>
                        <Typography color="textSecondary" align='left'>
                            {String(board.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"}
                        </Typography>
                        <Typography color="textSecondary" align='left'>
                            {board.seller_id}
                        </Typography>
                        <Typography color="textSecondary" align='right'>
                            {boardState(board.state)}
                            {printPast(board.editDateTime) +  "   "} <WhatshotIcon fontSize="small"/> {board.hit}
                        </Typography>
                    </CardContent>
                </Card>
            </CardActionArea>
            {/* 게시판 상세페이지 */}
            <BoardDetail useBoard={[board, getBoards]} useOpen={[open, setOpen]} useWish={[wish, setWish]}/>
        </div>
    )
}
export default withRouter(BoardThum)