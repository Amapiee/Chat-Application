import MessageInput from './messageInput'
import ChatHeader from './chatHeader'
import MessageSkeleton from './skeletons/MessageSkeleton'
import { formatMessageTime } from '../lib/util.js';

import { useChatStore} from '../store/useChatStore';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const chatContainer = () => {
  const { 
      selectedUser, 
      getMessages,
      messages,
      isMessageLoading,
      unsubscribeFromMessages,
      subscribeToMessages
   } = useChatStore();

  const messageEndRef = useRef(null);
  const { authUser } = useAuthStore();

   useEffect(() => {
    if(messageEndRef.current && messages.length > 0)
    {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
   }, [messages])
  
  useEffect(() => {
    getMessages(selectedUser?._id);

    subscribeToMessages();

    return() => unsubscribeFromMessages();

    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

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
            className={`chat ${message.senderID === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderID === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : selectedUser?.profilePic || "/avatar.png"
                }
                alt="profile picture"
              />
            </div>
          </div>

          {/* 2. Phần Header (Tên hoặc Thời gian)*/}
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>

          {/* 3. Phần nội dung tin nhắn*/}
          <div className={`chat-bubble flex flex-col ${message.senderID === authUser._id ? "bg-primary text-primary-content" : "bg-base-300"}`}>
            {message.image && (
              <img
                src={message.image}
                alt="Attached image"
                className="sm:max-w-[200px] rounded-md mb-1"
              />
            )}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
        ))}
        <div ref={MesageEndRef} />
      </div>

      <MessageInput />
    </div>
  )
}

export default chatContainer