import { createRoot } from "react-dom/client";
import { useState } from "react";

import { ListaVideos } from './lista.js';
import { RevisarVideo } from './revisar.js';

function useLocalStorage (key, def) {
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

function App () {
    const [ dataDir, setDataDir ] = useLocalStorage('data_directory', null);
    api.on_data_dir(setDataDir);
    const [ selected, setSelected ] = useLocalStorage('selected_video', null);
    let main;
    if (dataDir === null) {
        main = <p>
            Cambia el directorio <b>destino</b> en el menú Archivo.
        </p>;
    } else if (selected !== null) {
        main = <RevisarVideo video={selected} />;
    } else {
        main = <ListaVideos data_dir={dataDir} select={setSelected} />;
    }
    return <>
        <header><h1><span className="cursor-pointer"
                onClick={() => setSelected(null)}>
            Vídeos Signario</span>
            {selected&&` » ${selected.num}`}
            </h1>
            <span className="ml-4">
                {selected!==null?selected.dir:dataDir}
            </span>
        </header>
        {main}
    </>;
}

createRoot(document.body).render(<App />);
