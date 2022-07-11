import { useState, useEffect } from "react";

export function RevisarVideo ({ video }) {
    return <>
        <VideoInfo video_dir={video.dir} />
        <h2>Signos</h2>
        <section className="grid-cols-[auto_auto_auto_auto_1fr]">
            <ClipList clips={[]} />
            <VideoPlay video={video} />
            <ClipInfo clip={{}} />
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

function VideoInfo ({ video_dir }) {
    const [reviewed, setRev] = useState(false);
    const [signer, setSigner] = useState("");
    const [notes, setNotes] = useState("");
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if (loaded) {
            api.save_video_info(video_dir, {reviewed,signer,notes});
        }
    }, [reviewed, signer, notes]);
    useEffect(() => {
        api.get_video_info(video_dir)
        .then(({reviewed, signer, notes}) => {
            setRev(reviewed);
            setSigner(signer);
            setNotes(notes);
            setLoaded(true);
        });
    }, [video_dir]);
    return <section className="grid-cols-[auto_auto_auto_auto_1fr]">
        <span>Revisado:</span>
        <span>
            <input disabled={!loaded} type="checkbox" autoComplete="off" checked={reviewed}
                onChange={e => setRev(!reviewed)} />
        </span>

        <span>Notas:</span>
        <span className="row-span-2">
            <textarea disabled={!loaded} autoComplete="off" value={notes}
                onChange={e => setNotes(e.target.value)} />
        </span>

        <span className="row-span-2 self-end"><button>Importar Cortes</button></span>

        <span>Intérprete:</span>
        <span><select value={signer} onChange={e => setSigner(e.target.value)}
                disabled={!loaded} autoComplete="off">
            <option></option>
            <option value="Gloria">Gloria</option>
            <option value="Mamen">Mamen</option>
        </select></span>
    </section>;
}

function ClipList ({ clips }) {
    return <menu className="row-span-4">
        {clips.map(c => <li>{clip.gloss}</li>)}
    </menu>;
}

function ClipInfo ({ clip }) {
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
