import React from 'react';
import { withStyles, FormControl, InputLabel, Input, Button } from "material-ui";
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

class CreateModal extends React.Component {
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
    this.name && this.pass && this.name.focus();
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleSubmit = (event, modalData, onSuccess) => {
    console.log("handleSubmit");
    console.log("this.name.value", this.name.value);
    console.log("this.pass.value", this.pass.value);
    console.log("this.state.modalData", modalData);
    console.log("args", [].slice.call(arguments));
    event.preventDefault();
    modalData.name = this.name.value;
    modalData.pass = this.pass.value;
    console.log("modalData", modalData);
    api.createAccount(modalData, (err, data) => {
      console.log("api.createAccount callback", err, data);
      if (err) {
        console.error("CreateModal.jsx, api.createAccount, error:", err);
        return;
      } else {
        if (data.keys) {
          console.log("CreateModal.jsx, api.createAccount, success:");
          console.log(data);
          onSuccess(event, data);
        } else {
          this.setState({
            "warning": "Invalid name or passphrase!"
          });
        }
      }
    });
    return false;
  }
  /*
  this.state.warning ? (
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
            )
  */
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
          contentLabel="Create Account Modal"
        >
          <RegularCard
            headerColor="red"
            cardTitle={"Create a new account."}
            cardSubtitle="Please Enter Name and Passphrase:"
            content={ this.state.warning ? (
              <div>
                <h3 style={{backgroundColor:"red"}}>{this.state.warning}</h3>
                <button onClick={closeModal}>close</button>
              </div>
            ) : (
              <div>
                <form onSubmit={(event) => this.handleSubmit(event, modalData, closeModal)}>
                  <div>Name:</div>
                  <input ref={name => this.name = name} style={{width:"400px"}}/>
                  <div>Passphrase:</div>
                  <input ref={pass => this.pass = pass} style={{width:"400px"}}/>
                  <div>
                    <Button type="submit" variant="raised" color="default">
                      Create Account
                    </Button>
                  </div>
                </form>
              </div>
            )}
          />
          
        </Modal>
      </div>
    );
  }
}

export default withStyles(customInputStyle)(CreateModal);
