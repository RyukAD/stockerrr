// import { Container } from "@material-ui/core";
import React from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// import ReactDom from "react-dom";
import Grid from '@material-ui/core/Grid';
import './about.css';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import Slide from '@material-ui/core/Slide';


import myPhoto from '../navbar/agam.jpeg';
import { withRouter } from 'react-router';

//my about component

const useStyles = makeStyles((theme) => ({
    paper: {
        background: '#393e46',
        color: '#eeeeee',
        padding: '15px'
    },
    slide: {
        minWidth: 100
    },
    myPhoto: {
        maxWidth: 150,
        maxHeight: 150,
        borderRadius: 100,
    },
}));

function About() {
    const classes = useStyles();
    return (
        <div>
            <Grid container direction="column"
                justify="center"
                alignItems="center"
                spacing={8}
                style={{
                    margin: 0,
                    width: '100%',
                }}>
                <Grid item xs zeroMinWidth>
                    <Slide timeout={{ enter: 500 }} in={true} direction="down" mountOnEnter unmountOnExit>
                        <img src={myPhoto} className={classes.myPhoto} />
                    </Slide>
                </Grid>

                <Grid item xs zeroMinWidth>
                    <Slide timeout={{ enter: 600 }} in={true} direction="down" mountOnEnter unmountOnExit>
                        <Typography variant="h4" align="center" >
                            I'm Agam
                    </Typography>
                    </Slide>
                </Grid>

                <Grid item xs zeroMinWidth>
                    <Slide timeout={{ enter: 500 }} in={true} direction="left" mountOnEnter unmountOnExit>
                        <Paper elevation={10} className={classes.paper}>
                            <Typography variant="h6" align="left">
                                About me :
                            </Typography>
                            <Typography variant="body1" component="div" align="justify" width={50}>
                                I started my career in web development in 2019. I constantly thrive to learn and try to create awesome web applications.
                                My journey has been incredible and I love every minute of developing a web application. Even though I am a Mechanical Engineering graduate,
                                I got the hang of web development from one of my previous employements in a web dev company as a marketting executive. I self taught myself Node, Angular, MongoDB and Express,
                                which helped me land my next position in my current employement. Stockerrr is one of my personal projects I have been doing to learn react, next and react-native.
                        It's a long way to go!<br />
                        Apart from this, I love watching football during my free time and generally spend time coding listening to rock music! If you have any queries or want to collaborate on a project
                        you can find my cotact details at the bottom of this page. To know more about Stockerrr read on...
                            </Typography>
                        </Paper>
                    </Slide>
                </Grid>

                <Grid item xs zeroMinWidth>
                    <Slide timeout={{ enter: 500 }} in={true} direction="left" mountOnEnter unmountOnExit>
                        <Paper elevation={10} className={classes.paper}>
                            <Typography variant="h6" align="left">
                                About Stockerrr :
                            </Typography>
                            <Typography variant="body1" component="div" align="justify" width={50}>
                                You're probably wondering why am i even reading this? The answers is simple. Because you want to be better at investing your money in stocks to make profits.
                                You may research stock market, see those constantly changing graphs over night and analysize volumes of stocks for a company for years and still make mistakes when you actually put money in to a ticker.
                                Stockerrr is meant to be an educational platform that should help make you be responsible with the money you invest into the market and get a better understanding about the general process of buying and selling stocks.
                                This platform is supposed to help new comers to practise trading before getting into the real deal. Eventually Stockerrr will have forum sections where you ask questions, share your investments and if you do not completly understand
                                why you made a profit of lost all your money, you could get your answers.
                                I hope you have fun learning! Insider tip: No you will not get $1000000 in your wallet when you sign up :)
                            </Typography>
                        </Paper>
                    </Slide>
                </Grid>

                <Grid item xs zeroMinWidth>
                {/* this should come when user scrolls down and then animate from the side */}
                    <Slide timeout={{ enter: 500 }} in={true} direction="left" mountOnEnter unmountOnExit>
                        <Paper elevation={10} className={classes.paper}>
                            <Typography variant="h6" align="left">
                                Contact me :
                            </Typography>
                            <Typography variant="body1" component="div" align="justify" width={50}>
                                <Grid container direction="column"
                                    justify="space-between"
                                    alignItems="flex-start"
                                    spacing={2}
                                    style={{
                                        margin: 0,
                                        width: '100%',
                                    }} >
                                    <Grid item xs zeroMinWidth>
                                        Email: dubeyagam@gmail.com
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        Contact number: +91-9399452347
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        Skype:  live:dubeyagam
                                    </Grid>
                                    <Grid item xs zeroMinWidth>
                                        LinkedIn:  <a href="https://www.linkedin.com/in/agam-dubey-b426a2bb/" target="_blank" style={{color: 'white'}}>Agam Dubey</a>
                                    </Grid>

                                </Grid>
                            </Typography>
                        </Paper>
                    </Slide>
                </Grid>

            </Grid>
        </div>

    );
}

export default withRouter(About)


// <div>
//             
//             

//         </div>