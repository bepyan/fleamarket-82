import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { withStyles } from "@material-ui/core/styles";
import {ip} from "../../store/ip"
import axios from "axios"
import { useSnackbar } from 'notistack';

import { Dialog, DialogTitle, Grid, TextField, IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckIcon from '@material-ui/icons/Check';
import SchoolCheck from "../user/schooltest"

import defaultProfileImage from "../../lib/image/profile.png"

const CenterDialog = withStyles((theme) => ({
    root: {
        textAlign : 'center',
        alignItems : 'center',
        fontSize: '10px',
        border:'1px',
        margin:'auto',
    }
}))(Dialog);

function Dialogtest(props) {
    const [Open, setOpen] = useState(false)

    const id = window.sessionStorage.getItem('id')
    const [nickname, setNickname] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [birth, setBirth] = useState("")
    const [school, setSchool] = useState("")

    const [deleteValid, setDeleteValid] = useState(false)

    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        getUserInfo()
        deleteUserInfoValid()
      }, [])

    const getUserInfo = () => {
        axios
          .get(ip + "/mypages/profile", {
            params: {
              id: id //서버에 전송
            },
          })
          .then((data) => {
            const userData = data.data[0];    //받아옴
            setNickname(userData.nickname)
            setName(userData.name)
            setPhone(userData.phone)
            setAddress(userData.address)
            setBirth(userData.birth)
            setSchool(userData.school)
            
          });
    }

    const updateUserInfo = () => {
        axios
            .post(ip + "/mypages/updateinfo", {
                id : id,
                nickname : nickname,
                address : address,
                school : school,
            })
            .then((res) => {
                console.log(res);
                
                window.sessionStorage.setItem('school', school)
                props.refresh()
                enqueueSnackbar('수정되었습니다 !')
            })
            .catch (err => {
                console.log(err)
                enqueueSnackbar('실패하였습니다')
        })
    }

    const checkDeleteAgain = () => {
        if (window.confirm("정말 회원탈퇴를 진행할까요?"))
            return true
        else return false
    }

    /* 회원탈퇴가능한지 유효성검사 */
    const deleteUserInfoValid = () => {
        axios
            .get(ip+'/mypages/deleteinfovalid',{
                params :{
                    user_id : id
                }
            })
            .then(data=>{
                const result = data.data[0].count
                console.log(result)
                if(result!==0) {
                    console.log("회원삭제불가")
                    setDeleteValid(false)}
                else {
                    console.log("회원삭제가능")
                    setDeleteValid(true)}
            })
            .catch(err=>{console.log(err)})
    }
    /* 회원탈퇴 시 내 거래전인 게시물 다 없애며 탈퇴 */
    const deleteUserInfo = () => {

        if (deleteValid && checkDeleteAgain() ) {
                console.log("넘길 아이디 : "+id)
                deleteUserBoard()   // 상태가 0인 나의 게시물도 전부 삭제하는 함수
                deleteUser()
        }
        else {enqueueSnackbar('회원탈퇴가 불가능합니다.')}
    }
    /* DB에서 유저정보삭제 */
    const deleteUser = () => {
        axios
        .post(ip + "/mypages/deleteinfo", {
            id : id
        })
        .then((res) => {
            console.log(res);
            enqueueSnackbar('회원탈퇴 되었습니다.')
            //logout(store)
            //'로그아웃' 후 메인화면으로이동
            props.history.push('/');
        })
        .catch (err => {
            console.log(err)
            enqueueSnackbar('회원탈퇴가 정상적으로 이루어지지 않았습니다.')
        })
    }
    const deleteUserBoard = () => {
        axios
        .post(ip+'/mypages/deleteuserboard', {
            id : id
        })
        .then((res)=>{
            console.log(res);
            enqueueSnackbar("내 '거래 전인 게시물'이 모두 삭제되었습니다.")
        })
        .catch (err => {
            console.log(err)
            enqueueSnackbar("내 게시물이 아직 삭제되지 않았습니다.")
        })
    }

    const closeAndRefresh = () => {
        setOpen(false)
        window.location.reload()
    }

    const isNull = (value) => {
        if (!value) return "아직 없어요 ! :)"
        else return value
    }

       /*학교이름,true false 받아오기 */
       const SendSchool = (school) => {
        
        setSchool(school)
        
    }

    return (
        <div>
            <IconButton variant="text" onClick={() => setOpen(true)}><EditIcon fontSize='large'/></IconButton>

            <CenterDialog open={Open} onClose={() => setOpen(false)}>
                <DialogTitle>회원 정보 수정</DialogTitle>
                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <img src={defaultProfileImage} width="100" height="100" alt="프로필사진"/>
                        </Grid>                        
                        <Grid item xs={12}>
                            <TextField label="ID" value={id} disabled readOnly />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Nickname" value={nickname} onInput={e => setNickname(e.target.value)}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Name" value={name} disabled readOnly />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Phone Number" value={phone} disabled readOnly />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Address" value={address} onInput={e => setAddress(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Birth" value={birth} disabled readOnly />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="School" value={isNull(school)} disabled readOnly />
                            {school ? null : <SchoolCheck  SendSchool={SendSchool}/>}
                        </Grid>
                    </Grid>
                    <br></br>
                    <div style={{marginBottom: '10px'}}>
                        <IconButton variant="text" onClick={() => updateUserInfo()}><CheckIcon color="grey"/></IconButton>
                        <IconButton variant="text" onClick={() => deleteUserInfo()}><DeleteForeverIcon color="grey"/></IconButton>
                        <IconButton variant="text" onClick={() => closeAndRefresh()}><CloseIcon color="grey"/></IconButton>
                    </div>
                </form>
            </CenterDialog>
        </div>
    )
}

export default withRouter(Dialogtest)