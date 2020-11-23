import React, { useState } from "react";
import Store from "../store/store"
import Login from "../container/user/Login";
import Register from "../container/user/Register";

import { Button, Collapse } from "@material-ui/core";
import { withRouter } from "react-router-dom";

function FleamarketLogin() {

  const [open, setOpen] = useState(false)
  
  return (
    <div>
      <Store.Consumer>
        {store => (
            <Login onLogin={store.onLogin}/>
          )}             
      </Store.Consumer>

      <div style={{textAlign: 'center', margin: '2rem'}}>
        <Button onClick={() => setOpen(!open)}> 
          {open ? "닫기" : "회원가입"} 
        </Button>
      </div>
      <Collapse in={open}>
        <Register/>
      </Collapse>

    </div>
  )
}

export default withRouter(FleamarketLogin)