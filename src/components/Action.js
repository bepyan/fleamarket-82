import React from 'react'
import Chat from "../container/chat/Chat"
import { withRouter } from 'react-router-dom';

import { IconButton } from '@material-ui/core'
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import CloseIcon from '@material-ui/icons/Close';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function Action(props) {
    const [openChat, setOpenChat] = props.useChat
    return (
      <div style={{position: 'fixed', marginLeft: '2rem', zIndex: '99'}}>
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <IconButton onClick={() => setOpenChat(!openChat)} style={{marginRight: '2rem'}}>
            { openChat ? <CloseIcon fontSize="large"/> : <ForumOutlinedIcon fontSize="large"/> }
          </IconButton>
          { openChat ? <Chat/>: null }
        </div>
      </div>
    )
}

export default withRouter(Action)
