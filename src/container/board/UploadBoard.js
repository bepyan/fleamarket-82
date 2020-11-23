import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios'
import {ip} from "../../store/ip"
import getImageUrls from "../../firebase/getImageUrls";
import Progress from "./Progress";
import Alert from '../home/Alert'

import { Dialog, DialogContent, DialogContentText, Grid, IconButton, Input, InputAdornment, Paper, TextField, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import ImageUpload from "./ImageUpload";
import NearMeRoundedIcon from '@material-ui/icons/NearMeRounded';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

// 이 친구를 모달로 띄울지 아니면 Transitions으로 어코디언할지
// url 의 params 를 활용하여 /upload 가 붙여야 보여주기
function UploadBoardPage(props) {
    const { enqueueSnackbar } = useSnackbar()

    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [contents, setContents] = useState("")
    const [imgUrls, setImgUrls] = useState("")
    const [imgAry, setImgAry] = useState([])
    const [imgBase64Ary, setImgBase64Ary] = useState([]) // 미리보기

    const [open, setOpen] = useState(false) 
    const [loading, setLoading] = useState(0)

    const [alertOption, setAlertOption] = useState({})
    const contentAlert = {open: true, text: "모든 값을 넣어 주셔야 합니다"}

    // 숫자만 입력, 억 단위 이상은 지원 XX (sql price 길기가 9자리까지 수용)
    const priceChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if(value.length < 10)
            setPrice(value)
    }
    const reset = () => {
        setTitle(''); setPrice(''); setContents(''); 
        setImgUrls(''); setImgAry([]); setImgBase64Ary([])
        setLoading(0)
    }
    // 파이어베이스에 사진 업로드
    const preUpload = () => {
        if(!title || !contents || !price)
            return setAlertOption(contentAlert)
        
        if(imgAry.length){
            setOpen(true)
            getImageUrls({imgAry:imgAry, setLoading: setLoading, setImgUrls: setImgUrls})
        } else
            submit()
    }
    // 게시물 게시
    const submit = ()  => {
        const body  = {
            seller_id: window.sessionStorage.getItem('id'),
            title: title,
            images: imgUrls,
            contents: contents,
            price: price
        }
        axios.post(ip + "/board/upload", body)
        .then(res => {
            if(res.status !== 200)
                return enqueueSnackbar('상품 업로드에 실패 했습니다.', {variant:'error'})
            props.setOpenUL(false)
            props.getBoards()
            enqueueSnackbar('상품 업로드에 성공 했습니다.', {variant:'success'})
            reset()
        })
        .catch(err => {
            console.log(err)
            alert(err)
        })
        setOpen(false)
    }
    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <Paper elevation={3} style={{padding: '40px 100px 100px 100px'}}>
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h2> 상품 업로드</h2>
                </div>
                <Grid container spacing = {3}>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => {setTitle(e.target.value)}} 
                            value={title} 
                            label="글 제목" 
                            fullWidth/>
                    </Grid>
                    <Grid item xs={12}>
                        <Input onChange={priceChange} 
                            value={price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                            placeholder="가격 입력" 
                            labelwidth={40}
                            startAdornment={<InputAdornment position="start">₩</InputAdornment>}/>
                        <br/>
                        <Typography variant="caption"> 이더리움(ETH) {price *(0.0000227)} </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={(e) => {setContents(e.target.value)}} 
                            value={contents} 
                            placeholder="올릴 게시글 내용을 작성해주세요." 
                            variant="outlined" 
                            multiline fullWidth
                            rows={7}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ImageUpload useImgAry={[imgAry, setImgAry]} useImgBase64Ary={[imgBase64Ary, setImgBase64Ary]} />
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{textAlign: 'center'}}>
                            <IconButton onClick={reset}>
                                <SettingsBackupRestoreIcon fontSize='large'/>
                            </IconButton>
                            <IconButton onClick={preUpload}>
                                <NearMeRoundedIcon fontSize='large'/>
                            </IconButton>
                        </div>
                    </Grid>
                    <Alert option={alertOption}/>
                
                    <Dialog open={open}>
                        <DialogContent style={{width: "400px", textAlign: "center"}}>
                            <Progress value={loading}/>
                            <DialogContentText>
                                사진 업로드 중입니다
                            </DialogContentText>
                            <IconButton onClick={() => submit()} disabled={loading !== 100}>
                                <DoneIcon/>
                            </IconButton>
                            <IconButton onClick={() => setOpen(false)}>
                                <CloseIcon/>
                            </IconButton>
                        </DialogContent>
                    </Dialog>
                </Grid>
            </Paper>
            </div>
    );
}
export default withRouter(UploadBoardPage)