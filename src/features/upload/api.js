// src/features/upload/api.js
import { API_ENDPOINTS, API_BASE_URL, toAbs, apiGet } from '../../config/api';

/* ---------- 小工具 ---------- */
export function validateFileType(f){const ok=['.dcm','.jpg','.jpeg','.png'];const n=(f?.name||'').toLowerCase();return ok.some(e=>n.endsWith(e));}
export function validateFileSize(f,m=50){return (f?.size||0)<=m*1024*1024;}
export function getFilePreviewUrl(file){try{return URL.createObjectURL(file);}catch{return null;}}

/* ---------- 解包：把 data/result/output 这种外壳剥掉 ---------- */
function unwrap(obj){
  if(!obj||typeof obj!=='object') return {};
  let cur=obj;
  if(cur.data   && typeof cur.data   ==='object') cur=cur.data;
  if(cur.result && typeof cur.result ==='object') cur=cur.result;
  if(cur.output && typeof cur.output ==='object') cur=cur.output;
  return cur;
}

/* ---------- 统一 classifications 解析（覆盖更多别名） ---------- */
function normalizeCls(data){
  const d = unwrap(data);
  let cls = [];

  // 1) 标准字段
  if (Array.isArray(d?.classifications)) {
    cls = d.classifications.map(x=>({
      label: x.label ?? x.name ?? x.class ?? x.category ?? 'Unknown',
      confidence: Number(x.confidence ?? x.probability ?? x.score ?? x.prob ?? 0),
      description: x.description || x.desc || ''
    }));
  }

  // 2) probs 映射
  if (!cls.length && d?.probs && typeof d.probs === 'object') {
    cls = Object.entries(d.probs)
      .map(([l,p])=>({label:l, confidence:Number(p)||0}))
      .sort((a,b)=>b.confidence-a.confidence);
  }

  // 3) predictions / results / topk / items
  for (const k of ['predictions','results','topk','top_k','items']) {
    if (!cls.length && Array.isArray(d?.[k])) {
      cls = d[k].map(x=>({
        label: x.label ?? x.name ?? x.class ?? x.category ?? 'Unknown',
        confidence: Number(x.confidence ?? x.probability ?? x.score ?? x.prob ?? 0),
        description: x.description || x.desc || ''
      }));
      break;
    }
  }

  // 4) 并行数组 labels + scores
  const L = d?.labels || d?.classes || d?.top_labels;
  const S = d?.scores || d?.top_scores || d?.confidences;
  if (!cls.length && Array.isArray(L) && Array.isArray(S) && L.length===S.length) {
    cls = L.map((l,i)=>({label:String(l), confidence:Number(S[i])||0}));
  }

  // 5) 顶层直接是数组对象
  if (!cls.length && Array.isArray(d)) {
    cls = d.map(x=>({
      label: x?.label ?? x?.name ?? x?.class ?? 'Unknown',
      confidence: Number(x?.confidence ?? x?.probability ?? x?.score ?? x?.prob ?? 0),
    }));
  }

  // 6) 单对象
  if (!cls.length && (d?.disease || d?.label || d?.name)) {
    cls = [{
      label: d.disease || d.label || d.name,
      confidence: Number(d.confidence ?? d.score ?? d.probability ?? d.prob ?? 0)
    }];
  }

  return cls;
}

/* ---------- 统一热力图/原图字段 ---------- */
function pickHeatmapUrl(data){
  const d = unwrap(data);
  const cands = [
    d.heatmap_image_url, d.heatmapUrl, d.heatmap,
    d.cam_url, d.gradcam, d.cam, d.gradcam_url,
    d.heatmap_path, d.cam_path, d.gradcam_path,
  ];
  const first = cands.find(Boolean);
  return first ? toAbs(first) : null;
}

function pickOriginalUrl(data){
  const d = unwrap(data);
  const cands = [
    d.original_image_url, d.originalImageUrl, d.original,
    d.image_url, d.img_url, d.image_path, d.img_path,
  ];
  const first = cands.find(Boolean);
  return first ? toAbs(first) : null;
}

/* ---------- 统一响应 ---------- */
function normalizeAnalyzeResponse(raw){
  let data = raw;
  if (typeof raw === 'string') { try { data = JSON.parse(raw); } catch { data = {}; } }
  const core = unwrap(data);

  const cls = normalizeCls(data);
  const heatmapUrl  = pickHeatmapUrl(data);
  const originalUrl = pickOriginalUrl(data);

  const success =
    data?.success===true || core?.success===true ||
    data?.ok===true      || core?.ok===true      ||
    String(data?.status || core?.status || '').toLowerCase()==='ok' ||
    cls.length>0 || !!heatmapUrl;

  return {
    success,
    classifications: cls,
    disease: cls[0]?.label || 'Unknown',
    confidence: Number(cls[0]?.confidence || 0),
    heatmapUrl,
    originalImageUrl: originalUrl,
    meta: core?.meta || data?.meta || {},
    rawResponse: data
  };
}

/* ---------- CheXpert ---------- */
export async function uploadAndAnalyzeImage(file, options={}){
  const fd=new FormData();
  fd.append('file',file);
  fd.append('generate_heatmap', String(options.generate_heatmap ?? true));
  fd.append('threshold',       String(options.threshold ?? 0.5));
  fd.append('alpha',           String(options.alpha ?? 0.45));
  if (options.return_top_k != null) fd.append('return_top_k', String(options.return_top_k));

  const r   = await fetch(API_ENDPOINTS.ANALYZE, { method:'POST', body: fd });
  const txt = await r.text();
  console.log('[RAW chexpert response]', txt);
  let data; try { data = JSON.parse(txt); } catch { data = txt; }
  console.log('[PARSED chexpert]', data);
  return normalizeAnalyzeResponse(data);
}

/* ---------- Pathology ---------- */
export async function analyzePathology(file, options={}){
  const fd=new FormData();
  fd.append('file',file);
  if (options.top_k    != null) fd.append('top_k', String(options.top_k));
  if (options.min_prob != null) fd.append('min_prob', String(options.min_prob));

  const r   = await fetch(API_ENDPOINTS.PATHO_ANALYZE, { method:'POST', body: fd });
  const txt = await r.text();
  console.log('[RAW pathology response]', txt);
  let data; try { data = JSON.parse(txt); } catch { data = txt; }
  console.log('[PARSED pathology]', data);
  return normalizeAnalyzeResponse(data);
}

/* ---------- 标签（后端无接口则使用 CheXpert-14） ---------- */
const DEFAULT_LABELS=[
  'No Finding','Enlarged Cardiomediastinum','Cardiomegaly','Lung Lesion','Lung Opacity',
  'Edema','Consolidation','Pneumonia','Atelectasis','Pneumothorax',
  'Pleural Effusion','Pleural Other','Fracture','Support Devices'
];
export async function getPathologyLabels(){
  try{
    const data = await apiGet(API_ENDPOINTS.PATHO_LABELS);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.labels)) return data.labels;
  }catch{}
  return DEFAULT_LABELS;
}

/* ---------- 并发拿两个模型 ---------- */
export async function analyzeBoth(file, opts={}){
  const [chexpert, pathology] = await Promise.all([
    uploadAndAnalyzeImage(file, opts),
    analyzePathology(file,   { top_k: opts.return_top_k, min_prob: opts.threshold })
  ]);
  return { chexpert, pathology };
}

/* 兼容旧导出名 */
export async function uploadAndAnalyzeImageFull(file, options={}){ return uploadAndAnalyzeImage(file, options); }
