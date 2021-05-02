// import { Container } from "@material-ui/core";
import React from "react";
import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
// import ReactDom from "react-dom";
import Grid from '@material-ui/core/Grid';
import './home.css'

// this is a homepage which should come below nav bar

function HomePage() {
    return (
        // <div className="backGround" style={{display: 'flex', flexFlow: 'column',flexBasis: 'auto'}}>
<div className="backGround">
            <Grid container direction="row"
                justify="space-between"
                alignItems="center">
                <Grid item xs zeroMinWidth>
                <Typography variant="h2" align="justify" style={{paddingLeft: '150px'}}>
                    Welcome to Stockerrr...
            </Typography>
                </Grid>
                <Grid item xs zeroMinWidth>
                <Typography variant="body2" align="justify" display="block" style={{paddingRight: '150px'}}>
                    A educative and realtime stock markets application which helps you learn and
                build your portfolio.<br />
                Starting out to put your savings into stocks and make money while you sleep?
                Stock markets involve a level of risk like no other, so it is better to invest time on it before
                investing your hard earned money. On Stockerrr... you can test your buying and selling skills before you dive in to the real thing.
                So what are you waiting for? Sign up and make your first trade.
                madarchod
            </Typography>
                </Grid>
            
            </Grid>
            


        </div>
        // </div>
        
    )
}

export default HomePage;