import ReactDOM from "react-dom";
import { useState } from "react";

import { ListaVideos } from './lista.js';

function useLocalStorage (key, def) {
    const stored = localStorage.getItem(key);
    const [ val, set ] = useState(stored!==undefined?stored:def);
    return [ val, new_val => {
        console.log(new_val);
        localStorage.setItem(key, new_val);
        set(new_val);
    }];
}

function App () {
    const [ dataDir, setDataDir ] = useLocalStorage('data_directory', null);
    api.on_data_dir(setDataDir);
    let main;
    if (dataDir === null) {
        main = <p>
            Cambia el directorio <b>destino</b> en el menú Archivo.
        </p>;
    } else {
        main = <ListaVideos data_dir={dataDir} />
    }
    return <>
        <header><h1>Vídeos Signario</h1>
            {dataDir&&<span class="ml-4">({dataDir})</span>}
        </header>
        {main}
    </>;
}

ReactDOM.render(<App />, document.body);
