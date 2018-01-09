let socket = io()
function Message(props) {
  return (<div className={props.isCurrentUser ? "current-user" : "other-user"}><div>
    {!props.isCurrentUser && props.user} {props.message}
  </div></div>)
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
            isCurrentUser={this.state.currentUser==message.user}
            user={message.user ? message.user + ": " : ''}
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
            message: data.message
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
// function closeChat() {
//   if (document.getElementById('contentWrapper').classList.contains('hidden')) {
//     document.getElementById('fnWrap').classList.add('fnWrap');
//     document.getElementById('fnWrap').classList.remove('close');
//     document.getElementById('contentWrapper').classList.remove('hidden');
//     document.getElementById('chatWrapper').classList.remove('hidden');
//     document.getElementById('chatWrapper').classList.add('chatWrapper');
//   }
//   else {
//     document.getElementById('fnWrap').classList.remove('fnWrap');
//     document.getElementById('fnWrap').classList.add('close');
//     document.getElementById('contentWrapper').classList.add('hidden');
//     document.getElementById('chatWrapper').classList.remove('chatWrapper');
//     document.getElementById('chatWrapper').classList.add('hidden');
//   }
// }
// document.addEventListener('DOMContentLoaded', function () {
//   //Login variables
//   var chatWrap = document.getElementById('chatWrapper');
//   var loginPage = document.getElementById('loginPage');
//   var usernameInput = document.getElementById('usernameInput');

//   var messageWrapper = document.getElementById('messagewrapper');
//   var messages = document.getElementById('messages');
//   var inputMessage = document.getElementById('chatMessage');
//   var chatPage = document.getElementById('chatPage');
//   var chat = document.getElementById('chat');
//   var headBar = document.getElementById('headBar');

//   var username;

//   usernameInput.addEventListener('keypress', function(e) {
//     if (e.keyCode === 13) {
//       if (usernameInput.value) {
//         username = usernameInput.value;
//         loginPage.classList.remove('loginPage');
//         loginPage.classList.add('hidden');
//         chatPage.classList.remove('hidden');
//         chat.classList.remove('hidden');
//         inputMessage.focus();
//         socket.emit('add user', usernameInput.value);
//         socket.emit('user joined');
//       }
//     }
//   });
//   var socket = io();

//   chat.addEventListener('submit', function(e) {
//     socket.emit('chat message', inputMessage.value, socket.id);
//     inputMessage.value = '';
//     e.preventDefault();
//   });

//   //This is called when a user joins
//   socket.on('user joined', function (data) {
//     var joinedUser = document.createElement('li');
//     joinedUser.innerHTML = data.prefix + data.username + data.postfix;

//     // Determine if we should scroll to bottom after inserting the message.
//     var atBottom = false;
//     if ((chatWrap.scrollHeight - chatWrap.scrollTop - chatWrap.clientHeight) < 50) {
//       atBottom = true;
//     }

//     // Add the message item to the list and, maybe, scroll to bottom.
//     document.getElementById('messages').appendChild(joinedUser);
//     if (atBottom == true) {
//       chatWrap.scrollTo(0, chatWrap.scrollHeight);
//     }
//   });

//   // This is called when the server emits 'chat message', when it has received a message.
//   // Not called when the client emits 'chat message'.
//   socket.on('chat message', function(data) {
//     // Create a new item in the chat list
//     var item = document.createElement('li');
//     if (socket.id == data.sId) {
//       item.classList.add('userWritten');
//     } else {
//       item.classList.add('othersWritten');
//     }
//     item.innerHTML = data.username + ": " + data.message;

//     // Determine if we should scroll to bottom after inserting the message.
//     var atBottom = false;
//     if ((chatWrap.scrollHeight - chatWrap.scrollTop - chatWrap.clientHeight) < 50) {
//       atBottom = true;
//     }

//     // Add the message item to the list and, maybe, scroll to bottom.
//     document.getElementById('messages').appendChild(item);
//     if (atBottom == true) {
//       chatWrap.scrollTo(0, chatWrap.scrollHeight);
//     }
//   });
// });