import React, { useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import {ValidatorForm} from 'react-material-ui-form-validator'
import Button from "@material-ui/core/Button";
import './Login.css';
import { useAppContext } from "../../screens/loginContext"

export default function Login(props){

    const { userHasAuthenticated } = useAppContext();

    const [loginForm,setLoginForm]=useState({
        userName:'',
        pass:''
    })

    const [accessToken,setAccessToken] =useState('');

    async function login(){
        try {
            const rawResponse = await fetch('http://localhost:8085/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "authorization": "Basic "+window.btoa(""+loginForm.userName+":"+loginForm.pass)
                }
            });
            const result = await rawResponse.json();
            if (rawResponse.ok) {
                userHasAuthenticated(true);
                setAccessToken(rawResponse.headers.get('access-token'))
                props.toggleModal();
            }
        }catch (e){
            console.log('error');
        }
    }

    const inputChangedHandler = (e) => {
        const state = loginForm;
        state[e.target.name] = e.target.value;
        setLoginForm({...state})
    }

     const onSubmitHandler = async (e) => {
        e.preventDefault();
        await login(loginForm);
        setLoginForm({ userName:'',pass:'' });

    }

    const {userName,pass}=loginForm;

    return <div>
        <ValidatorForm className="login-form" onSubmit={onSubmitHandler}>
            <FormControl required={true} >
                <InputLabel htmlFor="userName">Username</InputLabel>
                <Input id="userName" name="userName" aria-describedby="my-helper-text"  onChange={inputChangedHandler}/>
            </FormControl>
            <br/>
            <FormControl required={true}>
                <InputLabel htmlFor="pass">Password</InputLabel>
                <Input id="pass" name="pass" type='password' aria-describedby="my-helper-text" onChange={inputChangedHandler}/>
            </FormControl>
            <Button variant="contained" type='submit' color="primary" name="Login" > Login </Button>
        </ValidatorForm>
    </div>
}