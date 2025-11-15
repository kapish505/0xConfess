import { getAnonId } from './wallet.js'
import { listenCommentsForPost } from './firestore.js'

export function showToast(msg, timeout=3000){
  const t = document.createElement('div');
  t.className='toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(()=>t.remove(), timeout);
}

export function showBadge(badge, targetElement){
  const existingBadge = targetElement.querySelector('.badge');
  if(existingBadge){
    existingBadge.remove();
  }
  
  const badgeSpan = document.createElement('span');
  badgeSpan.className = 'badge';
  
  if(badge === 'OG'){
    badgeSpan.classList.add('badge-og');
    badgeSpan.textContent = 'OG Wallet';
  } else if(badge === 'Trusted'){
    badgeSpan.classList.add('badge-trusted');
    badgeSpan.textContent = 'Trusted Wallet';
  } else {
    badgeSpan.classList.add('badge-new');
    badgeSpan.textContent = 'New Wallet';
  }
  
  targetElement.appendChild(badgeSpan);
}

function createSpiceBadge(p){
  const span = document.createElement('span');
  span.className='spice-badge';
  const score = p.spiceScore || 1;
  span.setAttribute('aria-label', `Spice ${p.spiceLabel || 'Mild'} score ${score}`);
  let cls='spice-mild', icon='🌱';
  switch(score){
    case 1: cls='spice-mild'; icon='🌱'; break;
    case 2: cls='spice-2'; icon='🔥'; break;
    case 3: cls='spice-3'; icon='🔥🔥'; break;
    case 4: cls='spice-4'; icon='🔥🔥🔥'; break;
    case 5: cls='spice-5'; icon='🚨'; break;
    default: cls='spice-mild'; icon='🌱';
  }
  span.classList.add(cls);
  span.innerHTML = `<span class="icon">${icon}</span><span class="label">${p.spiceLabel||'Mild'}</span>`;
  return span;
}

export function renderPosts(posts, handlers={}){
  const container = document.getElementById('posts');
  container.innerHTML='';
  posts.forEach(p=>{
    const el = document.createElement('article'); el.className='post';
    const anon = getAnonId(p.address||'');
    const meta = document.createElement('div'); meta.className='meta';
    const left = document.createElement('div'); left.className='anon';
    const avatar = document.createElement('span'); avatar.className='avatar'; avatar.setAttribute('aria-hidden','true');
    const anonText = document.createElement('div');
    const anonName = document.createElement('strong');
    anonName.textContent = anon;
    anonName.className = 'anon-clickable';
    anonName.style.cursor = 'pointer';
    anonName.onclick = ()=> handlers.onProfileClick && handlers.onProfileClick(p.address);
    const timestamp = document.createElement('span');
    timestamp.className = 'muted';
    timestamp.textContent = ` • ${new Date(p.timestamp).toLocaleString()}`;
    anonText.appendChild(anonName);
    anonText.appendChild(timestamp);
    left.appendChild(avatar); left.appendChild(anonText); meta.appendChild(left);
    const right = document.createElement('div'); right.className='meta-right';
    const badge = createSpiceBadge(p); right.appendChild(badge); meta.appendChild(right);
    const message = document.createElement('div'); message.className='message'; message.textContent = p.message;
    const actions = document.createElement('div'); actions.className='actions';
    const likeBtn = document.createElement('button'); likeBtn.className='action-btn'; likeBtn.textContent = `👍 ${p.likes||0}`; likeBtn.setAttribute('aria-label','Like');
    likeBtn.onclick = async ()=>{ if(!handlers.onToggleVote) return showToast('No vote handler'); try{ const accounts = await window.ethereum.request({method:'eth_accounts'}); if(!accounts||accounts.length===0) return showToast('Connect wallet'); await handlers.onToggleVote(p.id,accounts[0].toLowerCase(),'like'); }catch(e){ showToast('Vote failed') } }
    const dislikeBtn = document.createElement('button'); dislikeBtn.className='action-btn'; dislikeBtn.textContent = `👎 ${p.dislikes||0}`; dislikeBtn.setAttribute('aria-label','Dislike');
    dislikeBtn.onclick = async ()=>{ if(!handlers.onToggleVote) return showToast('No vote handler'); try{ const accounts = await window.ethereum.request({method:'eth_accounts'}); if(!accounts||accounts.length===0) return showToast('Connect wallet'); await handlers.onToggleVote(p.id,accounts[0].toLowerCase(),'dislike'); }catch(e){ showToast('Vote failed') } }
    actions.appendChild(likeBtn); actions.appendChild(dislikeBtn);

    const commentsWrap = document.createElement('div'); commentsWrap.className='comments';
    const commentList = document.createElement('div'); commentList.className='comment-list'; commentsWrap.appendChild(commentList);
    const commentBox = document.createElement('div'); commentBox.className='comment-box';
    const input = document.createElement('input'); input.type='text'; input.placeholder='Write a comment...'; input.setAttribute('aria-label','Write a comment');
    const btn = document.createElement('button'); btn.className='btn'; btn.textContent='Comment';
    btn.onclick = async ()=>{ const text = input.value.trim(); if(!text) return showToast('Comment empty'); try{ const accounts = await window.ethereum.request({method:'eth_accounts'}); if(!accounts||accounts.length===0) return showToast('Connect wallet'); if(!handlers.onComment) return showToast('No comment handler'); await handlers.onComment(p.id,text,accounts[0].toLowerCase()); input.value=''; }catch(e){ showToast('Comment failed'); } }
    commentBox.appendChild(input); commentBox.appendChild(btn); commentsWrap.appendChild(commentBox);

    el.appendChild(meta); el.appendChild(message); el.appendChild(actions); el.appendChild(commentsWrap); container.appendChild(el);

    listenCommentsForPost(p.id,(comments)=>{ commentList.innerHTML=''; comments.forEach(c=>{ const ce = document.createElement('div'); ce.className='comment'; const anonC = getAnonId(c.address||''); const metaDiv = document.createElement('div'); metaDiv.className='meta'; const anonStrong = document.createElement('strong'); anonStrong.textContent = anonC; anonStrong.className='anon-clickable'; anonStrong.style.cursor='pointer'; anonStrong.onclick = ()=> handlers.onProfileClick && handlers.onProfileClick(c.address); const timeSpan = document.createElement('span'); timeSpan.className='muted'; timeSpan.textContent = ` • ${new Date(c.timestamp).toLocaleString()}`; metaDiv.appendChild(anonStrong); metaDiv.appendChild(timeSpan); const textDiv = document.createElement('div'); textDiv.className='text'; textDiv.textContent = c.message; ce.appendChild(metaDiv); ce.appendChild(textDiv); commentList.appendChild(ce); }); });
  });
}

export function renderSidebar(top5, activeUsers){ const top5list = document.getElementById('top5-list'); const userslist = document.getElementById('active-users-list'); if(top5list){ top5list.innerHTML=''; (top5||[]).forEach((p,idx)=>{ const li = document.createElement('li'); li.innerHTML = `<span>#${idx+1} ${p.message.slice(0,80)}</span><span class="muted">👍 ${p.likes||0}</span>`; const badge = createSpiceBadge(p); badge.style.marginLeft='8px'; li.appendChild(badge); top5list.appendChild(li); }) } if(userslist){ userslist.innerHTML=''; (activeUsers||[]).forEach(u=>{ const li = document.createElement('li'); li.innerHTML = `<span>${u.anonId}</span><span class="muted">${Math.round(u.activityScore||0)}</span>`; userslist.appendChild(li); }) } }
