import { useChatStore } from '../store/useChatStore'

import ChatContainer from '../components/chatContainer'
import NoChatSelected from '../components/noChatSelected'
import Sidebar from '../components/sidebar'

const HomePage = () => {
  const { selectedUser} = useChatStore();

  return (
    <div className = "h-screen bg-base-200">
      <div className = "flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {<Sidebar />}

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
          <div className="p-4">
            <p className="text-center text-sm text-base-content/50">
              © 2026 Check SAT App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
