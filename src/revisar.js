import { useState, useEffect } from "react";

let save_timeout;
const DEBOUNCE_TIMEOUT = 500;

export function RevisarVideo ({ video }) {
    const [info, setInfo] = useState(null);
    const [savingState, setSS] = useState('');
    const updInfo = update => {
        const newVal = {...info, ...update};
        setInfo(newVal);
        setSS('');
        if (save_timeout) clearTimeout(save_timeout);
        save_timeout = setTimeout(async () => {
            save_timeout = null;
            setSS('guardando...');
            await api.save_video_info(video.dir, newVal);
            setSS('guardado 👍');
        }, DEBOUNCE_TIMEOUT);
    };
    useEffect(() => {
        api.get_video_info(video.dir)
        .then(setInfo);
    }, [video.dir]);
    return <>
        <section className="grid grid-cols-[auto_auto_auto_auto_1fr_auto] grid-flow-dense">
            <VideoInfo meta={info} updateMeta={updInfo}
            />
            <span className="row-span-2 text-gray-600">{savingState}</span>
            <button onClick={() => api.import_autocuts(video.dir)
                    .then(cuts => updInfo({cuts}))}
                >(1) Importar Cortes</button>
            <button>(2) Importar Glosas</button>
        </section>
        <h2>Signos</h2>
        <section className="grid-cols-[auto_auto_auto_auto_1fr]">
            <CutList cuts={info!==null&&info.cuts?info.cuts:[]} />
            <VideoPlay video={video} />
            <CutInfo cut={{}} />
        </section>
    </>;
}

function VideoPlay ({ video, clip }) {
    const replay = e => {
        e.target.play();
    };
    return <span className="col-span-4">
        <video muted onClick={replay}>
            <source src={`${video.dir}/lowq.mp4`} />
            <source src={`${video.dir}/raw.mp4`} />
        </video>
    </span>;
}

function VideoInfo ({ meta, updateMeta }) {
    const loaded = meta !== null;
    const reviewed = loaded && meta.reviewed || false;
    const notes = loaded && meta.notes ? meta.notes : '';
    const signer = loaded && meta.signer ? meta.signer : '';
    return <>
        <span>Revisado:</span>
        <span>
            <input disabled={!loaded} type="checkbox" autoComplete="off" checked={reviewed}
                onChange={e => updateMeta({reviewed: !meta.reviewed})} />
        </span>

        <span className="row-span-2">Notas:</span>
        <span className="row-span-2">
            <textarea disabled={!loaded} autoComplete="off" value={notes}
                className="h-full min-w-10em"
                onChange={e => updateMeta({notes: e.target.value})} />
        </span>

        <span className="col-start-1">Intérprete:</span>
        <span className="col-start-2">
            <select value={signer} onChange={e => updateMeta({signer: e.target.value})}
                disabled={!loaded} autoComplete="off">
            <option></option>
            <option value="Gloria">Gloria</option>
            <option value="Mamen">Mamen</option>
        </select></span>

    </>;
}

function CutList ({ cuts }) {
    const [sel, setSel] = useState(null);
    return <menu className="row-span-4">
        {cuts.map((c, i) => <li key={i}
            className={sel==i?"selected":""}
            onClick={() => setSel(i)}
            >{c.gloss}</li>)}
    </menu>;
}

function CutInfo ({ cut }) {
    return <>
        <span>Desde:</span>
        <span><input id="start" disabled autoComplete="off" min="0" type="number" step="0.1" /></span>

        <span>Hasta:</span>
        <span><input id="end" disabled autoComplete="off" min="0" type="number" step="0.1" /></span>

        <span>Glosa:</span>
        <span><input id="gloss" disabled autoComplete="off" type="text" /></span>

        <span>Signotación:</span>
        <span><input id="notation" disabled autoComplete="off" type="text" /></span>

        <span>Notas:</span>
        <span className="col-span-3">
            <textarea disabled autoComplete="off" id="notes" className="w-full">
            </textarea>
        </span>
    </>;
}

/*
<script>

const info = {{info|tojson}};
const clips = info.clips;

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const lis = $$("menu li");
const player = $("video");

let selected;

function replay () {
    if (!selected) return;
    player.currentTime = selected.start;
    player.play();
}

player.onclick = () => {
    if (selected) {
        player.currentTime = selected.start;
        player.play();
    }
};
player.ontimeupdate = () => {
    if (player.currentTime >= selected.end) {
        player.pause();
    }
};

lis.forEach(li => li.onclick = () => {
    selected = clips.find(c => c.gloss == li.innerText);
    lis.forEach(l => l.classList[l==li?'add':'remove']('selected'));
    $("#start").value = selected.start;
    $("#end").value = selected.end;
    $("#gloss").value = selected.gloss || '';
    $("#notation").value = selected.notation || '';
    $("#notes").value = selected.notes || '';
    $("#gloss").onchange = e => {
        selected.gloss = e.target.value;
        li.innerText = e.target.value;
    }
    ['start', 'end', 'gloss', 'notation', 'notes'].forEach(v => {
        $("#"+v).disabled = false;
    });
    replay();
});

['start', 'end', 'notation', 'notes'].forEach(v => {
    $("#"+v).onchange = e => {
        selected[v] = e.target.value;
        if (v == 'start' || v == 'end') replay();
    };
});

</script>
*/
