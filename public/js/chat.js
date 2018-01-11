let socket = io()
function Message(props) {
  console.log(props)
  return (<div className={props.isCurrentUser ? "current-user" : "other-user"}>
  {props.pic && !props.isCurrentUser && <img className='user-picture' src={'images/' + props.pic}/>}
  <div>{props.message}</div>
  </div>)
}
class ChatInput extends React.Component {
  state = {
    theMessage: ""
  }
  render() {
    return <div className={this.props.class}>
      <input type="text" 
        onKeyDown={this.checkForEnter} 
        value={this.state.theMessage} 
        onChange={this.handleChange} 
        placeholder="Type here..."
      />
      {this.props.button && <button onClick={this.submitMessage}>Send</button>}
    </div>
  }
  
  handleChange = event => this.setState({theMessage: event.target.value})
  submitMessage = () => {
    this.props.onSubmit(this.state.theMessage)
    this.setState({theMessage : ""})
  }
  checkForEnter = keyEvent => keyEvent.key == 'Enter' && this.submitMessage()
}
function Login(props) {
  return <div className={props.class}>
    <ChatInput onSubmit={props.onSubmit} button={false}/>
  </div>  
}
class Chat extends React.Component {
  state = {
    messages: [],
    currentUser: "",
    showChat: true,
    showLogin: true,
    showMessages: false
  }
  chatContainer = null
  render () {
    return <div className={this.state.showChat ? 'fnWrap' : 'close'}>
      <div className='close-bar' onClick={this.collapseChat}/>
      <Login 
        class={this.state.showLogin ? 'loginPage' : 'hidden'}
        onSubmit={this.login}
      />
      <div className={this.state.showMessages ? 'chat-page' : 'hidden'} ref={ e => this.chatContainer = e}>
        <div className="messages">
          {this.state.messages.map(message => 
          <Message
            key={message.id}
            pic={message.pictureUrl}
            isCurrentUser={this.state.currentUser==message.user}
            message={message.message}
          />
          )}
        </div>
      </div>
      <ChatInput 
          class={this.state.showMessages ? 'chat-message-input' : 'hidden'} 
          inputType="chat message" 
          onSubmit={this.submitMessage}
          button={true}
      />
    </div>
  }
  componentDidMount() {
    socket.on('chat message', data => {
      this.setState({
          messages : this.state.messages.concat({
            id: data.id,
            user: data.username,
            message: data.message,
            pictureUrl: data.profilePicUrl
        })
      })
    })
    socket.on('user joined', data => {
  
      this.setState({
        messages : this.state.messages.concat({
          user: null,
          message: data.prefix + data.username + data.postfix
        })
      })
    })
    socket.on('add profile picture', profPicUrl => this.setState())
  }
  login = userName => this.setState({currentUser: userName, showLogin: false, showMessages: true}, () => socket.emit('user joined', userName))
  submitMessage = submittedMessage => submittedMessage && socket.emit('chat message', submittedMessage)
  scrollToBottom = container => container.scrollTo(0, container.clientHeight)
  componentDidUpdate () {
    let chatWrap = this.chatContainer 
    console.log("Clientheight: " + chatWrap.clientHeight + " scrollTop: " + chatWrap.scrollTop + "scrollheight: " + chatWrap.scrollHeight)
    if ((chatWrap.scrollHeight - chatWrap.scrollTop - chatWrap.clientHeight) < 50) {
      chatWrap.scrollTo(0, 10000)
    }
  }
  collapseChat = () => this.setState({showChat: this.state.showChat ? false : true})
}

ReactDOM.render(
  <Chat/>,
  document.getElementById('root')
);
