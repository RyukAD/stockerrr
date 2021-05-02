import React, { useState } from "react";
import axios from 'axios';

const config = require('./config.json');

function postLogin(data) {
    return new Promise((resolve, reject) => {
        const headers = {
            'Content-Type': 'application/json'
        };
    
        axios.post(config.API_BASE_URL + '/users/login', data, {headers: headers}).then((response) => {
            console.log("MILA RE MILA REEE : : : ", response['data']);
            resolve(response['data']);
        });
    });
};

export {
    postLogin
}