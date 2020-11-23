import React, { useEffect, useState } from "react";
import { BrowserRouter as Router,Route, Switch } from "react-router-dom";
import { hot } from 'react-hot-loader'
import { SnackbarProvider } from "notistack";
import "../src/lib/css/main.css"

import Store from "./store/store";
import Header from "./components/Header"
import Home from "./components/FleamarketHome"
import Login from "./components/FleamarketLogin"
import Footer from "./components/Footer"
import Action from "./components/Action"
import MyPage from "./components/FleamarketMyPage"
import socket from '../src/store/socket'

function App() {
  const [logged, setLogged] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const onLogin = () => { setOpenChat(false); setLogged(true) }
  const onLogout = () => {
    setLogged(false)
    setOpenChat(false)
    window.sessionStorage.clear()
  }

  useEffect(() => {
    if(window.sessionStorage.getItem('id'))
      onLogin()

      socket.on("open_chat",()=>{
        setOpenChat(true)
      })    
  }, [])

  return(
    <Store.Provider value={{logged, onLogin, onLogout}}>
      <Router basename="/fleamarket-82">
          <SnackbarProvider maxSnack={3}>
            <Action useChat={[openChat, setOpenChat]}/>
            <Header/>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/mypage" component={MyPage} />
            </Switch>
            <Footer/> 
          </SnackbarProvider>
      </Router>
    </Store.Provider>
  );
}

export default hot(module)(App);