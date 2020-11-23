import React from "react";
import { Link, withRouter } from "react-router-dom";
import Store from "../store/store";
import { useSnackbar } from 'notistack';
import logo_Image from "../lib/image/test23.png";
import test from "../lib/image/test24.png"
import { makeStyles,Tooltip } from '@material-ui/core'

const useStyles = makeStyles({
  backImg: {
    width: '100%',
    height: 360,
    backgroundImage:`url(${test})`,
    backgroundSize: 'cover',
    backgroundPosition:"center",
    backgroundRepeat:"no-repeat",
    position: 'absolute',
    zIndex: -1
  },
  logo:{
    maxWidth: '500px', 
    height: '130x', 
    cursor: 'pointer'
  },
  contents:{
    margin: 'auto', 
    textAlign: 'center', 
    paddingTop: 70,
    zIndex: 100
  },
  text:{
    fontSize:"20px",
    fontWeight:"bold"
  },
});

function Header(props) {

  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const id = window.sessionStorage.getItem("id")

  const clickLogo = () => {
    console.log(props.history.location.pathname)
    if(props.history.location.pathname === '/')
      window.location.reload()
    else
      props.history.push('/')
  }
  const logout = (store) => {
    enqueueSnackbar('로그아웃 했습니다')
    store.onLogout()
    props.history.push('/');    /* 체크 */
  }
  

  return (
    <div>
      <div className={classes.backImg}/>
      <div className={classes.contents}>
          <img onClick={() => clickLogo()}
            className={classes.logo}
            src={logo_Image} alt="팔이피플" />
          <Store.Consumer>
            {store => (
              <div style={{marginTop: 20}}>{
              store.logged ?
                <div className={classes.text}>
                  <Tooltip title="클릭시 로그아웃" placement='left'> 
                    <Link onClick={() => logout(store)}> {id}님 &nbsp; 로그아웃 </Link> 
                  </Tooltip>
                </div>
              : 
                <div className={classes.text}>
                  <Link to="/login">  LOGIN / SIGN IN  </Link>
                </div>
              }</div>
            )}
          </Store.Consumer>
      </div>
    </div>
  )
}
export default withRouter(Header)
