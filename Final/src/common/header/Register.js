import React, {useState} from "react";
import {ValidatorForm} from "react-material-ui-form-validator";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import './Register.css';
import FormHelperText from "@material-ui/core/FormHelperText";

export default function Register(){

    const [reqFirstName,setReqFirstName] = useState("dispNone")
    const [reqLastName,setReqLastName] = useState("dispNone")
    const [reqEmail,setReqEmail] = useState("dispNone")
    const [reqPass,setReqPass] = useState("dispNone")
    const [reqNumber,setReqNumber] = useState("dispNone")

    const [registerForm,setRegisterForm]=useState({myName:'', myLastName:'', myEmail:'', myPass:'', myContact:''});
    const [successMessage,setSuccessMessage]=useState('');

    const inputChangedHandler = (e) => {
        const state = registerForm;
        state[e.target.name] = e.target.value;
        setRegisterForm({...state})
    }

    async function registration() {

        try {
            const rawResponse = await fetch('http://localhost:8085/api/v1/signup', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Accept": "application/json"
                },
                body:JSON.stringify({
                    "email_address":registerForm.myEmail,
                    "first_name": registerForm.myName,
                    "last_name": registerForm.myLastName,
                    "mobile_number": registerForm.myContact,
                    "password": registerForm.myPass
                })
            });
            if (rawResponse.ok) {
                setSuccessMessage("Registration Successful. Please Login!");
            }
        }catch (e){
            alert('error');
        }
    }

    const onFormSubmitted = async (e) => {
        e.preventDefault();
        myName === "" ? setReqFirstName("dispBlock"):setReqFirstName("dispNone");
        myLastName === "" ? setReqLastName("dispBlock"):setReqLastName("dispNone");
        myEmail === "" ? setReqEmail("dispBlock"):setReqEmail("dispNone");
        myPass === "" ? setReqPass("dispBlock"):setReqPass("dispNone");
        myContact === "" ? setReqNumber("dispBlock"):setReqNumber("dispNone");

        await registration(registerForm);
        setRegisterForm({myName:'', myLastName:'', myEmail:'', myPass:'', myContact:''})
    }

    const {myName,myLastName,myEmail,myPass,myContact}=registerForm;

    return <div>
        <ValidatorForm className="register-form" >
            <FormControl required={true} >
                <InputLabel htmlFor="myName">First Name</InputLabel>
                <Input id="myName" name="myName" aria-describedby="my-helper-text" onChange={inputChangedHandler} />
                <FormHelperText className={reqFirstName}>
                    <span className="red">Required</span>
                </FormHelperText>
            </FormControl>
            <br/>
            <FormControl required={true} >
                <InputLabel htmlFor="myLastName">Last Name</InputLabel>
                <Input id="myLastName" name="myLastName" aria-describedby="my-helper-text" onChange={inputChangedHandler}/>
                <FormHelperText className={reqLastName}>
                    <span className="red">Required</span>
                </FormHelperText>
            </FormControl>
            <br/>
            <FormControl required={true}>
                <InputLabel htmlFor="myEmail">Email</InputLabel>
                <Input id="myEmail" name="myEmail" type='email' aria-describedby="my-helper-text" onChange={inputChangedHandler} />
                <FormHelperText className={reqEmail}>
                    <span className="red">Required</span>
                </FormHelperText>
            </FormControl>
            <br/>
            <FormControl required={true}>
                <InputLabel htmlFor="myPass">Password</InputLabel>
                <Input id="myPass" name="myPass" type='password' aria-describedby="my-helper-text" onChange={inputChangedHandler}/>
                <FormHelperText className={reqPass}>
                    <span className="red">Required</span>
                </FormHelperText>
            </FormControl>
            <br/>
            <FormControl required={true}>
                <InputLabel htmlFor="myContact">Contact</InputLabel>
                <Input id="myContact" name="myContact" aria-describedby="my-helper-text" onChange={inputChangedHandler}/>
                <FormHelperText className={reqNumber}>
                    <span className="red">Required</span>
                </FormHelperText>
            </FormControl>
            <h6 style={{textAlign:'center'}}>{successMessage}</h6>
            <Button variant="contained" color="primary" name="Login" type="submit" onClick={onFormSubmitted}> Register </Button>
        </ValidatorForm>
    </div>
}