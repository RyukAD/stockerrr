//react related everything first
// import { Container } from "@material-ui/core";
import React, { useState, useEffect } from "react";

//all material dependencies here
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from '@material-ui/core/Button';
// import SweetAlert from 'sweetalert2-react';
import swal from '@sweetalert/with-react'

// import ReactDom from "react-dom";
import Grid from '@material-ui/core/Grid';
import './login.css';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import Slide from '@material-ui/core/Slide';


import myPhoto from '../navbar/agam.jpeg';
import { withRouter } from 'react-router';

//get the services

import { postLogin } from '../../services/auth-service';

//my login component

const useStyles = makeStyles((theme) => ({
    form: {
        background: "#eeeeee"
    },
    label: {
        color: "#00adb5",
        minWidth: 400
        
    },
    paper: {
        width: 500,
        height: 'auto',
        paddingLeft: 50,
        background: '#393e46'
    },
    pos: {
        marginLeft: '40%',
        paddingTop: '5rem'
    },
    title: {
        paddingTop: 15,
        color: "#eee"
    },
    button : {
        backgroundColor: 'black',
        color: '#00adb5',
        '&:hover' : {
            backgroundColor: '#00adb5',
            color: 'black'
        },
        marginBottom: 5
    }
}));

export default function Login() {
    const classes = useStyles();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [clicked, setClicked] = useState(false);

    function handleFormChange(event) {
        const { name, value } = event.target

        setForm((prevValue) => {
            if (name === 'email') {
                return {
                    email: value,
                    password: prevValue.password
                };
            } else if (name === 'password') {
                return {
                    email: prevValue.email,
                    password: value
                };
            };
        });

        // console.log(form);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("From submit ", form);
        setClicked(true);

        //no need to useEffect because it is used to fetch some data and then set state of something with respect to the response
        //instead just send api call on click

        // useEffect(async () => {
        //     console.log("sending to axios : :");
        //     let sendPostData = await postLogin(form);
        //     if(sendPostData){
        //         console.log("back from backend : : ", sendPostData);
        //     }
        // })

        //send req

        let sendPostData = await postLogin(form);

        if(sendPostData){
            console.log("i got the response : : ", sendPostData);
        };

        swal({
            text: 'Logged in successfully',
            buttons: {
                confirm: 'Ok'
            },
            icon: 'success'
        })
    };


    return (
        <div className={classes.pos}>
        <Paper elevation={10} className={classes.paper}>
        <Typography variant="h4" className={classes.title}>
            Login:
        </Typography>
        <Grid container
        direction="column"
        justify="center"
                alignItems="flex-start"
                spacing={3}
                style={{
                    margin: 0,
                    width: '100%',
                }}
        >
        <Grid item xs zeroMinWidth>
        

        <FormControl>
                <InputLabel className={classes.label} htmlFor="email">Email address</InputLabel>
                <Input className={classes.label}
                    name="email"
                    placeholder="Enter email please"
                    autoComplete="off"
                    onChange={handleFormChange}
                />
            </FormControl>
        </Grid>
            <Grid item xs zeroMinWidth>

            <FormControl>
                <InputLabel className={classes.label} htmlFor="password">Password</InputLabel>
                <Input
                className={classes.label}
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="off"
                    type="password"
                    // type="hidden"
                    onChange={handleFormChange} />
            </FormControl>
            </Grid>

            <Grid item xs zeroMinWidth flex="true">
            <Button  className={classes.button} onClick={handleSubmit} > Submit </Button>
            </Grid> 
            
        </Grid>
        </Paper>
        

        </div>
    );
}