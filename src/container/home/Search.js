import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {ip} from "../../store/ip"
import { useSnackbar } from 'notistack';

import { Chip, Divider, Fade, Grid, IconButton, InputBase, List, ListItem, ListItemText, Paper, Popper, Tooltip} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import WhatshotOutlinedIcon from '@material-ui/icons/WhatshotOutlined';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import CloseIcon from '@material-ui/icons/Close';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

function Search(props) {
  const user_id = window.sessionStorage.getItem("id")
  const { enqueueSnackbar } = useSnackbar()
  const getBoards = props.getBoards
  const [word, setWord] = props.useWord

  const [anchorEl, setAnchorEl] = useState(null);
  const [hotList, setHotList] = useState([])
  const openHot = Boolean(anchorEl);
  const popper_id = openHot ? 'transitions-popper' : undefined;

  const [showKeywords, setShowKeywords] = useState(true)
  const [keywords, setKeywords] = useState([])

  const submitHandler = (e) => {
    e.preventDefault()
    if(user_id){
      props.history.push("/login")
      return enqueueSnackbar('로그인하셔야 합니다', { variant: 'error'})
    }
    searchHit()
    getBoards({search: word})
  }
  
  // 검색어 입력 횟수 누적
  const searchHit = (text=word) => {
    if(word.replace(' ', '') === '')
      return
    axios.post(ip+'/search', {text: text})
      .then(() => {
        getHotList()
      })
      .catch(err => {
        console.log(err)
        alert("검색어 입력에 실패 했습니다.")
      })
  }
  // 인기 검색어 창 열기
  const clickHot = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget)
    getHotList()
  }
  const getHotList = () => {
    axios.get(ip+'/search', {params: {limit: 5}})
      .then(res => {
        const gets = res.data.searches[0]
        setHotList(gets)
      })
      .catch(err => {
        console.log(err)
        alert("인기 검색어 조회에 실패 했습니다.")
      })
  }
  /* 검색 키워드 */
  const clickKeyword = (text) => {
    setWord(text)
    searchHit(text)
    getBoards({search: text})
  }
  const registKeyword = () => {
    var invaild = (word.replace(' ', '') === '')
    keywords.map((item) => {
      if(item.keyword === word){
        invaild=true
        enqueueSnackbar('['+word +'] 키워드가 이미 있습니다', { variant: 'info'})
      }
    })
    if(invaild)
      return
    axios.post(ip+'/users/keywords/register',  {user_id: user_id, keyword: word})
      .then(() => {
        getKeywords()
        enqueueSnackbar('['+word +'] 키워드를 등록했습니다', { variant: 'success'})
      })
      .catch(err => {
        console.log(err)
        alert("키워드 등록에 실패 했습니다.")
      })
  }
  const deleteKeyword = (item) => {
    axios.post(ip+'/users/keywords/delete',  {id: item.id})
      .then(() => {
        getKeywords()
        enqueueSnackbar('['+item.keyword+'] 키워드를 삭제했습니다')
      })
      .catch(err => {
        console.log(err)
        alert("키워드 삭제에 실패 했습니다.")
      })
  }

  const getKeywords = () => {
    if(!user_id)
      return
    axios.get(ip+'/users/keywords',  { params: {user_id: user_id}})
      .then(res => {
        const gets = res.data.keywords[0]
        setKeywords([...gets])
      })
      .catch(err => {
        console.log(err)
        alert("키워드 조회에 실패 했습니다.")
      })
  }
  useEffect(() => {
    getKeywords()
  }, user_id)

  return (
    <Grid item xs={6}>
      <Grid container justify="center" alignItems="center">
        <form onSubmit={submitHandler}>
          <Paper elevation={5} style={{padding: '2px 4px', display: 'flex', alignItems: 'center', width: 700}}>
            
            <Tooltip title="키워드 등록" placement="left"  >
              <IconButton onClick={registKeyword}>
                <StarRoundedIcon />
              </IconButton>
            </Tooltip>
            <InputBase style={{marginLeft: '1rem', fontWeight: 'bold', fontSize: '1.4rem', color: "#34373B", height: 60}}
              value={word}
              onChange={e => setWord(e.target.value)}
              fullWidth
            />
            <Fade in={word !== ''}> 
                <IconButton onClick={() => {setWord(''); getBoards({search: ''})}}> 
                  <CloseIcon/> 
                </IconButton>
            </Fade>

            <Divider orientation="vertical" style={{ height: 40, margin: 4}}/>

            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
            <Tooltip title="Top5 인기 검색어" placement='right'>
              <IconButton onClick={e => clickHot(e)}>
                <WhatshotOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Popper id={popper_id} open={openHot} anchorEl={anchorEl} transition placement="right">
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <List style={{margin: '2rem'}}>
                  {hotList.map((item, idx) => {
                    return(
                      <ListItem button onClick={() => clickKeyword(item.text)}>
                        <ListItemText primary={(1+idx)+".  "+item.text} />
                      </ListItem>
                      )
                  })}
                </List>
              </Fade>
            )}
            </Popper>
          </Paper>
        </form>
      </Grid>
      <Grid container justify="center" alignItems="center" style={{marginTop: '0.8rem'}}>
        <div style={{display: 'flex', width: 690, overflow: 'auto'}}> 
          {keywords.map((item, idx) => {
            return (
              <Fade in={showKeywords} key={idx} timeout={(idx+1)*100}>
                <Chip variant="outlined"
                  label={item.keyword}
                  onClick={() => clickKeyword(item.keyword)}
                  onDelete={() => deleteKeyword(item)}
                />
              </Fade>
            )
          })}
        </div>
        <Tooltip title="내 키워드 목록" placement='right'>
          <IconButton size='small' onClick={() => setShowKeywords(!showKeywords)}>
            {showKeywords ? <RemoveIcon/> : <AddIcon/> }
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  )
}

export default Search
