import ReactDOM from "react-dom";

function MenuVideos ({ videos }) {
    const fechas = videos.reduce((acc, v) => {
        if (!acc[v.date]) acc[v.date] = [];
        acc[v.date].push(v);
        return acc;
    }, {});
    return <menu class="row-span-5">{Object.keys(fechas).map(f => <>
        <li class="separator text-gray-600 italic cursor-auto">{f}</li>
        {fechas[f].map(v => 
            <li class="pl-6">{v.num}</li>
        )}
    </>)}
    </menu>;
}
 
function ListaVideos ({ videos }) {
    return <>
        <header><h1>Vídeos Signario</h1></header>
        <section class="grid-cols-[auto_auto_1fr]">
            <MenuVideos videos={videos} />
        </section>
    </>;
}

ReactDOM.render(<ListaVideos videos={window.videos}/>, document.body);

/*
<span>Revisado:</span>
<span><input id="reviewed" type="checkbox" autocomplete="off" disabled></span>

<span>Intérprete:</span>
<span><select {% if info is defined %}value="{{info.signer}}"{% endif %} autocomplete="off" disabled>
    <option></option>
    <option value="Gloria">Gloria</option>
    <option value="Mamen">Mamen</option>
</select></span>

<span>Notas:</span>
<span>
<textarea id="notes" disabled autocomplete="off">
</textarea>
</span>

<span class="col-start-3">
<button id="brevisar" disabled>Revisar</button>
</span>

</section>
    </>;
}


<script>

const videos = {{videos|tojson}};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const lis = $$("menu li:not(.separator)");
const brev = $("#brevisar");
brev.disabled = true;

let selected;

lis.forEach(li => li.onclick = () => {
    selected = videos.find(v => v.num == li.innerText);
    lis.forEach(l => l.classList[l==li?'add':'remove']('selected'));
    $("#reviewed").checked = selected?.info?.reviewed;
    $("#notes").value = selected?.info?.notes || '';
    brev.disabled = false;
});

notes.oninput = () => selected.notes = notes.value;

brev.onclick = () => document.location = `${selected.id}`;

</script>

*/
