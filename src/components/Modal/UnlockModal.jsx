import React from 'react';
import { withStyles, FormControl, InputLabel, Input } from "material-ui";
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import { api } from "api";

import { 
  //Header, 
  //Footer, 
  //Sidebar,
  //ItemGrid,
  RegularCard,
  //Table,
  //UnlockModal
} from "components";

import customInputStyle from "variables/styles/customInputStyle";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

class UnlockModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      modalData: {},
      warning: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
    this.setState({warning:false});
    this.passPhrase && this.passPhrase.focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleSubmit = (event, modalData, onSuccess) => {
    console.log("handleSubmit");
    console.log("this.passPhrase.value", this.passPhrase.value);
    console.log("this.state.modalData", modalData);
    console.log("args", [].slice.call(arguments));
    event.preventDefault();
    modalData.pass = this.passPhrase.value;
    
    api.unlockAccount(modalData, (err, data) => {
      console.log("api.unlockAccount callback", err, data);
      if (err) {
        console.error("UnlockModal.jsx, api.unlockAccount, error:", err);
        return;
      } else {
        if (data.account.keys && data.account.keys.privateKey) {
          console.log("UnlockModal.jsx, api.unlockAccount, success:");
          console.log(data.account);
          onSuccess(event, data.account);
        } else {
          this.setState({
            "warning": "Invalid passphrase!"
          });
        }
      }
    });
    return false;
  }
  
  render() {
    const { isOpen, closeModal, modalData, ...rest } = this.props;
    console.log("isOpen", isOpen, this.props);

    return (
      <div>
      
        <Modal
          isOpen={isOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Unlock Account Modal"
        >
          <RegularCard
            headerColor="red"
            cardTitle={"Account: " + modalData.name + " is LOCKED!"}
            cardSubtitle="Please Enter passphrase:"
            content={ this.state.warning ? (
              <div>
                <h3 style={{backgroundColor:"red"}}>INVALID PASSPHRASE!</h3>
                <button onClick={closeModal}>close</button>
              </div>
            ) : (
              <div>
                <form onSubmit={(event) => this.handleSubmit(event, modalData, closeModal)}>
                  <input ref={passPhrase => this.passPhrase = passPhrase} style={{width:"400px"}}/>
                </form>
              </div>
            )}
          />
          
        </Modal>
      </div>
    );
  }
}

export default withStyles(customInputStyle)(UnlockModal);
