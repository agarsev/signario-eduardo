import { createRoot } from "react-dom/client";
import { useEffect } from 'react';

import { ListaVideos } from './lista.js';
import { RevisarVideo } from './revisar.js';
import { useLocalStorage } from './common.js';

function App () {
    const [ dataDir, setDataDir ] = useLocalStorage('data_directory', null);
    useEffect(() => {
        api.on_data_dir(setDataDir);
    }, []);
    const [ reviewing, setReviewing ] = useLocalStorage('reviewing_video', null);
    useEffect(() => {api.set_undo_enabled(reviewing != null);}, [reviewing]);

    let main;
    if (dataDir === null) {
        main = <p>
            Cambia el directorio <b>destino</b> en el menú Archivo.
        </p>;
    } else if (reviewing !== null) {
        main = <RevisarVideo video={reviewing} />;
    } else {
        main = <ListaVideos data_dir={dataDir} review={setReviewing} />;
    }
    return <>
        <header><h1><span className="cursor-pointer"
                onClick={() => setReviewing(null)}>
            Vídeos Signario</span>
            {reviewing&&` » ${reviewing.num}`}
            </h1>
            <span className="ml-4">
                {reviewing!==null?reviewing.dir:dataDir}
            </span>
        </header>
        {main}
    </>;
}

createRoot(document.body).render(<App />);
