import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import { withStyles } from "@material-ui/core/styles";
import defaultProfileImage from "../../lib/image/profile.png"
import { ip } from "../../store/ip"
import axios from "axios"
import Dialogtest from "./dialogtest"
import noimg from "../../lib/image/noimg.png"

import { Table, TableHead, TableBody, TableRow, TableCell, Box, LinearProgress, Typography, Grid, Paper, Tooltip, IconButton } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab"

import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const CenterBox = withStyles((theme) => ({
    root: {
        textAlign: 'center',
        alignItems: 'center',
        border: '2px',
        margin: 'auto',
        padding: '30px',
        width: '60%',

    },
}))(Box);

const CenterTable = withStyles((theme) => ({
    root: {
        textAlign: 'center',
        padding: '50px',
    }
}))(Table);

const FlexBox = withStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        border: '2px',
        margin: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
    }
}))(Box)

const NavyTypography = withStyles((theme) => ({
    root: {
        color: 'Navy',
    }
}))(Typography)

const SizeLinearProgress = withStyles((theme) => ({
    root: {
        height: '20px',
        color: 'pink',
    }
}))(LinearProgress)

function MypageProfile(props) {

    const id = window.sessionStorage.getItem('id')
    const [nickname, setNickname] = useState("")
    const [level, setLevel] = useState("")
    const [responseRate, setResponseRate] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [birth, setBirth] = useState("")
    const [school, setSchool] = useState("")

    //mysell 추가
    const [allMysellList, setAllMysellList] = useState([])
    const [mysellvisibility, setMysellvisibility] = useState("visible")
    const [myselldisplay, setMyselldisplay] = useState("block")

    //mybuy추가
    const [allMybuyList, setAllMybuyList] = useState([])
    const [mybuyvisibility, setMybuyvisibility] = useState("hidden")
    const [mybuydisplay, setMybuydisplay] = useState("none")

    //mywish 추가
    const [allMywishList, setAllMywishList] = useState([])
    const [mywishvisibility, setMywishvisibility] = useState("hidden")
    const [mywishdisplay, setMywishdisplay] = useState("none")

    const [menu, setMenu] = useState('sell')

    useEffect(() => {
        getUserInfo()
        getMysell()
        getMybuy()
        getMywish()
        myLevel()
    }, [])

    const getUserInfo = () => {
        axios
            .get(ip + "/mypages/profile", {
                params: {
                    id: id //서버에 넘긴다 
                },
            })
            .then((data) => {
                const userData = data.data[0];    //받아옴
                
                setNickname(userData.nickname)
                setLevel(userData.level)
                setResponseRate(userData.responseRate)
                setName(userData.name)
                setBirth(userData.birth)
                setAddress(userData.address)
                setPhone(userData.phone)
                setSchool(userData.school)
            });
    }

    const getMysell = () => {
        axios
            .get(ip + "/mypages/mysell", {
                params: {
                    user_id: id //유저아이디 서버에 전송 
                },
            })
            .then((data) => {

                const list = data.data;    //받아옴
                setAllMysellList(list)
                console.log("user id : " + id);
            })
            .catch(err => console.log(err));
    }

    const getMybuy = () => {
        axios
            .get(ip + "/mypages/mybuy", {
                params: {
                    user_id: id //유저아이디로 
                },
            })
            .then((data) => {
                const list = data.data;    //받아옴
                setAllMybuyList(list)
            })
            .catch(err => console.log(err));
    }

    const getMywish = () => {
        axios
            .get(ip + "/mypages/mywish", {
                params: {
                    user_id: id //유저아이디로 
                },
            })
            .then((data) => {
                const list = data.data;    //받아옴
                setAllMywishList(list)
            })
            .catch(err => console.log(err));
    }

    //0: 거래전 1:예약중 2: 거래완료
    const boardState = (conState) => {
        if (conState === 0) {
            return "거래전"
        }
        else if (conState === 1) {
            return "예약중"
        }
        else if (conState === 2) {
            return "거래완료"
        }
        else return "확인불가능"
    }

    const displayMysell = () => {
        setMysellvisibility("visible"); setMyselldisplay("block")
        setMybuyvisibility("hidden"); setMybuydisplay("none")
        setMywishvisibility("hidden"); setMywishdisplay("none")
    }

    const displayMybuy = () => {
        setMysellvisibility("hidden"); setMyselldisplay("none")
        setMybuyvisibility("visible"); setMybuydisplay("block")
        setMywishvisibility("hidden"); setMywishdisplay("none")
    }

    const displayMywish = () => {
        setMysellvisibility("hidden"); setMyselldisplay("none")
        setMybuyvisibility("hidden"); setMybuydisplay("none")
        setMywishvisibility("visible"); setMywishdisplay("block")
    }

    const myLevel = (level) => {
        var lv = parseInt(level / 10)
        //console.log(lv)
        if (lv === 0) return "새내기";
        else if (lv === 1) return "1학년";
        else if (lv === 2) return "2학년";
        else if (lv === 3) return "3학년";
        else if (lv === 4) return "4학년";
        else if (lv === 5) return "석사";
        else if (lv === 6) return "박사";
        else if (lv === 7) return "교수";
        else return "전문가";
    }

    const isNull = (value) => {
        if (!value) return "아직 없어요 ! :)"
        else return value
    }

    const handleMenu = (event, selectedValue) => {
        setMenu(selectedValue);
    };

    const showPhoneNumber = (value) => {
        if (!value) return "아직 없어요 ! :)"
        else {
            return value.substring(0,3)+"-"+value.substring(3,7)+"-"+value.substring(7,11)
        }
    }

    return (
        <Box component="div" padding="100px 0 0 0">
            <CenterBox component="div">
                <Paper>
                    <Grid container spacing={3} style={{ textAlign: "center" }}>
                        <Grid item xs={12}>
                            <FlexBox>
                                <NavyTypography variant="h4">{nickname}</NavyTypography>
                                <Typography variant="h4" color="textSecondary">님 반가워요 !</Typography>
                            </FlexBox>
                        </Grid>
                        <br /><br /><br />
                        <Grid item xs={2} style={{ paddingLeft: "50px" }}>
                            <img src={defaultProfileImage} width="150" height="150" alt="프로필이미지" />
                        </Grid>

                        <Grid item xs={2} style={{ paddingLeft: "40px" }}>
                            <br /><br />
                            <Box component="div" minWidth={100}>
                                <Typography variant="h6" color="textSecondary">내 응답 온도&nbsp;</Typography>
                            </Box>
                            <br />
                            <Box component="div" minWidth={100}>
                                <Typography variant="h6" color="textSecondary">내 레벨&nbsp;</Typography>
                                <Tooltip title="♥레벨 가이드♥&nbsp;&nbsp;&nbsp;&nbsp;새내기 < 1학년 < 2학년 < 3학년 < 4학년 < 석사 < 박사 < 교수 <<< 전문가" placement="bottom">
                                    <IconButton>
                                        <HelpOutlineIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <br /><br />
                            <Box component="div" width="100%">
                                <SizeLinearProgress variant="determinate" value={responseRate} color="secondary"></SizeLinearProgress>
                            </Box>
                            <br /><br />
                            <Box component="div" width="100%">
                                <SizeLinearProgress variant="determinate" value={level} ></SizeLinearProgress>
                            </Box>
                        </Grid>

                        <Grid item xs={2} style={{paddingRight:"30px"}}>
                            <br /><br />
                            <Box component="div" minWidth={100}>
                                <Typography variant="h6" color="textSecondary">&nbsp;{responseRate}℃</Typography>
                            </Box>
                            <br />
                            <Box component="div" minWidth={100}>
                                <Typography variant="h6" color="textSecondary">&nbsp;{myLevel(level)}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </CenterBox>
            <CenterBox component="div">
                <Paper>
                    <Grid container spacing={2}>
                        <Grid item xs={2} style={{ paddingLeft: "50px" }}>
                            <h1 style={{ color: 'navy' }}>내 정보.</h1>
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: 'right', color: "grey" }}>
                            <h3>ID </h3><br />
                            <h3>NAME </h3><br />
                            <h3>BIRTH </h3><br />
                            <h3>PHONE </h3><br />
                            <h3>ADDRESS </h3><br />
                            <h3>SCHOOL </h3><br />
                        </Grid>
                        <Grid item xs={5} style={{ textAlign: 'left', paddingLeft: '50px' }}>
                            <h3>{isNull(id)}</h3><br />
                            <h3>{isNull(name)}</h3><br />
                            <h3>{isNull(birth)}</h3><br />
                            <h3>{showPhoneNumber(phone)}</h3><br />
                            <h3>{isNull(address)}</h3><br />
                            <h3>{isNull(school)}</h3><br />
                        </Grid>
                        <Grid item xs={2} style={{ textAlign: 'right', margin: '10px'}}>
                            {/* {school?null:<div><SchoolCheck  SendSchool={SendSchool}/></div>} */}
                            <Dialogtest refresh={getUserInfo}/> 
                        </Grid> 
                    </Grid>
                </Paper>
            </CenterBox>
            <CenterBox component="div">
                <Paper elevation={0}>
                    <Box component="div" display="block">
                        <ToggleButtonGroup value={menu} onChange={handleMenu} exclusive >
                            <ToggleButton value="sell" onClick={() => displayMysell()} style={{ width: "350px", height: "150px", fontSize: "20px" }}><StoreOutlinedIcon />&nbsp;&nbsp;내 판매게시글</ToggleButton>
                            <ToggleButton value="buy" onClick={() => displayMybuy()} style={{ width: "350px", height: "150px", fontSize: "20px" }}><ShoppingCartOutlinedIcon />&nbsp;&nbsp;내 구매상품 게시글</ToggleButton>
                            <ToggleButton value="wish" onClick={() => displayMywish()} style={{ width: "350px", height: "150px", fontSize: "20px" }}><FavoriteOutlinedIcon />&nbsp;&nbsp;내 찜목록</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Paper>
                <Box component="div" minHeight="500px">
                    {/* mysell */}
                    <Box component="div" display={myselldisplay} visibility={mysellvisibility}>
                        <CenterTable stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="20%">게시글아이디</TableCell>
                                    <TableCell width="20%">제목</TableCell>
                                    <TableCell width="20%">이미지</TableCell>
                                    <TableCell width="20%">가격</TableCell>
                                    <TableCell width="20%">상태</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allMysellList ? allMysellList.map((c, index) => (
                                    <TableRow row={c} key={index}>
                                        <TableCell width="20%">{c.id}</TableCell>
                                        <TableCell width="20%">{c.title}</TableCell>
                                        <TableCell width="20%"><img src={c.images === '' ? noimg : c.images} width="50px" height="50px" alt='img' /></TableCell>
                                        <TableCell width="20%">{String(c.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</TableCell>
                                        <TableCell width="20%">{boardState(c.state)}</TableCell>
                                    </TableRow>

                                )) : ""}
                            </TableBody>
                        </CenterTable>
                    </Box>

                    {/* mybuy */}
                    <Box component="div" display={mybuydisplay} visibility={mybuyvisibility}>
                        <CenterTable stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="20%">게시글아이디</TableCell>
                                    <TableCell width="20%">제목</TableCell>
                                    <TableCell width="20%">이미지</TableCell>
                                    <TableCell width="20%">가격</TableCell>
                                    <TableCell width="20%">거래일시</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allMybuyList ? allMybuyList.map((c, index) => (

                                    <TableRow row={c} key={index}>
                                        <TableCell width="20%">{c.id}</TableCell>
                                        <TableCell width="20%">{c.title}</TableCell>
                                        <TableCell width="20%"><img src={c.images === '' ? noimg : c.images} width="50px" height="50px" alt='img'/></TableCell>
                                        <TableCell width="20%">{String(c.board_price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</TableCell>
                                        <TableCell width="20%">{c.contractDate}</TableCell>
                                    </TableRow>

                                )) : ""}
                            </TableBody>
                        </CenterTable>
                    </Box>

                    {/* mywish */}
                    <Box component="div" display={mywishdisplay} visibility={mywishvisibility}>
                        <CenterTable stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="20%">게시글아이디</TableCell>
                                    <TableCell width="20%">제목</TableCell>
                                    <TableCell width="20%">이미지</TableCell>
                                    <TableCell width="20%">가격</TableCell>
                                    <TableCell width="20%">상태</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allMywishList ? allMywishList.map((c, index) => (

                                    <TableRow row={c} key={index}>
                                        <TableCell width="20%">{c.board_id}</TableCell>
                                        <TableCell width="20%">{c.title}</TableCell>
                                        <TableCell width="20%"><img src={c.images === '' ? noimg : c.images} width="50px" height="50px" alt='img' /></TableCell>
                                        <TableCell width="20%">{String(c.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</TableCell>
                                        <TableCell width="20%">{boardState(c.state)}</TableCell>
                                    </TableRow>

                                )) : ""}
                            </TableBody>
                        </CenterTable>
                    </Box>
                </Box>
            </CenterBox>
        </Box>

    )
}

export default withRouter(MypageProfile)