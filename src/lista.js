import { useState, useEffect, Fragment } from "react";

export function ListaVideos ({ data_dir, select }) {
    const [ sel, setSel ] = useState(null);
    const [ videos, setVideos ] = useState([]);
    const thisVideo = videos.find(v => v.num == sel) || null;
    useEffect(() => {
        api.list_videos(data_dir).then(setVideos);
    }, [data_dir]);

    return <section className="grid-cols-[auto_auto_1fr]">
        <MenuVideos videos={videos} sel={sel} setSel={setSel} />
        <InfoVideo video={thisVideo} />
        <span className="col-start-3">
            <button disabled={sel==null}
                onClick={() => select(thisVideo)}>Revisar</button>
        </span>
    </section>;
}

function MenuVideos ({ videos, sel, setSel }) {
    const fechas = videos.reduce((acc, v) => {
        if (!acc[v.date]) acc[v.date] = [];
        acc[v.date].push(v);
        return acc;
    }, {});
    return <menu className="row-span-5">{Object.keys(fechas).map(f => <Fragment key={f}>
        <li className="text-gray-600 italic cursor-auto">{f}</li>
        {fechas[f].map(v => {
            return <li key={v.num} className={"pl-6"+(v.num==sel?" selected":"")}
                onClick={() => setSel(v.num)}>{v.num}</li>;
        })}
    </Fragment>)}
    </menu>;
}
 
function InfoVideo ({ video }) {
    const [ info, setInfo ] = useState({});
    useEffect(() => {
        if (video) api.get_video_info(video.dir).then(setInfo);
    }, [video]);
    return <>
        <span>Revisado:</span>
        <span><input type="checkbox" autoComplete="off" readOnly={true}
            checked={info.reviewed || false}/></span>

        <span>Intérprete:</span>
        <span>{info.signer || '?'}</span>

        <span>Notas:</span>
        <span>{info.notes || '-'}</span>
    </>;
}
