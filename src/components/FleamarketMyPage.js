import React from "react";
import { withRouter } from "react-router-dom";
import Profile from "../container/myPage/profile"

function FleamarketMypage(props){

  return (
    <section id="main_contents" style={{marginTop:"-50px"}}>
        <Profile/>
    </section>
  )
}
export default withRouter(FleamarketMypage);