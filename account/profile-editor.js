/* AquaVaults profile editor: frontend prototype, backend adapter contract.
   window.AquaVaultsProfileAdapter may implement:
   async load({wallet}) -> {displayName,bio,avatarUrl,bannerUrl}
   async save({wallet,displayName,bio,avatarFile,bannerFile}) -> same shape
   No image is uploaded or persisted remotely without an adapter. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
let pendingAvatar=null,pendingBanner=null,avatarObjectUrl=null,bannerObjectUrl=null;
const modal=()=> $('avProfileEditor');
function wallet(){return ($('accountProfileWallet')?.textContent||'').trim();}
function setStatus(message){const el=$('avProfileEditorStatus');if(el)el.textContent=message;}
function setImage(file,kind){
 if(!file)return;
 if(!/^image\/(png|jpeg|webp)$/.test(file.type)){setStatus('Use PNG, JPG or WebP images.');return;}
 if(file.size>5*1024*1024){setStatus('Maximum image size is 5 MB.');return;}
 const url=URL.createObjectURL(file);
 if(kind==='avatar'){
  if(avatarObjectUrl)URL.revokeObjectURL(avatarObjectUrl);
  avatarObjectUrl=url;pendingAvatar=file;
  $('avProfileAvatarPreview').style.backgroundImage='url("'+url+'")';
 }else{
  if(bannerObjectUrl)URL.revokeObjectURL(bannerObjectUrl);
  bannerObjectUrl=url;pendingBanner=file;
  $('avProfileBannerPreview').style.backgroundImage='url("'+url+'")';
 }
 setStatus('Image ready to preview. Save to apply it to this page.');
}
function open(){
 const m=modal();if(!m)return;
 $('avProfileDisplayName').value=($('accountProfileName')?.textContent||'').trim();
 $('avProfileBio').value=($('account-social-bio-text')?.textContent||'').trim();
 $('avProfileBannerPreview').style.backgroundImage=getComputedStyle(document.querySelector('.account-social-cover')).backgroundImage;
 const avatar=document.querySelector('.account-social-avatar');
 $('avProfileAvatarPreview').style.backgroundImage=avatar?getComputedStyle(avatar).backgroundImage:'none';
 setStatus('Preview only. Connect the profile adapter to save changes permanently.');
 m.hidden=false;document.body.classList.add('av-editor-open');$('avProfileDisplayName').focus();
}
function close(){modal().hidden=true;document.body.classList.remove('av-editor-open');}
async function save(event){
 event.preventDefault();
 const name=$('avProfileDisplayName').value.trim(),bio=$('avProfileBio').value.trim();
 if(name.length<2||name.length>60){setStatus('Display name must be 2–60 characters.');return;}
 if(bio.length>280){setStatus('Bio must be 280 characters or fewer.');return;}
 const adapter=window.AquaVaultsProfileAdapter;
 const button=$('avProfileSave');
 button.disabled=true;
 try{
  let result={displayName:name,bio};
  if(adapter&&typeof adapter.save==='function'){
   result=await adapter.save({wallet:wallet(),displayName:name,bio,avatarFile:pendingAvatar,bannerFile:pendingBanner})||result;
  }
  $('accountProfileName').textContent=result.displayName||name;
  $('account-social-bio-text').textContent=result.bio??bio;
  const cover=document.querySelector('.account-social-cover');
  const avatar=document.querySelector('.account-social-avatar');
  const banner=result.bannerUrl||(pendingBanner?bannerObjectUrl:null);
  const picture=result.avatarUrl||(pendingAvatar?avatarObjectUrl:null);
  if(banner&&cover){cover.style.backgroundImage='linear-gradient(180deg,rgba(2,12,23,.05),rgba(2,12,23,.62)),url("'+banner+'")';cover.style.backgroundSize='cover';cover.style.backgroundPosition='center';}
  if(picture&&avatar){avatar.style.backgroundImage='url("'+picture+'")';avatar.style.backgroundSize='cover';avatar.style.backgroundPosition='center';avatar.classList.add('av-avatar-has-image');}
  if(!adapter||typeof adapter.save!=='function'){
   setStatus('Applied to this preview only. Nothing has been uploaded or saved to a server.');
   setTimeout(close,1400);
  }else{setStatus('Profile saved.');setTimeout(close,700);}
 }catch(e){setStatus('Could not save profile: '+(e?.message||'Please retry.'));}
 finally{button.disabled=false;}
}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-profile-editor]').forEach(el=>el.addEventListener('click',event=>{event.preventDefault();open();}));
 $('avProfileEditorClose')?.addEventListener('click',close);
 $('avProfileCancel')?.addEventListener('click',close);
 modal()?.addEventListener('click',e=>{if(e.target===modal())close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal()&&!modal().hidden)close();});
 $('avProfileAvatarFile')?.addEventListener('change',e=>setImage(e.target.files?.[0],'avatar'));
 $('avProfileBannerFile')?.addEventListener('change',e=>setImage(e.target.files?.[0],'banner'));
 $('avProfileEditorForm')?.addEventListener('submit',save);
});
})();