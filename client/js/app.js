import { initFirebase, listenPosts, createPost, addComment, toggleVote, fetchTopPostsCandidates, getAiCache, setAiCache, listenCommentsForPost } from './firestore.js'
import { connectWallet, getAddress, getAnonId } from './wallet.js'
import { renderPosts, renderSidebar, showToast, showBadge } from './ui.js'
import { analyzeWallet } from './walletBadge.js'
import { showProfileModal } from './profileModal.js'
import * as ai from './ai.js'

initFirebase();

if (location.pathname.endsWith('/client/wall.html')) {
  wallInit();
}

async function wallInit(){
  const walletArea = document.getElementById('wallet-area');
  const postBtn = document.getElementById('post-btn');
  const newPost = document.getElementById('new-post');

  const connectBtn = document.createElement('button');
  connectBtn.className = 'btn';
  connectBtn.textContent = 'Connect Wallet';
  connectBtn.onclick = async ()=>{
    try{
      await connectWallet();
      const addr = await getAddress();
      connectBtn.textContent = addr.slice(0,6)+'…'+addr.slice(-4);
      
      showToast('Analyzing wallet reputation...');
      const stats = await analyzeWallet(addr);
      showBadge(stats.badge, walletArea);
      showToast(`Wallet analyzed: ${stats.badge} Wallet (${stats.txCount} txs, ${stats.walletAge} blocks age)`);
    }catch(e){
      showToast('MetaMask connection failed');
    }
  }
  walletArea.appendChild(connectBtn);

  postBtn.onclick = async ()=>{
    const text = newPost.value.trim(); if(!text){ showToast('Write something first'); return }
    try{ const addr = await getAddress(); await createPost({message:text,address:addr,timestamp:Date.now()}); newPost.value=''; showToast('Posted — AI spice eval will run'); }catch(err){ showToast('Post failed: '+err.message); }
  }

  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  sidebarToggle.addEventListener('click', ()=>{ const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true'; sidebarToggle.setAttribute('aria-expanded', String(!expanded)); sidebar.classList.toggle('collapsed'); });

  listenPosts(async (posts)=>{
    renderPosts(posts, {onComment:addComment,onToggleVote:toggleVote,onProfileClick:showProfileModal});
    const candidates = fetchTopPostsCandidates(posts);
    const cache = await getAiCache('top5');
    const oneHour = 60*60*1000;
    if(!cache || (Date.now()-cache.lastUpdated)>oneHour){
      const refined = await ai.scoreTopPosts(candidates);
      const top5 = refined.slice(0,5);
      renderSidebar(top5, null);
      await setAiCache('top5',{items:top5,lastUpdated:Date.now()});
    }else{
      renderSidebar(cache.items, null);
    }
  });
}
