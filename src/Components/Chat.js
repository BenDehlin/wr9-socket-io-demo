import { useState, useEffect } from "react"
import io from "socket.io-client"

const Chat = (props) => {
  const [user, setUser] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    if (!socket) {
      setSocket(io.connect())
    }
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (body) => {
        console.log(body)
        setMessages((prevMessages) => [...prevMessages, body])
      })
    }
  }, [socket])
  return (
    <div>
      <input value={user} onChange={(e) => setUser(e.target.value)} />
      <p>This is the chat</p>
      {messages.map((m) => (
        <div>
          {m.user}: {m.message}
        </div>
      ))}
      <div>
        <input value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => socket.emit("send-message", { message, user })}>
          TEST
        </button>
      </div>
    </div>
  )
}

export default Chat
