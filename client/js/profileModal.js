import { getAnonId } from './wallet.js'
import { analyzeWallet } from './walletBadge.js'
import { getPostsByAddress } from './firestore.js'
import { showToast } from './ui.js'

let currentModal = null;

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

export async function showProfileModal(address){
  if(currentModal){
    currentModal.remove();
  }
  
  const modal = document.createElement('div');
  modal.className = 'profile-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  const overlay = document.createElement('div');
  overlay.className = 'profile-overlay';
  overlay.onclick = ()=> closeProfileModal();
  
  const content = document.createElement('div');
  content.className = 'profile-content';
  
  const header = document.createElement('div');
  header.className = 'profile-header';
  
  const anonId = getAnonId(address);
  const avatar = document.createElement('span');
  avatar.className = 'avatar profile-avatar';
  
  const headerInfo = document.createElement('div');
  headerInfo.className = 'profile-header-info';
  
  const anonName = document.createElement('h2');
  anonName.textContent = anonId;
  anonName.className = 'profile-anon-name';
  
  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'profile-badge-container';
  badgeContainer.innerHTML = '<span class="muted">Analyzing wallet...</span>';
  
  headerInfo.appendChild(anonName);
  headerInfo.appendChild(badgeContainer);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'profile-close-btn';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close profile');
  closeBtn.onclick = ()=> closeProfileModal();
  
  header.appendChild(avatar);
  header.appendChild(headerInfo);
  header.appendChild(closeBtn);
  
  const postsContainer = document.createElement('div');
  postsContainer.className = 'profile-posts';
  postsContainer.innerHTML = '<div class="muted" style="text-align:center;padding:20px">Loading posts...</div>';
  
  content.appendChild(header);
  content.appendChild(postsContainer);
  
  modal.appendChild(overlay);
  modal.appendChild(content);
  document.body.appendChild(modal);
  currentModal = modal;
  
  try{
    const stats = await analyzeWallet(address);
    badgeContainer.innerHTML = '';
    
    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'badge';
    
    if(stats.badge === 'OG'){
      badgeSpan.classList.add('badge-og');
      badgeSpan.textContent = 'OG Wallet';
    } else if(stats.badge === 'Trusted'){
      badgeSpan.classList.add('badge-trusted');
      badgeSpan.textContent = 'Trusted Wallet';
    } else {
      badgeSpan.classList.add('badge-new');
      badgeSpan.textContent = 'New Wallet';
    }
    
    badgeContainer.appendChild(badgeSpan);
    
    const statsText = document.createElement('div');
    statsText.className = 'muted profile-stats';
    statsText.textContent = `${stats.txCount} transactions • ${stats.walletAge.toLocaleString()} blocks age`;
    badgeContainer.appendChild(statsText);
  }catch(e){
    console.error('Failed to analyze wallet:', e);
    badgeContainer.innerHTML = '<span class="badge badge-new">New Wallet</span>';
  }
  
  try{
    const posts = await getPostsByAddress(address);
    postsContainer.innerHTML = '';
    
    if(posts.length === 0){
      postsContainer.innerHTML = '<div class="muted" style="text-align:center;padding:20px">No posts yet</div>';
    } else {
      posts.forEach(p => {
        const postEl = document.createElement('div');
        postEl.className = 'profile-post-item';
        
        const postMeta = document.createElement('div');
        postMeta.className = 'profile-post-meta';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'muted';
        timestamp.textContent = new Date(p.timestamp).toLocaleString();
        
        postMeta.appendChild(timestamp);
        postMeta.appendChild(createSpiceBadge(p));
        
        const message = document.createElement('div');
        message.className = 'profile-post-message';
        message.textContent = p.message;
        
        const engagement = document.createElement('div');
        engagement.className = 'profile-post-engagement';
        engagement.innerHTML = `<span>👍 ${p.likes||0}</span> <span>👎 ${p.dislikes||0}</span> <span>💬 ${p._commentCount||0}</span>`;
        
        postEl.appendChild(postMeta);
        postEl.appendChild(message);
        postEl.appendChild(engagement);
        
        postsContainer.appendChild(postEl);
      });
    }
  }catch(e){
    console.error('Failed to load posts:', e);
    postsContainer.innerHTML = '<div class="muted" style="text-align:center;padding:20px">Failed to load posts</div>';
  }
}

export function closeProfileModal(){
  if(currentModal){
    currentModal.remove();
    currentModal = null;
  }
}
