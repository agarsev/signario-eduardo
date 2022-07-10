export function RevisarVideo ({ video }) {
    return <>
        <VideoInfo video={video} />
        <h2>Signos</h2>
        <section class="grid-cols-[auto_auto_auto_auto_1fr]">
            <ClipList clips={[]} />
            <span class="col-span-4">
                <video muted src={`${video.dir}/raw.mp4`} />
            </span>
            <ClipInfo clip={{}} />
        </section>
    </>;
}

function VideoInfo ({ video }) {
    return <section class="grid-cols-[auto_auto_auto_auto_1fr]">
        <span>Revisado:</span>
        <span>
            <input id="reviewed" type="checkbox" autocomplete="off" />
        </span>

        <span>Notas:</span>
        <span class="row-span-2">
            <textarea id="vidnotes" autocomplete="off"></textarea>
        </span>

        <span class="row-span-2 self-end"><button>Guardar</button></span>

        <span>Intérprete:</span>
        <span><select value="" autocomplete="off">
            <option></option>
            <option value="Gloria">Gloria</option>
            <option value="Mamen">Mamen</option>
        </select></span>
    </section>;
}

function ClipList ({ clips }) {
    return <menu class="row-span-4">
        {clips.map(c => <li>{clip.gloss}</li>)}
    </menu>;
}

function ClipInfo ({ clip }) {
    return <>
        <span>Desde:</span>
        <span><input id="start" disabled autocomplete="off" min="0" type="number" step="0.1" /></span>

        <span>Hasta:</span>
        <span><input id="end" disabled autocomplete="off" min="0" type="number" step="0.1" /></span>

        <span>Glosa:</span>
        <span><input id="gloss" disabled autocomplete="off" type="text" /></span>

        <span>Signotación:</span>
        <span><input id="notation" disabled autocomplete="off" type="text" /></span>

        <span>Notas:</span>
        <span class="col-span-3">
            <textarea disabled autocomplete="off" id="notes" class="w-full">
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
