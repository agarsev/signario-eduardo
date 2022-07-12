import { useState } from "react";

exports.useLocalStorage = function(key, def) {
    let stored;
    try {
        stored = JSON.parse(localStorage.getItem(key));
    } catch {} 
    const [ val, set ] = useState(stored!==undefined?stored:def);
    return [ val, new_val => {
        localStorage.setItem(key, JSON.stringify(new_val));
        set(new_val);
    }];
}

