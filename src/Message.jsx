import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Message extends Component {
  parseType() {
    switch(this.props.message.type) { 
      case 'errorMessage':
        return (<span className="message-content error">{this.props.message.content}</span>);
        break;
      default:
        return (<span className="message-content">{this.props.message.content}</span>);
        break;
    } 
  }
  render(){
    return (
      <div className="message">
        <span className="message-username">{this.props.message.username}</span>
        {this.parseType()} 
      </div>
    );
  }
}
export default Message;

