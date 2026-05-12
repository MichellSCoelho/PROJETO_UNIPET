import { useState } from "react";
import api from "../api";

export default function Cadastro() {
    const [aba, setAba] = useState("tutor");
    const [formTutor, setFormTutor] = useState({ nome:"", cpf:"", telefone:"", email:"" });
    const [formAnimal, setFormAnimal] = useState({ tutorId:"", nome:"", especie:"", raca:"", sexo:"", pesoKg:"", porte:"" });
    const [busca, setBusca] = useState("");
    const [tutores, setTutores] = useState([]);
    const [tutorSelecionado, setTutorSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState("");
    const [erro, setErro] = useState("");

    const limparMensagens = () => { setSucesso(""); setErro(""); };

    const salvarTutor = async () => {
        if (!formTutor.nome) return setErro("Nome é obrigatório.");
        setLoading(true); limparMensagens();
        try {
            const { data } = await api.post("/tutores", formTutor);
            setSucesso(`✅ Tutor "${data.nome}" cadastrado com sucesso!`);
            setFormTutor({ nome:"", cpf:"", telefone:"", email:"" });
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao cadastrar tutor.");
        }
        setLoading(false);
    };

    const buscarTutores = async (q) => {
        setBusca(q);
        if (q.length < 2) return setTutores([]);
        try {
            const { data } = await api.get(`/tutores?q=${q}`);
            setTutores(data);
        } catch {}
    };

    const salvarAnimal = async () => {
        if (!tutorSelecionado) return setErro("Selecione um tutor.");
        if (!formAnimal.nome || !formAnimal.especie) return setErro("Nome e espécie são obrigatórios.");
        setLoading(true); limparMensagens();
        try {
            const { data } = await api.post("/animais", {
                ...formAnimal,
                tutorId: tutorSelecionado.id,
                pesoKg: formAnimal.pesoKg ? parseFloat(formAnimal.pesoKg) : null,
            });
            setSucesso(`✅ Animal "${data.nome}" cadastrado com sucesso!`);
            setFormAnimal({ tutorId:"", nome:"", especie:"", raca:"", sexo:"", pesoKg:"", porte:"" });
            setTutorSelecionado(null); setBusca(""); setTutores([]);
        } catch (err) {
            setErro(err.response?.data?.erro || "Erro ao cadastrar animal.");
        }
        setLoading(false);
    };

    return (
        <div style={styles.page}>
            <h2 style={styles.titulo}>📋 Cadastros</h2>

            {/* ABAS */}
            <div style={styles.abas}>
                <button style={{...styles.aba, ...(aba==="tutor" ? styles.abaAtiva : {})}}
                    onClick={() => { setAba("tutor"); limparMensagens(); }}>
                    👤 Novo Tutor
                </button>
                <button style={{...styles.aba, ...(aba==="animal" ? styles.abaAtiva : {})}}
                    onClick={() => { setAba("animal"); limparMensagens(); }}>
                    🐾 Novo Animal
                </button>
            </div>

            <div style={styles.card}>
                {sucesso && <div style={styles.sucesso}>{sucesso}</div>}
                {erro && <div style={styles.erro}>{erro}</div>}

                {/* FORMULÁRIO TUTOR */}
                {aba === "tutor" && (
                    <div>
                        <div style={styles.secao}>Dados do Tutor (Responsável)</div>
                        <div style={styles.grid2}>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Nome Completo <span style={styles.req}>*</span></label>
                                <input style={styles.input} placeholder="Nome do tutor"
                                    value={formTutor.nome} onChange={e => setFormTutor({...formTutor, nome:e.target.value})} />
                            </div>
                            <div style={styles.grupo}>
                                <label style={styles.label}>CPF</label>
                                <input style={styles.input} placeholder="000.000.000-00"
                                    value={formTutor.cpf} onChange={e => setFormTutor({...formTutor, cpf:e.target.value})} />
                            </div>
                        </div>
                        <div style={styles.grid2}>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Telefone</label>
                                <input style={styles.input} placeholder="(92) 99999-9999"
                                    value={formTutor.telefone} onChange={e => setFormTutor({...formTutor, telefone:e.target.value})} />
                            </div>
                            <div style={styles.grupo}>
                                <label style={styles.label}>E-mail</label>
                                <input style={styles.input} type="email" placeholder="email@exemplo.com"
                                    value={formTutor.email} onChange={e => setFormTutor({...formTutor, email:e.target.value})} />
                            </div>
                        </div>
                        <button style={styles.btnSalvar} onClick={salvarTutor} disabled={loading}>
                            {loading ? "Salvando..." : "💾 Salvar Tutor"}
                        </button>
                    </div>
                )}

                {/* FORMULÁRIO ANIMAL */}
                {aba === "animal" && (
                    <div>
                        <div style={styles.secao}>Vincular ao Tutor</div>
                        <div style={styles.grupo}>
                            <label style={styles.label}>Buscar Tutor <span style={styles.req}>*</span></label>
                            <input style={styles.input} placeholder="Digite o nome ou CPF do tutor..."
                                value={busca} onChange={e => buscarTutores(e.target.value)} />
                            {tutores.map(t => (
                                <div key={t.id} style={styles.opcao} onClick={() => {
                                    setTutorSelecionado(t); setTutores([]); setBusca(t.nome);
                                }}>
                                    <strong>{t.nome}</strong> · {t.cpf} · {t.telefone}
                                </div>
                            ))}
                            {tutorSelecionado && (
                                <div style={styles.tutorSelecionado}>
                                    ✅ Tutor: <strong>{tutorSelecionado.nome}</strong>
                                </div>
                            )}
                        </div>

                        <div style={styles.secao}>Dados do Animal</div>
                        <div style={styles.grid2}>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Nome do Animal <span style={styles.req}>*</span></label>
                                <input style={styles.input} placeholder="Nome do animal"
                                    value={formAnimal.nome} onChange={e => setFormAnimal({...formAnimal, nome:e.target.value})} />
                            </div>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Espécie <span style={styles.req}>*</span></label>
                                <select style={styles.input}
                                    value={formAnimal.especie} onChange={e => setFormAnimal({...formAnimal, especie:e.target.value})}>
                                    <option value="">Selecione</option>
                                    <option>Cão</option>
                                    <option>Gato</option>
                                    <option>Ave</option>
                                    <option>Réptil</option>
                                    <option>Coelho</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.grid3}>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Raça</label>
                                <input style={styles.input} placeholder="Raça ou SRD"
                                    value={formAnimal.raca} onChange={e => setFormAnimal({...formAnimal, raca:e.target.value})} />
                            </div>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Porte</label>
                                <select style={styles.input}
                                    value={formAnimal.porte} onChange={e => setFormAnimal({...formAnimal, porte:e.target.value})}>
                                    <option value="">Selecione</option>
                                    <option>Pequeno</option>
                                    <option>Médio</option>
                                    <option>Grande</option>
                                    <option>Gigante</option>
                                </select>
                            </div>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Peso (kg)</label>
                                <input style={styles.input} type="number" step="0.1" placeholder="0.0"
                                    value={formAnimal.pesoKg} onChange={e => setFormAnimal({...formAnimal, pesoKg:e.target.value})} />
                            </div>
                        </div>
                        <div style={styles.grid2}>
                            <div style={styles.grupo}>
                                <label style={styles.label}>Sexo</label>
                                <select style={styles.input}
                                    value={formAnimal.sexo} onChange={e => setFormAnimal({...formAnimal, sexo:e.target.value})}>
                                    <option value="">Selecione</option>
                                    <option>Macho</option>
                                    <option>Fêmea</option>
                                    <option>Indefinido</option>
                                </select>
                            </div>
                        </div>
                        <button style={styles.btnSalvar} onClick={salvarAnimal} disabled={loading}>
                            {loading ? "Salvando..." : "💾 Salvar Animal"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { padding:24 },
    titulo: { color:"#0f172a", marginBottom:20, fontSize:22 },
    abas: { display:"flex", gap:4, background:"#e2e8f0", borderRadius:12, padding:4, marginBottom:20, width:"fit-content" },
    aba: { padding:"9px 20px", borderRadius:9, border:"none", background:"none", fontSize:13, fontWeight:600, cursor:"pointer", color:"#64748b" },
    abaAtiva: { background:"white", color:"#0f172a", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
    card: { background:"white", borderRadius:16, padding:28, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", maxWidth:700 },
    secao: { fontWeight:700, color:"#475569", fontSize:12, marginBottom:14, textTransform:"uppercase", letterSpacing:1, paddingBottom:8, borderBottom:"1px solid #f1f5f9", marginTop:8 },
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:4 },
    grid3: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:4 },
    grupo: { marginBottom:16 },
    label: { display:"block", color:"#475569", fontSize:13, fontWeight:600, marginBottom:6 },
    req: { color:"#ef4444" },
    input: { width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, boxSizing:"border-box", fontFamily:"inherit", background:"white" },
    opcao: { padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", marginTop:6, cursor:"pointer", fontSize:14, background:"#f8fafc" },
    tutorSelecionado: { marginTop:8, padding:"10px 14px", background:"#ccfbf1", borderRadius:10, fontSize:14, color:"#0f766e", fontWeight:500 },
    btnSalvar: { width:"100%", padding:14, background:"linear-gradient(135deg,#0d9488,#0f766e)", color:"white", border:"none", borderRadius:10, fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8 },
    sucesso: { background:"#dcfce7", color:"#166534", padding:"12px 16px", borderRadius:10, marginBottom:16, fontSize:14, fontWeight:500 },
    erro: { background:"#fee2e2", color:"#b91c1c", padding:"12px 16px", borderRadius:10, marginBottom:16, fontSize:14 },
};
