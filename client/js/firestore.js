import { evaluateSpice } from './ai.js'
import { getAnonId } from './wallet.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getFirestore, collection, addDoc, doc, onSnapshot, query, orderBy, limit, runTransaction, getDoc, updateDoc, setDoc, getDocs, where } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

const DEFAULT_FIREBASE_CONFIG = window.FIREBASE_CONFIG || { apiKey:'', authDomain:'', projectId:'', storageBucket:'', messagingSenderId:'', appId:'' };
let db;
export function initFirebase(config){ const cfg = config || DEFAULT_FIREBASE_CONFIG; const app = initializeApp(cfg); db = getFirestore(app); }
function ensureDb(){ if(!db) throw new Error('Firestore not initialized — call initFirebase()') }
export async function createPost({message,address,timestamp}){
  ensureDb(); const postsCol = collection(db,'posts'); const lower = (address||'').toLowerCase(); const docRef = await addDoc(postsCol,{ message,address:lower,timestamp: timestamp||Date.now(),likes:0,dislikes:0,likedBy:[],dislikedBy:[],_commentCount:0 });
  try{ const res = await evaluateSpice(message, {likes:0, dislikes:0, comments:0}); if(res && res.score){ await updateDoc(doc(db,'posts',docRef.id),{spiceScore:res.score,spiceLabel:res.label,lastSpiceEval:Date.now()}); } }catch(e){console.warn('AI evaluate failed',e)}
  try{ const anonId = getAnonId(lower); const ref = doc(db,'anonActivity',anonId); await runTransaction(db, async (t)=>{ const snap = await t.get(ref); if(!snap.exists()) t.set(ref,{anonId,addressHash:lower.slice(2,10),postsCount:1,likesReceived:0,commentsReceived:0,lastUpdated:Date.now(),activityScore:3}); else { const data = snap.data(); const postsCount=(data.postsCount||0)+1; const activityScore = postsCount*3 + ((data.likesReceived||0)*2); t.update(ref,{postsCount,lastUpdated:Date.now(),activityScore}); } }); }catch(e){console.warn('anonActivity update failed',e)}
  return docRef.id;
}
export function listenPosts(cb){ ensureDb(); const q = query(collection(db,'posts'),orderBy('timestamp','desc'),limit(50)); return onSnapshot(q,(snap)=>{ const posts=[]; snap.forEach(d=>posts.push(Object.assign({id:d.id},d.data()))); cb(posts); }); }
export async function getPostsByAddress(address){ ensureDb(); const lower = (address||'').toLowerCase(); const q = query(collection(db,'posts'),where('address','==',lower)); const snap = await getDocs(q); const posts=[]; snap.forEach(d=>posts.push(Object.assign({id:d.id},d.data()))); posts.sort((a,b)=>b.timestamp-a.timestamp); return posts; }
export function fetchTopPostsCandidates(posts){ const withScore = posts.map(p=>{ const comments = p._commentCount||0; const engagementScore = (p.likes||0)*2 + (p.dislikes||0) + (comments)*1.5; return Object.assign({},p,{engagementScore}); }); withScore.sort((a,b)=>b.engagementScore-a.engagementScore); return withScore.slice(0,10); }
export async function getAiCache(key){ ensureDb(); const ref = doc(db,'aiCache',key); const snap = await getDoc(ref); if(!snap.exists()) return null; return snap.data(); }
export async function setAiCache(key,obj){ ensureDb(); await setDoc(doc(db,'aiCache',key),obj); }
export async function addComment(postId,message,address){ 
  ensureDb(); 
  const lower = (address||'').toLowerCase(); 
  const col = collection(db,'posts',postId,'comments'); 
  const docRef = await addDoc(col,{message,address:lower,timestamp:Date.now()}); 
  
  // Trigger spice re-eval on new comment
  try{
    const postRef = doc(db,'posts',postId);
    const postSnap = await getDoc(postRef);
    if(postSnap.exists()){
      const postData = postSnap.data();
      const commentCount = (postData._commentCount||0) + 1;
      await updateDoc(postRef, {_commentCount: commentCount});
      
      // Re-evaluate spice based on new engagement
      const res = await evaluateSpice(postData.message, {
        likes: postData.likes||0,
        dislikes: postData.dislikes||0,
        comments: commentCount
      });
      if(res && res.score){
        await updateDoc(postRef, {spiceScore:res.score, spiceLabel:res.label, lastSpiceEval:Date.now()});
      }
    }
  }catch(e){console.warn('Comment spice re-eval failed',e)}
  
  return docRef.id; 
}
export function listenCommentsForPost(postId,cb){ ensureDb(); const col = collection(db,'posts',postId,'comments'); const q = query(col, orderBy('timestamp','asc')); return onSnapshot(q,(snap)=>{ const comments=[]; snap.forEach(d=>comments.push(Object.assign({id:d.id},d.data()))); cb(comments); }); }
export async function toggleVote(postId,address,type){ 
  ensureDb(); 
  const postRef = doc(db,'posts',postId); 
  const lower = (address||'').toLowerCase(); 
  
  // Run the voting transaction
  await runTransaction(db, async (t)=>{ 
    const snap = await t.get(postRef); 
    if(!snap.exists()) throw new Error('Post not found'); 
    const data = snap.data(); 
    const likedBy = new Set(data.likedBy||[]); 
    const dislikedBy = new Set(data.dislikedBy||[]); 
    let likes = data.likes||0; 
    let dislikes = data.dislikes||0; 
    let likeChanged = false;
    
    if(type==='like'){ 
      if(likedBy.has(lower)){ 
        likedBy.delete(lower); likes = Math.max(0,likes-1); likeChanged = true;
      }else{ 
        likedBy.add(lower); likes = likes+1; likeChanged = true;
        if(dislikedBy.has(lower)){ dislikedBy.delete(lower); dislikes = Math.max(0,dislikes-1)} 
      } 
    }else{ 
      if(dislikedBy.has(lower)){ 
        dislikedBy.delete(lower); dislikes = Math.max(0,dislikes-1); 
      }else{ 
        dislikedBy.add(lower); dislikes = dislikes+1; 
        if(likedBy.has(lower)){ likedBy.delete(lower); likes = Math.max(0,likes-1)} 
      } 
    } 
    
    t.update(postRef,{likes,dislikes,likedBy:Array.from(likedBy),dislikedBy:Array.from(dislikedBy)});
    
    // Trigger spice re-eval based on new engagement metrics
    const comments = data._commentCount||0;
    const res = await evaluateSpice(data.message, {likes, dislikes, comments});
    if(res && res.score){
      t.update(postRef,{spiceScore:res.score,spiceLabel:res.label,lastSpiceEval:Date.now()});
    }
    
    // Update post author's likesReceived if like was added
    if(type==='like' && likeChanged && (likes > (data.likes||0))){
      const authorAnonId = getAnonId(data.address||'');
      const authorRef = doc(db,'anonActivity',authorAnonId);
      const authorSnap = await t.get(authorRef);
      if(authorSnap.exists()){
        const authorData = authorSnap.data();
        const newLikesReceived = (authorData.likesReceived||0) + 1;
        const newActivityScore = (authorData.postsCount||0)*3 + newLikesReceived*2;
        t.update(authorRef, {likesReceived: newLikesReceived, activityScore: newActivityScore, lastUpdated: Date.now()});
      }
    }
  }); 
}
