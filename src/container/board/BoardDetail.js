import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {ip} from "../../store/ip"
import getImageUrls from "../../firebase/getImageUrls";
import ImageUpload from "./ImageUpload";
import Progress from "./Progress";

import { Button, IconButton, InputAdornment, InputBase, Typography } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import DeleteOutlineRoundedIcon from '@material-ui/icons/DeleteOutlineRounded';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

// 여러 상세페이지를 띄워 주고 싶은 기능 생각해야
function BoardDetail(props) {
    const { enqueueSnackbar } = useSnackbar()
    const user_id = window.sessionStorage.getItem("id")
    const [open, setOpen] = props.useOpen
    //var board = JSON.parse(JSON.stringify(props.board)) // 깊은 복사
    const [board, getBoards] = props.useBoard
    const oriImgAry = board.images === '' ? [] : board.images.split(" ")
    const [fullImg,setFullImg]=useState("")
    const [openImgModal,setOpenImgModal]=useState(false)
    
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [contents, setContents] = useState('')
    const [imgUrls, setImgUrls] = useState('')
    const [imgAry,setImgAry] = useState([])
    const [imgBase64Ary, setImgBase64Ary] = useState([]) // 미리보기
    const [responseTmp, setResPonseTmp] = useState('')
    const [level, setLevel] = useState('')
    
    useEffect(() => {
        setTitle(board.title)
        setPrice(board.price)
        setContents(board.contents)
        setImgUrls('')
        setImgAry(board.images.split(" "))
        setImgBase64Ary([])
        getSellerInfo()
    }, [board])

    const [edit, setEdit] = useState(false)
    const [wish, setWish] = props.useWish   

    const [openDialog, setOpenDialog] = useState(false) 
    const [loading, setLoading] = useState(0)


    const getSellerInfo = () => {
        axios
        .get(ip + '/board/sellerInfo', {
            params : {
                board_id : board.id
            }
        })
        .then((data) => {
            const result = data.data[0]
            if (result) {
                setResPonseTmp(result.responseRate)
                setLevel(result.level)
            }
        })
        .catch(err => console.log(err))
    }
    const myLevel = (level) => {
        var lv = parseInt(level / 10)
        if (lv === 0) return "새내기";
        else if (lv === 1) return "1 학년";
        else if (lv === 2) return "2 학년";
        else if (lv === 3) return "3 학년";
        else if (lv === 4) return "4 학년";
        else if (lv === 5) return "석사";
        else if (lv === 6) return "박사";
        else if (lv === 7) return "교수";
        else return "전문가";
    }
    const levelColor = (level) => {
        switch(level){
            case 0: return '#2f4f4f'
            case 1: return '#cd853f'
            case 2: return '#b8860b'
            case 3: return '#006400'
            case 4: return '#808000'
            case 5: return '#000080'
            case 6: return '#7b68ee'
            case 7: return '#f08080'
            default: return 'red'
        }
    }
    const tmpColor = (tmp) => {
        if(tmp > 37.0)
            return '#ff00ff'
        else if(tmp > 36.5)
            return '#dc143c'
        else if (tmp === 36.5)
            return '#ff4500'
        else
            return '#4169e1'
    }
    const deleteBoard = () => {
        axios
            .post(ip + '/board/deleteboard', {
            board_id: board.id
            })
            .then((data) => {
                const state = data.data
                setOpen(false)
                getBoards()
                if (state===0 || state===1 || state===7 || state===11) 
                    enqueueSnackbar('게시글을 삭제했습니다.', { variant: 'success' })
                else if (state === 4)
                    enqueueSnackbar('거래완료한 게시글은 삭제할 수 없습니다.')
                else
                    enqueueSnackbar('거래중인 게시글을 삭제하지 못했습니다.')
            })
            .catch(err => {
                console.log(err)
                alert("게시물 삭제응답 오류")
            })
    }
    
    const preEditBoard = (vaild) => {
        setEdit(false)
        if(vaild === false){ // 변경 초기화
            setTitle(board.title); setPrice(board.price); setContents(board.contents)
            setImgUrls(''); setImgAry(oriImgAry); setImgBase64Ary([]);
            return
        }
        var isImgChange = false
        var isNewImage = false
        if(oriImgAry.length === imgAry.length){
            oriImgAry.forEach((img, idx) => {
                if(img !== imgAry[idx])
                    isNewImage = true
            })
        } else {
            isImgChange = true
            imgAry.forEach((img) => {
                if(typeof(img) !== 'string')
                    isNewImage = true
            })
        }
        // firebase에 upload할 사진이 있다면
        if(isNewImage){
            getImageUrls({imgAry: imgAry, setLoading: setLoading, setImgUrls: setImgUrls})
            setOpenDialog(true)
        }
        else{
            var tmpUrls = ""
            imgAry.forEach((url) => { tmpUrls = (tmpUrls === "" ? url : tmpUrls + " " + url) })
            editBoard(isImgChange, tmpUrls)
        }
        
    }
    const editBoard = (imgChange, url) => {
        if(board.title === title && !imgChange && board.contents === contents && board.price === price)
            return
        const body  = {
            board_id: board.id,
            title: title,
            images: url,
            contents: contents,
            price: price
        }
        axios.post(ip+'/board/edit', body)
            .then(() => {
                getBoards()
                enqueueSnackbar('게시물이 수정되었습니다', { variant: 'success'})
                setOpenDialog(false)
                setOpen(false)
            })
            .catch(err => {
                console.log(err)
                alert("게시물 수정 오류")
            })
    }
    const creatChat = () => {
        if(!user_id)
            return enqueueSnackbar('로그인하셔야 합니다', { variant: 'error'})

        axios.post(ip+'/chat/new', {seller_id: board.seller_id, buyer_id: user_id, board_id: board.id})
            .then(res => {
                if(!res.data.success)
                    return enqueueSnackbar(res.data.message)
                setOpen(false)
                enqueueSnackbar(board.seller_id + '님과 대화를 시작합니다.')
            })
            .catch(err => {
                console.log(err)
                alert("채팅방 개설응답 오류")
            })

        
    }
    const wishBoard = () => {
        if(!user_id)
            return enqueueSnackbar('로그인하셔야 합니다', { variant: 'error'})
            
        axios.post(ip+'/board/wish', {isWish: wish, user_id: user_id, board_id: board.id})
        .then(() => {
            const message = wish ? "  [찜하기] 해제했습니다!" : "  [찜하기] 시전!"
            setWish(!wish)
            enqueueSnackbar(board.title + message)
        })
        .catch(err => {
            console.log(err)
            alert("게시물 찜하기 오류")
        })
    }

    // 이미지 크게 보는 modal
    const clickImgModal=(img)=>{ 
        setOpenImgModal(true)
        setFullImg(img)
    }
    const Imagesmodal=()=>{ 
        return(
            <Dialog open={openImgModal} onClose={() => setOpenImgModal(false)} 
                fullWidth={true} maxWidth={'lg'}>
                <img src={fullImg} alt="fullImg" onClick={() => setOpenImgModal(false)}
                    style={{maxWidth: '100%', maxHeight: '100%', bottom: 0, left: 0,right: 0, top: 0,
                    margin: 'auto',overflow: 'auto',position: 'fixed'}}/>
           </Dialog>
        )
    }

    // 숫자만 입력, 3자리 끊기, 억 단위 이상은 지원 XX (sql price 길기가 9자리까지 수용)
    const priceChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if(value.length < 10)
            setPrice(value)
    }
    
    const BoardAction = () => {
        if(board.seller_id === user_id)
            return (<div style={{display: 'flex'}}>
                { edit ? <div> 
                    <IconButton onClick={() => preEditBoard(true)}> 
                        <DoneIcon/>
                    </IconButton>
                    <IconButton onClick={() => preEditBoard(false)}>
                        <CloseIcon/>
                    </IconButton>
                </div> :
                    <IconButton onClick={() => setEdit(true)}>
                        <EditOutlinedIcon/>
                    </IconButton>
                }
                    <IconButton onClick={() => deleteBoard()}>
                        <DeleteOutlineRoundedIcon/>
                    </IconButton>
            </div>)
        else return (
                <div>
                    <IconButton onClick={()=>wishBoard()}>
                        {wish ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                    </IconButton>
                    <Button autoFocus onClick={()=>creatChat()} color="primary">
                        판매자와 채팅하기
                    </Button>
                </div>
    )}
    /* 상품의 디테일 페이지 */
    return (
        <Dialog open={open} onClose={() => {preEditBoard(false); setOpen(false)}} scroll = 'paper' maxWidth={"lg"}>
            {/* 상품 타이틀 */}
            <DialogTitle>
                <InputBase style={{ fontWeight: 'bold', fontSize: 'large', height: '13px'}}
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    fullWidth
                    readOnly={!edit}  
                />
                <Typography variant="overline">
                    {board.seller_id ? board.seller_id : '탈퇴한 사용자'}
                </Typography>
                <Typography variant="overline" style={{marginLeft: '2rem', fontWeight: 'bold', color: tmpColor(responseTmp)}}>
                    {responseTmp}℃
                </Typography>
                <Typography variant="overline" style={{marginLeft: '1rem', fontWeight: 'bold', color: levelColor(level)}}>
                    {myLevel(level)}
                </Typography>
                <div>
                    <InputBase
                        onChange={(e) => priceChange(e)}
                        value={String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        readOnly={!edit}
                        startAdornment={<InputAdornment position="start">₩</InputAdornment>}
                    />
                    <Typography variant="caption"> 이더리움(ETH) <span style={{fontWeight: 'bold'}}>{price *(0.0000227)}</span> </Typography>
                </div>
            </DialogTitle>

            {/* 상품 상세정보 */}
            <DialogContent dividers style={{ minWidth: 500, maxWidth: 650, minHeight: 600 }}>
                <DialogContentText tabIndex={-1}>
                    <InputBase
                        onChange={(e) => setContents(e.target.value)}
                        value={contents}
                        multiline
                        rows={7} rowsMin={7}
                        readOnly={!edit}
                    />
                </DialogContentText>

                { edit ? <ImageUpload useImgAry={[imgAry, setImgAry]} useImgBase64Ary={[imgBase64Ary, setImgBase64Ary]} /> 
                    : <div>{
                        imgAry.map((image,index) => {
                            return ( 
                                typeof(image) !== 'string' || image === '' ? null :
                                <div key={index} onClick={()=>clickImgModal(image)}
                                    style={{width: 200, height: 200, border: "1px solid #e4e4e4",
                                        backgroundImage: `url(${image})`, backgroundSize:'contain', backgroundPosition:"center", backgroundRepeat:"no-repeat",
                                        display: "inline-block", marginTop:"20px",}}
                                />
                        )})
                    }</div>
                }
                {Imagesmodal()}    

                <Dialog open={openDialog}>
                    <DialogContent style={{width: "400px", textAlign: "center"}}>
                        <Progress value={loading}/>
                        <DialogContentText>
                            사진 업로드 중입니다
                        </DialogContentText>
                        <IconButton onClick={() => editBoard(true, imgUrls)} disabled={loading !== 100}>
                            <DoneIcon/>
                        </IconButton>
                        <IconButton onClick={() => setOpenDialog(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </DialogContent>
                </Dialog>
            </DialogContent>

            {/* 기능수행 */}
            <DialogActions>
                <BoardAction/>
            </DialogActions>
        </Dialog>
    )
}
export default withRouter(BoardDetail)