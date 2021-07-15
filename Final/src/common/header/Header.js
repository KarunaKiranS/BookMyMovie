import React, {useState} from 'react';
import './Header.css';
import ReactLogo from '../../assets/logo.svg';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import {Paper, Tab, Tabs} from "@material-ui/core";
import Login from "./Login";
import Register from "./Register";
import { Link } from "react-router-dom";
import { useAppContext } from "../../screens/loginContext"

export default function Header (props) {

    const {isAuthenticated, userHasAuthenticated} = useAppContext();

    const [isOpen, setIsOpen] = useState(false);
    function toggleModal() { setIsOpen(!isOpen);}
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => { setValue(newValue); };

    return <div className="heading">

            <img src={ReactLogo} alt="React Logo" className="rotate" />
            <div className="buttons">

                {isAuthenticated
                    ?<div className="btn02"><Button variant="contained" color="default" name="Logout" onClick={()=> userHasAuthenticated(false)}> Logout </Button></div>
                    :<div className="btn01"><Button variant="contained" color="default" name="Login" onClick={toggleModal}> Login </Button></div>}

                <div>
                    <Modal isOpen={isOpen} onRequestClose={toggleModal}
                           style={{
                               overlay: {
                                   position: 'fixed',
                                   top: 0,
                                   left: 0,
                                   right: 0,
                                   bottom: 0,
                                   backgroundColor: 'rgba(255, 255, 255, 0.75)',
                                   display: 'flex',
                                   justifyContent: 'center',
                                   alignItems: 'center'
                               },
                               content: {
                                   position: 'absolute',
                                   top: '20%',
                                   left: '40%',
                                   height: 'fit-content',
                                   width: 'fit-content',
                                   background: '#fff',
                                   outline: 'none',
                                   padding: '0px',
                               }
                           }}
                    >
                        <Paper className="myPaper">
                            <Tabs value={value} onChange={handleChange} indicatorColor="secondary" textColor="inherit" centered >
                                <Tab label="Login" ></Tab>
                                <Tab label="Register" ></Tab>
                            </Tabs>
                            <TabPanel value={value} index={0}><Login toggleModal={toggleModal}/></TabPanel>
                            <TabPanel value={value} index={1}><Register/></TabPanel>
                        </Paper>
                    </Modal>
                </div>
                <div className="btn2">
                    {props.bookShow ? <Link to={"/bookShow/"+props.id}><Button variant="contained" color="primary" name="BookShow" > Book Show </Button></Link> : null}
                </div>>

            </div>

        </div>
}

function TabPanel(props){
    const {children,value,index}=props;
    return( <div>
        {
            value===index && (<div style={{margin: '0px'}}>{children}</div>)
        }
    </div>)
}