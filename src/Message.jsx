import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Message extends Component {
  parseType() {
    switch(this.props.message.type) { 
      case 'gifMessage':
        return (<span className="message-content"><img className="gif" src={this.props.message.url} alt="Don't sue me" /><br />{this.props.message.content}</span>);
        break;
      case 'meMessage':
        return (<span className="message-content"><em>{this.props.message.content}</em></span>);
        break;
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

