let socket = io()
class Message extends React.Component {
  render() {
    return (<div style={{textAlign: this.props.isCurrentUser ? "right" : "left"}}>
      {
      this.props.user ? this.props.user + ":" + this.props.message  
      : this.props.message
      }
    </div>)
  }
}
class ChatInput extends React.Component {
  state = {
    theMessage: ""
  }
  render() {
    return <div>
      <input type="text" 
        onKeyDown={this.checkForEnter} 
        value={this.state.theMessage} 
        onChange={this.handleChange} 
        placeholder="Type here..."
      />
      <button onClick={this.submitMessage}>Send</button>
    </div>
  }
  handleChange = event => this.setState({theMessage: event.target.value})
  submitMessage = () => {
    this.props.onSubmit({
      message: this.state.theMessage,
      messageType: this.props.inputType 
    })
    this.setState({theMessage : ""})
  }
  checkForEnter = keyEvent => { if (keyEvent.key == 'Enter') this.submitMessage() }
}
class Chat extends React.Component {
  state = {
    messages: [{
      user: 'Foo',
      message: 'bar'
    },
    {
      user: 'Bar',
      message: 'foo'
    },
    {
      user: 'Batman',
      message: 'Super sad backstory'
    }],
    currentUser: ""
  }
  render () {
    return <div>
      <ChatInput inputType="user joined" onSubmit={this.submitMessage}/>
      {this.state.messages.map(message => 
      <Message 
        user={message.user}
        message={message.message}
        isCurrentUser={message.user == this.state.currentUser}
      />
      )}
      <ChatInput inputType="chat message" onSubmit={this.submitMessage}/>
    </div>
  }
  componentDidMount() {
    socket.on('chat message', data => {
      this.setState({
          messages : this.state.messages.concat({
            user: data.username,
            message: data.message
        })
      })
    })
    socket.on('user joined', data => {
      console.log("got here")
      this.setState({
        messages : this.state.messages.concat({
          user: null,
          message: data.prefix + data.username + data.postfix
        })
      })
    })
  }
  submitMessage = submittedMessage => {
    console.log(submittedMessage.message)
    if (submittedMessage.message) {
      submittedMessage.messageType=='user joined' ? this.setState({ currentUser: submittedMessage.message }, () => {
        socket.emit(submittedMessage.messageType, submittedMessage.message)
        }) 
      : socket.emit(submittedMessage.messageType, submittedMessage.message)
    }
  }
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