import { useState } from "react";
import api from "../api";

export default function NovaTriagem() {
    const [busca, setBusca] = useState("");
    const [tutores, setTutores] = useState([]);
    const [tutor, setTutor] = useState(null);
    const [animal, setAnimal] = useState(null);
    const [form, setForm] = useState({ sintomas:"", temperatura:"" });
    const [resultado, setResultado] = useState(null);
    const [loading, setLoading] = useState(false);

    const buscarTutores = async (q) => {
        setBusca(q);
        if (q.length < 2) return setTutores([]);
        try {
            const { data } = await api.get(`/tutores?q=${q}`);
            setTutores(data);
        } catch {}
    };

    const selecionarTutor = async (t) => {
        const { data } = await api.get(`/tutores/${t.id}`);
        setTutor(data);
        setTutores([]);
        setBusca(t.nome);
    };

    const classificar = async () => {
        if (!animal || !form.sintomas) return alert("Selecione um animal e informe os sintomas.");
        setLoading(true);
        try {
            const { data } = await api.post("/triagens", {
                animalId: animal.id,
                sintomas: form.sintomas,
                temperatura: form.temperatura ? parseFloat(form.temperatura) : null,
            });
            setResultado(data);
        } catch (err) {
            alert(err.response?.data?.erro || "Erro ao criar triagem.");
        }
        setLoading(false);
    };

    const cores = { URGENTE:"#ef4444", MODERADO:"#f59e0b", NORMAL:"#22c55e" };
    const fundos = { URGENTE:"#fee2e2", MODERADO:"#fef3c7", NORMAL:"#dcfce7" };

    if (resultado) return (
        <div style={styles.page}>
            <div style={{...styles.resultado, background: fundos[resultado.classificacao.prioridade], border:`2px solid ${cores[resultado.classificacao.prioridade]}`}}>
                <div style={styles.resLabel}>🤖 Classificação da IA</div>
                <div style={{...styles.resPrioridade, color: cores[resultado.classificacao.prioridade]}}>
                    {resultado.classificacao.prioridade}
                </div>
                <div style={styles.resJust}>{resultado.classificacao.justificativa}</div>
                <div style={styles.resAnimal}>
                    Paciente: <strong>{resultado.animal.nome}</strong> · Tutor: {resultado.animal.tutor}
                </div>
                <button style={styles.btnNovo} onClick={() => {
                    setResultado(null); setTutor(null); setAnimal(null);
                    setBusca(""); setForm({sintomas:"",temperatura:""});
                }}>
                    ➕ Nova Triagem
                </button>
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            <h2 style={styles.titulo}>➕ Nova Triagem</h2>

            <div style={styles.card}>
                <div style={styles.secao}>👤 Buscar Tutor</div>
                <input style={styles.input} placeholder="Digite o nome ou CPF..."
                    value={busca} onChange={e => buscarTutores(e.target.value)} />
                {tutores.map(t => (
                    <div key={t.id} style={styles.opcao} onClick={() => selecionarTutor(t)}>
                        <strong>{t.nome}</strong> · {t.cpf} · {t.telefone}
                    </div>
                ))}

                {tutor && (
                    <>
                        <div style={{...styles.secao, marginTop:20}}>🐾 Selecionar Animal</div>
                        {tutor.animais?.map(a => (
                            <div key={a.id}
                                style={{...styles.opcao, background: animal?.id===a.id?"#ccfbf1":"#f8fafc", border:`2px solid ${animal?.id===a.id?"#0d9488":"#e2e8f0"}`}}
                                onClick={() => setAnimal(a)}>
                                {a.especie==="Gato"?"🐱":"🐶"} <strong>{a.nome}</strong> · {a.especie} · {a.porte}
                            </div>
                        ))}
                    </>
                )}

                {animal && (
                    <>
                        <div style={{...styles.secao, marginTop:20}}>🩺 Sintomas</div>
                        <textarea style={{...styles.input, minHeight:100, resize:"vertical"}}
                            placeholder="Descreva os sintomas detalhadamente..."
                            value={form.sintomas} onChange={e => setForm({...form, sintomas:e.target.value})} />
                        <input style={{...styles.input, marginTop:10}} type="number" step="0.1"
                            placeholder="Temperatura (°C) — opcional"
                            value={form.temperatura} onChange={e => setForm({...form, temperatura:e.target.value})} />
                        <button style={styles.btnClassificar} onClick={classificar} disabled={loading}>
                            {loading ? "🤖 Analisando..." : "🤖 Classificar com IA"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { padding:24 },
    titulo: { color:"#0f172a", marginBottom:20 },
    card: { background:"white", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
    secao: { fontWeight:700, color:"#475569", fontSize:13, marginBottom:10, textTransform:"uppercase", letterSpacing:1 },
    input: { width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, boxSizing:"border-box", fontFamily:"inherit" },
    opcao: { padding:"12px 14px", borderRadius:10, border:"2px solid #e2e8f0", marginBottom:8, cursor:"pointer", fontSize:14, background:"#f8fafc" },
    btnClassificar: { width:"100%", marginTop:16, padding:14, background:"linear-gradient(135deg,#0d9488,#0f766e)", color:"white", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer" },
    resultado: { borderRadius:16, padding:28, maxWidth:500, margin:"0 auto" },
    resLabel: { fontSize:13, fontWeight:700, color:"#475569", marginBottom:8 },
    resPrioridade: { fontSize:32, fontWeight:900, marginBottom:8 },
    resJust: { fontSize:15, color:"#334155", marginBottom:16, lineHeight:1.6 },
    resAnimal: { fontSize:14, color:"#475569", marginBottom:20 },
    btnNovo: { padding:"12px 24px", background:"#0d9488", color:"white", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer" },
};
