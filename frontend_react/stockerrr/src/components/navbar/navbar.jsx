import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import logo from './agam.jpeg';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        justifyContent: 'space-between',
        gap: '5%'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        marginLeft: 5,
        color: '#eeeeee'
    },
    logo: {
        maxWidth: 50,
        maxHeight: 100,
    }
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" style={{ backgroundColor: '#222831' }}>
                <Toolbar>
                    {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                    <MenuIcon />
                                </IconButton> */}
                    <img className={classes.logo} src={logo} alt="stockerrr logo" />
                    <Typography component={Link} to={'/'} style={{textDecoration: 'none'}} variant="h6" className={classes.title}>
                        Stockerrr
                    </Typography>
                    <Button component={Link} to={'/login'} color="inherit">Login</Button>
                    <Button component={Link} to={'/signup'} color="inherit">Sign Up</Button>
                    <Button component={Link} to={'/about'} color="inherit">About the developer</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}