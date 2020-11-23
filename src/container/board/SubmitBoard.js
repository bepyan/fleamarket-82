import React, { useEffect, useState } from 'react'
import { storage } from "../../firebase/firebase";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from '@material-ui/core';

function SubmitBoard(props) {
    const [imgUrls, setImgUrls] = useState("")
    const [progress, setProgress] = useState("")
    const [open, setOpen] = props.useOpen()
    //const submit = props.submit
    
    useEffect(() => {
        preSubmit()
    }, [])

    const preSubmit = () => {
        setOpen(true)
        var urls = ""
        props.imgAry.forEach((file) => {
            const route = "images/" + file.name + "_" + new Date().toLocaleTimeString();
            const uploadTask = storage.ref(route).put(file);
            uploadTask.on(
                "state_changed",
                (snapshot) => { 
                    setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                },
                (err) => {
                    console.log(err);
                },
                () => { // 이미지 url 다운로드
                    uploadTask.snapshot.ref.getDownloadURL()
                        .then((downloadURL) => {
                            urls = urls + " " + downloadURL
                            setImgUrls(urls)
                        })
                }
            )
        })      
    }
    // 게시물 게시
    const submit = ()  => {
        setOpen(false)
    }
    return (
        <Dialog open={open}>
            <DialogTitle> 과연?? </DialogTitle>
            <DialogContent>
                
                <LinearProgress variant="determinate" value={progress} />
                <DialogContentText id="alert-dialog-slide-description">
                    사진 업로드 중입니다 잠시 기다려 주세요..
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => submit()} disabled={loading}>
                    확인
                </Button>
                {loading && <CircularProgress size={24}/>}
            </DialogActions>
        </Dialog>
    )
}

export default SubmitBoard
