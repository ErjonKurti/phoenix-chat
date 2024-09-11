import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/ChatBox/ChatBox'
import RightSidebar from '../../components/RightSidebar/RightSidebar'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets'

const Chat = () => {

  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData])

  return (
    <div className='chat'>
      {loading
        ? <p className='loading'>
          Loading...
        </p>
        : <div className="chat-container">
          <video className="background-video"  autoPlay loop muted>
            <source src={assets.Supra} type="video/mp4" />
          </video>
          <LeftSidebar />
          <ChatBox />
          <RightSidebar />
        </div>
      }

    </div>
  )
}

export default Chat
