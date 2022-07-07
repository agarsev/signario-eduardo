import ReactDOM from "react-dom";
import { useState } from "react";

function ListaVideos ({ videos }) {
    const [ sel, setSel ] = useState(null);
    return <>
        <header><h1>Vídeos Signario</h1></header>
        <section class="grid-cols-[auto_auto_1fr]">
            <MenuVideos videos={videos} sel={sel} setSel={setSel} />
            <InfoVideo video={sel?videos.find(v => v.num==sel):null} />
        </section>
    </>;
}

function MenuVideos ({ videos, sel, setSel }) {
    const fechas = videos.reduce((acc, v) => {
        if (!acc[v.date]) acc[v.date] = [];
        acc[v.date].push(v);
        return acc;
    }, {});
    return <menu class="row-span-5">{Object.keys(fechas).map(f => <>
        <li class="text-gray-600 italic cursor-auto">{f}</li>
        {fechas[f].map(v => {
            return <li class={"pl-6"+(v.num==sel?" selected":"")}
                onClick={() => setSel(v.num)}>{v.num}</li>;
        })}
    </>)}
    </menu>;
}
 
function InfoVideo ({ video }) {
    const signer = "";
    return <>
        <span>Revisado:</span>
        <span><input type="checkbox" autocomplete="off"
            disabled={!video} /></span>

        <span>Intérprete:</span>
        <span><select value={signer} autocomplete="off" disabled={!video}>
            <option></option>
            <option value="Gloria">Gloria</option>
            <option value="Mamen">Mamen</option>
        </select></span>

        <span>Notas:</span>
        <span>
        <textarea autocomplete="off" disabled={!video}>
        </textarea>
        </span>

        <span class="col-start-3">
        <button disabled={!video}>Revisar</button>
        </span>
    </>;
}

ReactDOM.render(<ListaVideos videos={api.list_videos()}/>, document.body);
