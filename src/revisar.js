import { useState, useEffect, useRef } from "react";

let save_timeout;
const DEBOUNCE_TIMEOUT = 600;

export function RevisarVideo ({ video }) {
    const [savingState, setSS] = useState('');

    const [info, setInfo] = useState(null);
    const updInfo = update => {
        const newVal = {...info, ...update};
        setInfo(newVal);
        setSS('');
        if (save_timeout) clearTimeout(save_timeout);
        save_timeout = setTimeout(async () => {
            save_timeout = null;
            setSS('guardando...');
            await api.save_video_info(video.dir, newVal);
            setSS('todo guardado 👍');
        }, DEBOUNCE_TIMEOUT);
    };

    useEffect(() => {
        api.get_video_info(video.dir)
        .then(setInfo);
    }, [video.dir]);

    const [currentCut, setCC] = useState(null);
    const theCurrentCut = currentCut!==null?info.cuts[currentCut]:null;

    return <>
        <section className="grid grid-cols-[auto_auto_auto_auto_1fr_auto] grid-flow-dense">
            <VideoInfo meta={info} updateMeta={updInfo}
            />
            <span className="row-span-2 text-gray-600 text-center">{savingState}</span>
            <button onClick={() => api.import_autocuts(video.dir)
                    .then(cuts => updInfo({cuts}))}
                >(1) Importar Cortes</button>
            <button>(2) Importar Glosas</button>
        </section>
        <h2>Signos</h2>
        <section className="grid-cols-[auto_auto_auto_auto_1fr]">
            <CutList cuts={info!==null&&info.cuts?info.cuts:[]} currentCut={currentCut} setCC={setCC} />
            <VideoPlay video={video} start={currentCut!==null?theCurrentCut.start:-1}
                end={currentCut!==null?theCurrentCut.end:-1} />
            <CutInfo cut={theCurrentCut} updCut={val => {
                    const newCuts = info.cuts.slice();
                    newCuts[currentCut] = {...newCuts[currentCut], ...val};
                    updInfo({cuts: newCuts});
                }}
            />
        </section>
    </>;
}

function VideoPlay ({ video, start, end }) {
    const videoRef = useRef();
    const player = videoRef.current;
    const replay = () => {
        player.currentTime = start;
        player.play();
    };
    const checkEnd = () => {
        if (end>=0 && player.currentTime >= end) {
            player.pause();
        }
    };
    useEffect(() => {
        if (start >= 0 && player) replay();
    }, [start, end]);
    return <span className="col-span-4">
        <video muted ref={videoRef} onClick={replay} onTimeUpdate={checkEnd} >
            <source src={`${video.dir}/lowq.mp4`} />
            <source src={`${video.dir}/raw.mp4`} />
        </video>
    </span>;
}

function VideoInfo ({ meta, updateMeta }) {
    const common = {
        disabled: meta===null,
        autoComplete: "off"
    };
    const { reviewed, notes, signer } = meta || {};
    return <>
        <span>Revisado:</span>
        <span>
            <input {...common} type="checkbox" checked={reviewed || false}
                onChange={e => updateMeta({reviewed: !meta.reviewed})} />
        </span>

        <span className="row-span-2">Notas:</span>
        <span className="row-span-2">
            <textarea {...common} value={notes || ''}
                className="h-full min-w-10em"
                onChange={e => updateMeta({notes: e.target.value})} />
        </span>

        <span className="col-start-1">Intérprete:</span>
        <span className="col-start-2">
            <select {...common} value={signer || ''}
                onChange={e => updateMeta({signer: e.target.value})} >
            <option></option>
            <option value="Gloria">Gloria</option>
            <option value="Mamen">Mamen</option>
        </select></span>

    </>;
}

function CutList ({ cuts, currentCut, setCC }) {
    return <menu className="row-span-4">
        {cuts.map((c, i) => <li key={i}
            className={currentCut==i?"selected":""}
            onClick={() => setCC(i)}
            >{c.gloss}</li>)}
    </menu>;
}

function CutInfo ({ cut, updCut }) {
    const common = {
        disabled: cut===null,
        autoComplete: "off"
    };
    const { start, end, gloss, notation, notes } = cut?cut:{};
    return <>
        <span>Desde:</span>
        <span><input {...common} type="number" min="0" step="0.1" value={start || 0}
            onChange={e => updCut({start: e.target.value})} /></span>

        <span>Hasta:</span>
        <span><input {...common} type="number" min="0" step="0.1" value={end || 0}
            onChange={e => updCut({end: e.target.value})} /></span>

        <span>Glosa:</span>
        <span><input {...common} type="text" value={gloss || ''}
            onChange={e => updCut({gloss: e.target.value})} /></span>

        <span>Signotación:</span>
        <span><input {...common} type="text" value={notation || ''}
            onChange={e => updCut({notation: e.target.value})} /></span>

        <span>Notas:</span>
        <span className="col-span-3"><textarea {...common} className="w-full" value={notes || ''}
            onChange={e => updCut({notes: e.target.value})} /></span>
    </>;
}
