import { useState, useEffect } from "react";
import axios from "axios";

const cores = { URGENTE:"#ef4444", MODERADO:"#f59e0b", NORMAL:"#22c55e" };
const fundos = { URGENTE:"rgba(239,68,68,0.15)", MODERADO:"rgba(245,158,11,0.15)", NORMAL:"rgba(34,197,94,0.15)" };
const emojis = { URGENTE:"🚨", MODERADO:"⚠️", NORMAL:"✅" };

export default function PainelTV() {
    const [fila, setFila] = useState([]);
    const [hora, setHora] = useState(new Date());

    const carregar = async () => {
        try {
            const { data } = await axios.get("http://localhost:3001/api/triagens/painel");
            setFila(data);
        } catch {}
    };

    useEffect(() => {
        carregar();
        const filaInterval = setInterval(carregar, 10000);
        const horaInterval = setInterval(() => setHora(new Date()), 1000);
        return () => { clearInterval(filaInterval); clearInterval(horaInterval); };
    }, []);

    const urgentes  = fila.filter(t => t.prioridade === "URGENTE");
    const moderados = fila.filter(t => t.prioridade === "MODERADO");
    const normais   = fila.filter(t => t.prioridade === "NORMAL");

    const Col = ({ titulo, items, prioridade, contador }) => (
        <div style={styles.col}>
            <div style={{...styles.colHeader, background: fundos[prioridade], borderBottom:`3px solid ${cores[prioridade]}`}}>
                <span style={{fontSize:24}}>{emojis[prioridade]}</span>
                <span style={{...styles.colTitulo, color: cores[prioridade]}}>{titulo}</span>
                <span style={{...styles.colContador, background: cores[prioridade]}}>{contador}</span>
            </div>
            <div style={styles.colBody}>
                {items.length === 0 && (
                    <div style={styles.vazio}>Nenhum paciente</div>
                )}
                {items.map((t, i) => (
                    <div key={t.id} style={{...styles.item, borderLeft:`4px solid ${cores[prioridade]}`}}>
                        <div style={{...styles.itemNum, background: cores[prioridade]}}>{i+1}</div>
                        <div style={styles.itemInfo}>
                            <div style={styles.itemNome}>{t.animal_nome}</div>
                            <div style={styles.itemSub}>{t.tutor_nome} · {t.especie}</div>
                            {t.status === "em_atendimento" && (
                                <div style={styles.emAtendimento}>● Em atendimento</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <span style={styles.headerIcon}>🐾</span>
                    <div>
                        <div style={styles.headerNome}>UNIPET</div>
                        <div style={styles.headerSub}>Hospital Veterinário 24h</div>
                    </div>
                </div>
                <div style={styles.headerCenter}>
                    Fila de Atendimento
                </div>
                <div style={styles.headerRight}>
                    <div style={styles.data}>
                        {hora.toLocaleDateString("pt-BR", { weekday:"long", day:"numeric", month:"long" })}
                    </div>
                    <div style={styles.relogio}>
                        {hora.toLocaleTimeString("pt-BR")}
                    </div>
                </div>
            </div>

            {/* FILA */}
            <div style={styles.fila}>
                <Col titulo="URGENTE"  items={urgentes}  prioridade="URGENTE"  contador={urgentes.length} />
                <Col titulo="MODERADO" items={moderados} prioridade="MODERADO" contador={moderados.length} />
                <Col titulo="NORMAL"   items={normais}   prioridade="NORMAL"   contador={normais.length} />
            </div>

            {/* RODAPÉ */}
            <div style={styles.rodape}>
                Atendimento por ordem de prioridade clínica · Sistema UNIPET com IA ·
                Atualização automática a cada 10 segundos
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight:"100vh", background:"#0f172a", display:"flex", flexDirection:"column", fontFamily:"'Segoe UI',sans-serif" },
    header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 32px", borderBottom:"1px solid #1e293b", background:"#0f172a" },
    headerLeft: { display:"flex", alignItems:"center", gap:14 },
    headerIcon: { fontSize:42 },
    headerNome: { color:"#14b8a6", fontSize:28, fontWeight:900, fontFamily:"serif", letterSpacing:-1 },
    headerSub: { color:"#475569", fontSize:13, letterSpacing:1 },
    headerCenter: { color:"white", fontSize:20, fontWeight:700, letterSpacing:0.5 },
    headerRight: { textAlign:"right" },
    data: { color:"#64748b", fontSize:13, textTransform:"capitalize" },
    relogio: { color:"#94a3b8", fontSize:22, fontWeight:700, fontVariantNumeric:"tabular-nums" },
    fila: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, padding:"24px 32px", flex:1 },
    col: { background:"#1e293b", borderRadius:16, overflow:"hidden", display:"flex", flexDirection:"column" },
    colHeader: { display:"flex", alignItems:"center", gap:12, padding:"16px 20px" },
    colTitulo: { fontWeight:900, fontSize:15, letterSpacing:1.5, flex:1 },
    colContador: { width:28, height:28, borderRadius:"50%", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14 },
    colBody: { padding:12, display:"flex", flexDirection:"column", gap:10, flex:1 },
    vazio: { textAlign:"center", color:"#334155", padding:"40px 20px", fontSize:14 },
    item: { background:"#0f172a", borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:14 },
    itemNum: { width:30, height:30, borderRadius:"50%", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 },
    itemInfo: { flex:1 },
    itemNome: { color:"white", fontWeight:700, fontSize:16 },
    itemSub: { color:"#64748b", fontSize:13, marginTop:2 },
    emAtendimento: { color:"#14b8a6", fontWeight:700, fontSize:12, marginTop:4 },
    rodape: { textAlign:"center", color:"#334155", fontSize:13, padding:"16px 32px", borderTop:"1px solid #1e293b" },
};
