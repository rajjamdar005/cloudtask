import {useCallback,useEffect,useMemo,useState} from "react";
import {Check,Cloud,LoaderCircle,Plus,RefreshCw,Trash2} from "lucide-react";
const API=(import.meta.env.VITE_API_BASE_URL||"https://zljassl5z6.execute-api.us-east-1.amazonaws.com").replace(/\/$/,"");
async function request(path,options={}) {
  const res=await fetch(`${API}${path}`,{...options,headers:{...(options.body?{"Content-Type":"application/json"}:{}),...options.headers}});
  const text=await res.text(); let data={}; try{data=text?JSON.parse(text):{}}catch{throw new Error(`Unexpected API response (${res.status})`)}
  if(!res.ok)throw new Error(data.error||data.message||`Request failed (${res.status})`); return data;
}
export default function App(){
 const [tasks,setTasks]=useState([]),[title,setTitle]=useState(""),[filter,setFilter]=useState("all"),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const d=await request("/tasks");setTasks(Array.isArray(d.tasks)?d.tasks:[])}catch(e){setError(`${e.message}. Check API URL, routes, CORS, and Lambda logs.`)}finally{setLoading(false)}},[]);
 useEffect(()=>{load()},[load]);
 const shown=useMemo(()=>filter==="active"?tasks.filter(t=>!t.completed):filter==="completed"?tasks.filter(t=>t.completed):tasks,[tasks,filter]);
 async function add(e){e.preventDefault();if(!title.trim()||saving)return;setSaving(true);setError("");setNotice("");try{await request("/tasks",{method:"POST",body:JSON.stringify({title:title.trim()})});setTitle("");setNotice("Task added.");await load()}catch(e){setError(e.message)}finally{setSaving(false)}}
 async function toggle(t){setError("");try{await request(`/tasks/${encodeURIComponent(t.id)}`,{method:"PUT",body:JSON.stringify({completed:!t.completed})});await load()}catch(e){setError(e.message)}}
 async function remove(t){setError("");try{await request(`/tasks/${encodeURIComponent(t.id)}`,{method:"DELETE"});setNotice("Task deleted.");await load()}catch(e){setError(e.message)}}
 const completed=tasks.filter(t=>t.completed).length;
 return <main className="page"><header><a className="brand" href="/"><span className="mark"><Cloud size={20}/></span>cloud<span>tasks</span></a><span className="pill"><i/> AWS-powered workspace</span></header>
 <section className="hero"><small>YOUR WORK, IN FLOW</small><h1>Make space for<br/><em>what matters.</em></h1><p>A calmer place to capture tasks, make progress, and keep moving.</p></section>
 <section className="panel"><div className="panel-head"><div><small>YOUR WORKSPACE</small><h2>Today's tasks <b>{tasks.length}</b></h2></div><button className="refresh" onClick={load} aria-label="Refresh tasks"><RefreshCw size={17}/></button></div>
 <form onSubmit={add}><Plus size={18}/><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What needs your attention?" maxLength={180} aria-label="New task"/><button className="add" disabled={!title.trim()||saving}>{saving?<LoaderCircle className="spin" size={17}/>:"Add task"}</button></form>
 <div className="toolbar"><nav>{[["all","All tasks"],["active","In progress"],["completed","Completed"]].map(([v,l])=><button type="button" key={v} onClick={()=>setFilter(v)} className={filter===v?"selected":""}>{l}</button>)}</nav><span>{completed} of {tasks.length} done</span></div>
 {error&&<p className="message error" role="alert">{error}</p>}{notice&&!error&&<p className="message success" role="status">{notice}</p>}
 <div className="list">{loading?<p className="empty"><LoaderCircle className="spin"/> Loading tasks…</p>:shown.length===0?<div className="empty"><h3>{tasks.length?"Nothing in this view.":"A fresh start."}</h3><p>{tasks.length?"Try another filter.":"Add your first task above."}</p></div>:shown.map(t=><article className="task" key={t.id}><button className={`check ${t.completed?"done":""}`} onClick={()=>toggle(t)} aria-label="Toggle task">{t.completed?<Check size={16}/>:<span/>}</button><span className={t.completed?"strike":""}>{t.title}</span><small>{t.completed?"Done":"In progress"}</small><button className="delete" onClick={()=>remove(t)} aria-label={`Delete ${t.title}`}><Trash2 size={16}/></button></article>)}</div>
 <footer><span><i/> Connected through API Gateway</span><span>Keep it moving.</span></footer></section><div className="bottom"><span>CLOUDTASKS / PERSONAL PRODUCTIVITY</span><span>Built to learn. Designed to do.</span></div></main>
}