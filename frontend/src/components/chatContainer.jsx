import MessageInput from './messageInput'
import ChatHeader from './chatHeader'
import MessageSkeleton from './skeletons/MessageSkeleton'

import { useChatStore} from '../store/useChatStore';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const chatContainer = () => {
  const { selectedUser, getMessages, messages, isMessageLoading } = useChatStore();
  const { authUser } = useAuthStore();
  
    useEffect(() => {
      getMessages(selectedUser);
    }, [selectedUser, getMessages])

  if(isMessageLoading) {
    return (
       <div className="flex items-center justify-center h-full">
        <ChatHeader />
        <MessageSkeleton/>
        <MessageInput />
       </div>

      )
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <ChatHeader />
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div 
            key={message._id}
            className={`chat ${message.sender._id === authUser._id ? "chat-start" : "chat-end"}`}
          >
            <div className = "chat-image avatar">
              <div className = "size-10 rounded-full border">
                <img 
                src={message.sender._id === authUser._id ?
                  authUser.profilePic || "avatar.png" :
                  message.sender.profilePic || "avatar.png" }
                alt="profile picture" 
                />
              </div>
              <div className = "chat-header mb-1">
                  <time className = "text-xs opacity-60 ml-1" datetime="">
                    {message.createdAt}
                  </time>
              </div>
            </div>  
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default chatContainer