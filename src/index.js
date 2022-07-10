import ReactDOM from "react-dom";
import { useState } from "react";

import { ListaVideos } from './lista.js';
import { RevisarVideo } from './revisar.js';

function useLocalStorage (key, def) {
    const stored = localStorage.getItem(key);
    const [ val, set ] = useState(stored!==undefined?stored:def);
    return [ val, new_val => {
        localStorage.setItem(key, new_val);
        set(new_val);
    }];
}

function App () {
    const [ dataDir, setDataDir ] = useLocalStorage('data_directory', null);
    api.on_data_dir(setDataDir);
    const [ selected, setSelected ] = useState(null);
    let main;
    if (dataDir === null) {
        main = <p>
            Cambia el directorio <b>destino</b> en el menú Archivo.
        </p>;
    } else if (selected !== null) {
        main = <RevisarVideo video={selected} />
    } else {
        main = <ListaVideos data_dir={dataDir} select={setSelected} />
    }
    return <>
        <header><h1><span class="cursor-pointer"
                onClick={() =>setSelected(null)}>
            Vídeos Signario</span>
            {selected&&` » ${selected.num}`}
            </h1>
            <span class="ml-4">
                {selected?selected.dir:dataDir}
            </span>
        </header>
        {main}
    </>;
}

ReactDOM.render(<App />, document.body);
