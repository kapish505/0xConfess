export const AI_PROVIDER = 'openai';
export let AI_API_KEY = 'sk-your-api-key-here'; // Replace with your actual API key or load from config
function labelFromScore(s){ switch(s){ case 1: return 'Mild'; case 2: return 'Spicy'; case 3: return 'Very Spicy'; case 4: return 'Wild'; case 5: return 'Nuclear'; default: return 'Mild'; } }
function clamp(v,min,max){ return Math.max(min, Math.min(max, Math.round(v))); }
export async function evaluateSpice(text, engagement={}){
  const key = AI_API_KEY;
  const {likes=0, dislikes=0, comments=0} = engagement;
  
  // Fallback: score based on engagement metrics
  const fallback = ()=>{ 
    const engagementScore = likes*2 + dislikes + comments*1.5;
    const score = Math.min(5, Math.max(1, Math.round(engagementScore / 10 + 1)));
    return {score, label: labelFromScore(score), reason: 'fallback (engagement-based)'};
  };
  if(!key) return fallback();
  
  const prompt = `Analyze this post's engagement and message to rate its "spiciness" on a scale 1-5.\nMessage: "${text.replace(/\"/g, '\\"')}"\nMetrics: ${likes} likes, ${dislikes} dislikes, ${comments} comments.\nReturn ONLY valid JSON: {"score":int(1-5), "label":"string"}. Higher engagement = higher spice potential.`;
  try{
    const res = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'gpt-3.5-turbo',messages:[{role:'user',content:prompt}],max_tokens:60,temperature:0.2})});
    const data = await res.json(); const txt = data.choices?.[0]?.message?.content || '';
    const jsonMatch = txt.match(/\{[\s\S]*\}/);
    if(jsonMatch){ const parsed = JSON.parse(jsonMatch[0]); const score = clamp(parsed.score||1,1,5); const label = parsed.label || labelFromScore(score); return {score,label,raw:txt}; }
    return fallback();
  }catch(e){ console.warn('AI call failed',e); return fallback(); }
}
export async function scoreTopPosts(candidates){ 
  const scored = candidates.map(p=>{ 
    const comments = p._commentCount||0; 
    const engagementTotal = (p.likes||0)*2 + (p.dislikes||0) + (comments)*1.5; 
    return Object.assign({},p,{engagementScore:engagementTotal}); 
  }); 
  scored.sort((a,b)=>b.engagementScore-a.engagementScore); 
  if(!AI_API_KEY) return scored; 
  try{ 
    const top10 = scored.slice(0,10); 
    const prompt = `Rank these posts by engagement potential (high engagement = high interest). Return JSON array [{"id":...,"engagementRank":...}]`;
    const body = {model:'gpt-3.5-turbo',messages:[{role:'user',content:prompt+'\n\n'+JSON.stringify(top10.map(p=>({id:p.id,message:p.message,likes:p.likes,dislikes:p.dislikes,comments:p._commentCount||0})),null,2), }],max_tokens:200,temperature:0.2};
    const res = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+AI_API_KEY},body:JSON.stringify(body)});
    const data = await res.json(); const txt = data.choices?.[0]?.message?.content || ''; const jsonMatch = txt.match(/\[([\s\S]*)\]/);
    if(jsonMatch){ const arr = JSON.parse(jsonMatch[0]); const map = new Map(); arr.forEach(a=>map.set(a.id,a.engagementRank||0)); scored.forEach(s=>{ if(map.has(s.id)) s.aiScore = map.get(s.id); else s.aiScore = s.engagementScore }); scored.sort((a,b)=> (b.aiScore||0) - (a.aiScore||0) ); return scored; }
    return scored;
  }catch(e){ console.warn('scoreTopPosts AI failed',e); return scored; }
}
export async function scoreActiveUsers(activityObjects){ 
  return activityObjects.map(u=>{ 
    const totalEngagementReceived = (u.likesReceived||0) + (u.commentsReceived||0)*1.5; 
    const userScore = (u.postsCount||0)*3 + totalEngagementReceived*2; 
    return {anonId:u.anonId, activityScore:userScore, postsCount:u.postsCount, likesReceived:u.likesReceived}; 
  }).sort((a,b)=>b.activityScore-a.activityScore); 
}
