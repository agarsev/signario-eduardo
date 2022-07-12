import { useState, useEffect, useRef } from "react";

let save_timeout;
const DEBOUNCE_TIMEOUT = 600;

let undo_stack = [];
const MAX_UNDO = 100;

export function RevisarVideo ({ video }) {
    const [savingState, setSS] = useState('');
    const [info, setInfo] = useState(null);
    const [currentCut, setCC] = useState(null);
    const theCurrentCut = currentCut!==null?info.cuts[currentCut]:null;

    const save = (newVal, is_from_undo) => {
        setSS('');
        if (save_timeout) {
            clearTimeout(save_timeout);
        } else if (!is_from_undo) {
            undo_stack.push({info, currentCut});
            if (undo_stack.length > MAX_UNDO) undo_stack.shift();
        }
        save_timeout = setTimeout(async () => {
            save_timeout = null;
            setSS('guardando...');
            await api.save_video_info(video.dir, newVal);
            setSS('todo guardado 👍');
        }, DEBOUNCE_TIMEOUT);
    }

    const updInfo = update => {
        const newVal = {...info, ...update};
        setInfo(newVal);
        save(newVal, false);
    };

    useEffect(() => {
        undo_stack = [];
        api.get_video_info(video.dir)
        .then(setInfo);
    }, [video.dir]);

    useEffect(() => {
        const undo = () => {
            if (undo_stack.length > 0) {
                const old = undo_stack.pop();
                setInfo(old.info);
                setCC(old.currentCut);
                save(old.info, true);
            }
        };
        api.on_undo(undo);
        const onkeydown = e => {
            if (e.ctrlKey && e.key == 'z') undo();
        };
        document.addEventListener('keydown', onkeydown);
        return () => document.removeEventListener('keydown', onkeydown);
    }, []);

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
            <CutInfo current={currentCut} cut={theCurrentCut} updCut={val => {
                    const newCuts = info.cuts.slice();
                    newCuts[currentCut] = {...newCuts[currentCut], ...val};
                    updInfo({cuts: newCuts});
                }}
            />
            <CutOperations cuts={info!==null&&info.cuts?info.cuts:[]}
                currentCut={currentCut}
                update={(cuts, newCurrent) => {
                    updInfo({cuts});
                    setCC(newCurrent);
                }} />
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
    const curLi = useRef();
    useEffect(() => {
        if (curLi.current) curLi.current.scrollIntoView({
            behavior: "smooth", block: "nearest" });
    }, [currentCut]);
    return <menu className="row-span-4">
        {cuts.map((c, i) => <li key={i}
            ref={currentCut==i?curLi:null}
            className={currentCut==i?"selected":""}
            onClick={() => setCC(i)}
            >{c.gloss}</li>)}
    </menu>;
}

function CutInfo ({ cut, updCut, current }) {
    const common = {
        disabled: cut===null,
        autoComplete: "off"
    };
    const glosRef = useRef();
    useEffect(() => {
        if (glosRef.current) {
            glosRef.current.focus();
            glosRef.current.select();
        }
    }, [current]);
    const { start, end, gloss, notation, notes } = cut?cut:{};
    return <>
        <span>Desde:</span>
        <span><input {...common} type="number" min="0" step="0.1" value={start || 0}
            onChange={e => updCut({start: e.target.value})} /></span>

        <span>Hasta:</span>
        <span><input {...common} type="number" min="0" step="0.1" value={end || 0}
            onChange={e => updCut({end: e.target.value})} /></span>

        <span>Glosa:</span>
        <span><input {...common} type="text" value={gloss || ''} ref={glosRef}
            onChange={e => updCut({gloss: e.target.value})} /></span>

        <span>Signotación:</span>
        <span><input {...common} type="text" value={notation || ''}
            onChange={e => updCut({notation: e.target.value})} /></span>

        <span>Notas:</span>
        <span className="col-span-3"><textarea {...common} className="w-full" value={notes || ''}
            onChange={e => updCut({notes: e.target.value})} /></span>
    </>;
}

function CutOperations({ cuts, currentCut, update }) {
    const addCut = () => {
        let start = 0;
        if (cuts.length > 0) {
            start = cuts[cuts.length-1].end;
        }
        const end = parseFloat(start)+2;
        const gloss = cuts.map(c => parseInt(c.gloss))
            .filter(v => !isNaN(v))
            .reduce((acc,v) => acc>v?acc:v, 0)+1;
        const nucuts = cuts.slice();
        nucuts.push({start, end, gloss});
        update(nucuts, nucuts.length-1);
    };
    const rmCut = () => {
        const nucuts = cuts.slice();
        nucuts.splice(currentCut, 1);
        let nextCut = currentCut;
        if (nucuts.length == 0) {
            nextCut = null;
        } else if (nextCut >= nucuts.length) {
            nextCut = nucuts.length-1;
        }
        update(nucuts, nextCut);
    };
    const shiftGloss = () => {
        const nucuts = cuts.slice();
        for (let i = nucuts.length-1; i>currentCut; i--) {
            nucuts[i] = { ...nucuts[i], gloss: nucuts[i-1].gloss };
        }
        nucuts[currentCut] = { ...nucuts[currentCut], gloss: '-' };
        update(nucuts, currentCut);
    };
    const merge = () => {
        const old = cuts[currentCut];
        const nucuts = cuts.slice();
        nucuts.splice(currentCut, 1);
        nucuts[currentCut] = {
            ...old,
            ...nucuts[currentCut],
            start: old.start
        };
        update(nucuts, currentCut);
    };
    return <>
        <button onClick={addCut}>Añadir corte</button>
        <span className="col-span-4">
            <button disabled={currentCut===null} className="px-6 mr-2"
                onClick={rmCut}>Eliminar corte</button>
            <button disabled={currentCut===null} className="px-6 mr-2"
                onClick={shiftGloss}>Desplazar glosas</button>
            <button disabled={currentCut===null} className="px-6"
                onClick={merge}>Unir con siguiente</button>
        </span>
    </>;
}
