/* AQUAVAULTS REDESIGN MOCK — full-site supplemental fixtures. LOCALHOST ONLY.
 * UI-only synthetic state; no onchain, payout, payment, signature, or production calls.
 * Interposes after phase-one mock-runtime.js and before site scripts.
 */
(function(){
'use strict';
if(!/^(?!(?:[a-z0-9-]+\.)*aquavaults\.com$)(?!(?:[a-z0-9-]+\.)*aquavaults-com\.pages\.dev$)(?!(?:[a-z0-9-]+\.)*aquavaults\.pages\.dev$)[a-z0-9.-]+$/.test(location.hostname)) throw Error('Design mock refuses unauthorized host');
if(!window.AquaVaultsDesignMock) throw Error('Phase-one design mock is required');
const demoWallet='9nAM57vViGc4hmfgHAkCzZu8HTUwbcvhBgfuS1eK5Chm';
const key='av-design-preview-v1';
const now=()=>new Date().toISOString();
const today=()=>now().slice(0,10);
const month=()=>now().slice(0,7);
const expires='2099-01-01T00:00:00Z';
function scenario(){return window.AquaVaultsDesignMock.getScenario();}
const account=()=>scenario().account==='setup'; // An Account session can outlive wallet connection.
const community=()=>scenario().role==='owner'||scenario().role==='member'||scenario().role==='admin';
const admin=()=>scenario().role==='admin';
const partner=()=>scenario().partner==='active';
const founding=()=>scenario().community_type==='founding';
const wealthy=()=>Number(scenario().points||0)>0;
function respond(body,status=200){return new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','X-AV-Design-Mock':'2','Cache-Control':'no-store'}});}
const requireFounder=fn=>req=>community()?fn(req):{_status:401,error:'AUTH_REQUIRED'};
const requireAccount=fn=>req=>account()?fn(req):{_status:401,ok:false,error:'ACCOUNT_SESSION_REQUIRED'};
const requireAdmin=fn=>req=>admin()?fn(req):{_status:401,error:'AUTH_REQUIRED'};
function dashboard(){return window.AquaVaultsDesignMock.makeDashboardFixture(false);}
function communityConnect(){
  const s=scenario();const has=['linked','listing_approved','listing_pending'].includes(s.connector);
  const verified=s.connector==='listing_approved';
  return {ok:true,communityId:'design-demo',code:'design-demo',
    link:location.origin+'/connect?code=design-demo',treasuryWallet:demoWallet,
    totalApplications:has?4:0,pendingApplications:has?1:0,approvedApplications:has?3:0,
    verifiedConnections:verified?2:0,
    recent:has?[{applicationId:'preview-001',communityId:verified?'example-one':null,
      submittedAt:now(),applicationStatus:verified?'approved':'under_review',verified}]:[]};
}
function rewardsCycle(){
 const start=month()+'-01T00:00:00Z';const d=new Date();const ends=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)).toISOString();
 return {cycleKey:month(),state:'active',startsAt:start,endsAt:ends,
  cycleDays:new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate(),
  adjustedMaximumPoints:1000,eligibilityThresholdPoints:300,pointSnapshotVersion:'1',
  startingMaximumPoints:1000,eligibilityBps:3000,rosterCount:roster.length,taskCount:17,
  rulesVersion:'1.1',consentVersion:'1.1',publishedAt:start};
}
function task(taskId,label,maximumPoints,displayedPoints=0,sequence=undefined){
 const complete=displayedPoints>=maximumPoints;
 return {taskId,label,maximumPoints,displayedPoints,pointsRemaining:Math.max(0,maximumPoints-displayedPoints),
  complete,status:complete?'complete':'current',...(sequence?{sequence}:{})};
}
const roster=[{communityId:'aquavaults',communityName:'AquaVaults',status:'active',rosterOrder:1},
 {communityId:'demplar',communityName:'Knights Demplar',status:'active',rosterOrder:2},
 {communityId:'touchgrass',communityName:'Touch Grass',status:'active',rosterOrder:3},
 {communityId:'pissin',communityName:'PISSIN',status:'active',rosterOrder:4}];
function points(){return Math.max(0,Math.min(100000,Number(scenario().points)||0));}
function rewardsMe(){
 const p=points(),q=p>=300;const completed=p>=250;
 const names=['Two Communities','AquaVaults Swap','Four Communities','Full Daily Co-Op','Eight Communities','AquaVaults $25 Day','Every Roster Community','Community LP Claim'];
 const daily=[task('daily_qualifying_swaps','Qualifying Swaps',7,p?7:0),task('daily_community_pair','Community Pair',2,p?2:0),
  task('daily_loyalty_community','Loyalty Community',1,p?1:0),task('daily_coop_participation','Co-Op Participation',2,p?2:0),
  task('daily_secure_session_close','Secure Session Close',1,p?1:0)];
 const bonus=[task('cycle_aquavaults_support','AquaVaults Support',8,p>60?3:0),
  task('cycle_active_participation','Active Participation',16,p>100?8:0),
  task('cycle_loyalty_streak','Loyalty Streak',12,p>150?5:0),
  task('cycle_product_explorer','Product Explorer',5,p>70?5:0)];
 const quests=names.map((n,i)=>({...task('quest_step_'+(i+1),'Quest Step '+(i+1)+' · '+n,2,completed&&i<3?2:0,i+1),
  status:completed&&i<3?'complete':i===(completed?3:0)?'current':'locked'}));
 const chosen=scenario().loyalty==='selected'?{communityId:'demplar',effectiveAt:now(),selectionType:'self'}:null;
 return {ok:true,authenticated:true,account:{wallet:demoWallet,walletDisplay:'DESIGN…DEMO',status:'active'},cycle:rewardsCycle(),
  points:{verifiedPoints:p,adjustedMaximumPoints:1000,eligibilityThresholdPoints:300,
    pointsToThreshold:Math.max(0,300-p),pointsToMaximum:Math.max(0,1000-p),thresholdMet:q,
    eligibilityStatus:q?'qualified_provisional':'not_yet_qualified',progressBps:Math.min(10000,p*10)},
  daily:{utcDay:today(),maximumPoints:daily.reduce((n,x)=>n+x.maximumPoints,0),pointsEarned:daily.reduce((n,x)=>n+x.displayedPoints,0),tasks:daily},
  cycleBonuses:{maximumPoints:41,pointsEarned:bonus.reduce((n,x)=>n+x.displayedPoints,0),pendingCandidateCount:0,pendingCandidatePoints:0,tasks:bonus},
  quest:{maximumPoints:16,pointsEarned:quests.reduce((n,x)=>n+x.displayedPoints,0),awardedThroughSequence:completed?3:0,
    evidenceReadyThroughSequence:completed?3:0,tasks:quests},
  productExplorer:{requiredDistinctSurfaces:3,distinctSurfaces:p>70?3:p?1:0,
    surfaces:p>70?['manual_swap','autoswap','coop']:p?['manual_swap']:[],
    pointsEarned:p>70?5:0,complete:p>70},
  loyalty:{selection:chosen,selectionHistory:chosen?[chosen]:[]},roster,
  rosterSummary:{active:roster.length,waived:0,total:roster.length}};
}
function rewardsPolicy(){
 const r=roster;const tasks=[
  ['daily_qualifying_swaps','Qualifying Swaps','daily',7],['daily_community_pair','Community Pair','daily',2],
  ['daily_loyalty_community','Loyalty Community','daily',1],['daily_coop_participation','Co-Op Participation','daily',2],
  ['daily_secure_session_close','Secure Session Close','daily',1],['cycle_aquavaults_support','AquaVaults Support','cycle_bonus',8],
  ['cycle_active_participation','Active Participation','cycle_bonus',16],['cycle_loyalty_streak','Loyalty Streak','cycle_bonus',12],
  ['cycle_product_explorer','Product Explorer','cycle_bonus',5],
  ...Array.from({length:8},(_,i)=>['quest_step_'+(i+1),'Quest Step '+(i+1),'quest',2])
 ].map(([taskId,label,category,maximumPoints])=>({taskId,label,category,maximumPoints,
    summary:'Illustrative layout data only. No real points or eligibility.',requirements:['All activities are disabled in this local preview.'],
    ...(category==='quest'?{sequence:Number(taskId.slice(-1))}:{})}));
 return {ok:true,enrollment:{open:true,mode:'production',productionOpen:true,localEnrollment:false,
    rulesVersion:'1.1',consentVersion:'1.1',heading:'Rewards preview',acknowledgment:['Synthetic data for redesign review. No financial activity is enabled.']},
  rules:{version:'1.1',consentVersion:'1.1',url:'/rewards/rules',summary:[
    'Synthetic presentation data; these numbers do not represent real user rewards.',
    'No actual enrollment, swaps, or distributions occur in this environment.'],
    limitOrdersIncluded:false,permanentWallet:true,distributionAsset:'USDC',participantClaimRequired:false},
  taskCatalog:{pointSnapshotVersion:'1',dailyMaximumPoints:13,fixedCyclePoints:57,taskCount:tasks.length,
    eligibilityPercent:30,categoryTotals:{daily:13,cycle_bonus:41,quest:16},
    cycleScenarios:[{cycleDays:28,startingMaximumPoints:1000,eligibilityThresholdPoints:300},
      {cycleDays:30,startingMaximumPoints:1000,eligibilityThresholdPoints:300}],tasks}};
}
function coopEntries(){const d=Math.max(0,Number(scenario().coop_droplets)||0);return {
  entries:d>0?[{id:'design-mine-1',action:'Mine',community:'design-demo',amount:Math.min(d,6),rewardWeight:Math.min(d,6),occurredAt:now()}]:[],
  history:d>0?[{id:'design-mine-1',action:'Mine',community:'design-demo',amount:Math.min(d,6),rewardWeight:Math.min(d,6),occurredAt:now()}]:[]};}
function mockAdminCommunities(){
 const s=scenario(); const rows=[
  {community_id:'design-demo',status:s.community_type==='founding'?'founding':'standard',tier:'base',badges:[],share_bps:partner()?7000:6000,partner_active:partner(),owner_count:1,member_count:3,pending_claim_count:0,pending_invite_count:1,current_month_fee_usd:345},
  {community_id:'example-one',status:'standard',tier:'silver',badges:[],share_bps:6500,partner_active:false,owner_count:1,member_count:4,pending_claim_count:1,pending_invite_count:0,current_month_fee_usd:612},
  {community_id:'example-two',status:'founding',tier:'gold',badges:[],share_bps:7500,partner_active:true,owner_count:1,member_count:8,pending_claim_count:0,pending_invite_count:0,current_month_fee_usd:1425}
 ];return {communities:rows,total:rows.length,page:1,limit:50};
}
function adminHome(){return{ok:true,program_started:true,program_start:'2026-07-01',
 totals:{communities:3,no_owner:0,disabled_owner:0,pending_claims:1,pending_invites:1,stale_founders:0,near_tier:1,low_volume:1},
 attention:{no_owner:[],disabled_owner:[],pending_claims:[],pending_invites:[],stale_founders:[],near_tier:[],low_volume:[]},
 recent_admin_actions:[],recent_grant_activity:[],
 quick_links:[{label:'Communities',hash:'#/communities'},{label:'Command Center Preview',hash:'#/preview'},
  {label:'Connector Program',hash:'#/connector-program/applications'},
  {label:'Co-Op Rig',hash:'#/coop-rig'}]};}
function adminCommunity(req){const id=req.searchParams.get('community')||'design-demo';
 const d=dashboard();return {found:true,community_id:id,program:d.standing,standing:d.standing,
   analytics:d,summary:{community_id:id,status:d.standing.status},users:[],access:{owners:[],members:[]}};}
function campaign(){const s=scenario();const lifecycle=s.campaign_state||'active';return {ok:true,campaign:{
  campaign_id:'design-example-campaign',lifecycle_state:lifecycle,
  placement:{division_number:1,multiplier_bps:10000},
  participant:{participant_state:lifecycle==='withdrawn'?'withdrawn':'active'},
  capabilities:{can_withdraw:false,admin_reinstatement_only:false},
  live_shadow:lifecycle==='active'?{score_units:840,shadow_rank:3,source_cutoff_at:now()}:null,
  live_shadow_pending:false,final_shadow:lifecycle==='completed'?{points:840,shadow_rank:3}:null}};}
function wheelAccess(){const isOwner=scenario().role==='owner',enhanced=partner();return {
  access:{community_id:'design-demo',tier:enhanced?'partner':'listed',
    can_view:true,can_manage:isOwner,max_entries:10000,
    retention_days:enhanced?180:30,partner_expires_at:enhanced?expires:null},
  tooling_available:false};}
function intelligenceAccess(){
 const owner=scenario().role==='owner',included=founding()||partner();
 return {can_view:true,community_id:'design-demo',eligible:included,
   can_manage:owner,paid_mode:owner&&!included,
   access_tier:included?(partner()?'partner':'founding'):'listed'};
}
function overviewCard(){const d=scenario().coop_droplets;return {
  ok:true,status:scenario().coop_state,swaps:d,countedSwaps:d,activities:[],recent:[],score:d*1.5};}
function maybeEmpty(req){return{ok:true,items:[],results:[],rows:[],count:0,total:0,hasMore:false,nextCursor:null,
  message:'Design-only empty state. No real records are loaded.'};}
const GET={
 '/api/account/activity':requireAccount(()=>({ok:true,programs:{
   rewards:{status:'active',cycle:rewardsCycle(),points:rewardsMe().points,
     recentEvents:wealthy()?[{label:'Preview qualifying swap',netPoints:2,occurredAt:now()}]:[]},
   coop:{status:'active',currentCycle:{rewardWeight:Math.max(0,Number(scenario().coop_droplets)||0)*1.5},cycleIntegrity:{eligible:true},
     recentContributions:coopEntries().entries},
   connector:{status:scenario().connector==='not_linked'?'not_activated':'active',earnings:{status:'not_implemented'}}}})),
 '/api/dashboard/community-connect':requireFounder(()=>communityConnect()),
 '/api/program/dashboard':requireFounder(()=>{const d=dashboard();
   if(scenario().data_density==='empty'){d.trend=[];d.history=[];d.hero_tokens=[];d.attribution=null;
     d.earnings={lifetime:{volume_lamports:'0',fees_lamports:'0',community_fees_lamports:'0'},
       d7:{volume_lamports:0,fees_lamports:0,community_fees_lamports:0},
       d30:{volume_lamports:0,fees_lamports:0,community_fees_lamports:0}};
     d.months={this_month:null,last_month:null};d.drivers={top_tokens:{d7:{items:[],coverage_pct:0},d30:{items:[],coverage_pct:0}},by_source:{d7:{},d30:{}}};
     d.activity={d7:{swaps:0,distinct_wallets:0},d30:{swaps:0,distinct_wallets:0}};
     d.coop={...d.coop,points:0,contributors:0,entries:0,has_activity:false};
     d.next_action='No current demo activity. Use the scenario toolbar to populate the dashboard.';}return d;}),
 '/api/rewards/me':requireAccount(()=>rewardsMe()),
 '/api/rewards/cycle':()=>({ok:true,cycle:rewardsCycle(),roster,tasks:rewardsPolicy().taskCatalog.tasks}),
 '/api/rewards/policy':()=>rewardsPolicy(),
 '/api/rewards/history':requireAccount(()=>({ok:true,cycle:rewardsCycle(),events:wealthy()?[{
    label:'Example qualifying swap',netPoints:7,occurredAt:now(),verificationStatus:'verified'}]:[],
    points:wealthy()?[{label:'Daily qualifying swap',pointsDelta:7,createdAt:now(),entryStatus:'verified'}]:[],limit:25})),
 '/api/rewards/pending-activity':requireAccount(()=>({ok:true,activities:wealthy()?[{
    label:'Synthetic point activity',communityId:'demplar',occurredAt:now()}]:[],
    timing:{lastPointsUpdateAt:now(),nextPointsUpdateAt:new Date(Date.now()+3600000).toISOString()}})),
 '/api/rewards/loyalty':requireAccount(()=>({ok:true,cycle:rewardsCycle(),
    selection:scenario().loyalty==='selected'?{communityId:'demplar',effectiveAt:now(),selectionType:'self'}:null,
    selectionHistory:[],selectableCommunities:roster})),
 '/api/coop/history':()=>coopEntries(),
 '/api/coop/session-history':()=>({sessions:[]}),
 '/api/coop/leaderboard':()=>({entries:[],communities:[],leaders:[]}),
 '/api/leaderboard':()=>({entries:[],communities:[],leaders:[]}),
 '/api/coop/swap-performance':()=>({ok:true,window:'24h',pairs:[],totals:{attempted:0,counted:0},routes:[]}),
 '/api/dashboard/campaign':requireFounder(()=>campaign()),
 '/api/dashboard/wheel/access':requireFounder(()=>wheelAccess()),
 '/api/dashboard/giveaways/access':requireFounder(()=>intelligenceAccess()),
 '/api/dashboard/wheel/templates':requireFounder(()=>({ok:true,templates:[],items:[],count:0})),
 '/api/dashboard/wheel/theme-assets':requireFounder(()=>({ok:true,assets:[],items:[]})),
 '/api/dashboard/wheel/drawings':requireFounder(()=>({ok:true,drawings:[
    {drawing_id:'design-wheel-001',title:'Fictional community giveaway',status:'draft',created_at:now()}],items:[]})),
 '/api/admin/operator-home':requireAdmin(()=>adminHome()),
 '/api/admin/communities':requireAdmin(()=>mockAdminCommunities()),
 '/api/admin/community':requireAdmin(adminCommunity),
 '/api/admin/community-dashboard':requireAdmin(()=>dashboard()),
 '/api/admin/community-preview':requireAdmin(()=>({...dashboard(),preview_mode:true})),
 '/api/admin/audit':requireAdmin(()=>({ok:true,events:[],rows:[],total:0})),
 '/api/admin/coop-rig-worker-state':requireAdmin(()=>({ok:true,status:scenario().coop_state,worker:{status:scenario().coop_state}})),
 '/api/admin/coop-rig-sessions':requireAdmin(()=>({ok:true,sessions:[],rows:[]})),
 '/api/admin/coop-rig-events':requireAdmin(()=>({ok:true,events:[],rows:[]})),
 '/api/admin/coop-rig-hashboost-history':requireAdmin(()=>({ok:true,items:[],rows:[]})),
 '/api/admin/coop-rig-burn-history':requireAdmin(()=>({ok:true,items:[],rows:[]})),
 '/api/admin/coop-swap-status':requireAdmin(()=>({ok:true,status:'paused',items:[]})),
 '/api/admin/community-rewards':requireAdmin(maybeEmpty),
 '/api/admin/growth-program':requireAdmin(maybeEmpty),
 '/api/admin/av-swap-revenue':requireAdmin(maybeEmpty),
 '/api/admin/connector-reward-ledger':requireAdmin(maybeEmpty),
 '/api/admin/connector-applications':requireAdmin(maybeEmpty),
 '/api/admin/connector-disassociations':requireAdmin(maybeEmpty),
 '/api/admin/connector-participants':requireAdmin(maybeEmpty),
 '/api/admin/connector-overview':requireAdmin(maybeEmpty),
 '/api/admin/revenue/conversions':requireAdmin(maybeEmpty),
 '/api/admin/revenue/claims/inventory':requireAdmin(maybeEmpty),
 '/api/admin/lp/community-pools':requireAdmin(maybeEmpty),
 '/api/admin/lp/route-requests':requireAdmin(maybeEmpty),
 '/api/admin/lp/pool-submissions':requireAdmin(maybeEmpty),
 '/api/admin/lp/dfs-vaults':requireAdmin(maybeEmpty),
 '/api/dashboard/lp/community-pools':requireFounder(maybeEmpty),
 '/api/dashboard/lp/dfs-vaults':requireFounder(maybeEmpty),
 '/api/dashboard/lp/dfs-claims':requireFounder(maybeEmpty),
 '/api/dashboard/tokens':requireFounder(()=>({ok:true,tokens:[]})),
 '/api/tokenmeta':()=>({ok:true,tokens:[],items:[],metadata:[]}),
 '/api/wheel/payer-hints':()=>({ok:true,available:false,recipients:[]}),
};
// Prefix fixtures are intentionally narrow, so unsupported routes remain visible in diagnostics.
const PREFIX=[
 ['/api/dashboard/wheel/drawings/',requireFounder(()=>({ok:true,drawing:null,status:'not_found',entries:[],results:[]}))],
 ['/api/dashboard/wheel/templates/',requireFounder(()=>({ok:true,template:null,items:[]}))],
 ['/api/dashboard/wheel/theme-assets/',requireFounder(()=>({ok:true,asset:null,items:[]}))],
 ['/api/dashboard/giveaways/',requireFounder(req=>({ok:true,access:intelligenceAccess(),scan:null,scans:[],results:[],
   count:0,pagination:{next:null},previewOnly:true}))],
 ['/api/admin/connector-applications/',requireAdmin(maybeEmpty)],
 ['/api/admin/connector-',requireAdmin(maybeEmpty)],
 ['/api/admin/lp/',requireAdmin(maybeEmpty)],
 ['/api/dashboard/lp/',requireFounder(maybeEmpty)]
];
// Harmless local-only transitions. Every write must be explicitly allowed here.
const WRITES={
 'POST /api/dashboard/logout':()=>({ok:true,_local:{role:'visitor'}}),
 'POST /api/admin/logout':()=>({ok:true,_local:{role:'visitor'}}),
 'POST /api/account/logout':()=>({ok:true,_local:{account:'not_setup'}}),
 'POST /api/rewards/session/close':()=>({ok:true,_local:{account:'not_setup'}}),
 'POST /api/coop/auth/logout':()=>({ok:true,_local:{account:'not_setup'}}),
 'POST /api/rewards/loyalty':()=>({ok:true,selection:{communityId:'demplar',effectiveAt:now()},_local:{loyalty:'selected'}}),
 'POST /api/account/coop/session':()=>({ok:true,authenticated:true,wallet:demoWallet}),
};
/* AQUAVAULTS DESIGN PREVIEW REPAIR OVERLAY v2 — injected inside mock-extension.js scope.
 * Synthetic read fixtures only. No real accounts, receipts, keys, onchain calls or API writes.
 * Existing parent mock refuses unknown API routes and all non-allowlisted writes.
 */
const repairWallet = demoWallet;
const repairTime = () => new Date().toISOString();
const demoMintSol='So11111111111111111111111111111111111111112';
const demoMintUSDC='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const repairOwner=()=>['owner','admin'].includes(scenario().role);
const repairCredit=()=>Math.max(0,Math.floor(Number(scenario().scan_credits)||0));
const repairDroplets=()=>Math.max(0,Math.min(6,Math.floor(Number(scenario().coop_droplets)||0)));
const repairFloor=()=>scenario().floor_upgrade||'none';
const repairPartner=()=>scenario().partner==='active';
const repairNftScan={scan_id:'DESIGN-NFT-001',scan_name:'Fictional NFT holders',source_type:'nft',
 source_address:demoMintSol,source_label:'Example Collection',snapshot_at:'2026-11-12T15:30:00.000Z',
 scanned_assets:24,eligible_assets:16,excluded_assets:2,burned_assets:1,eligible_wallets:12,
 entry_count:12,has_nft_details:true,has_exclusion_details:true};
const repairTokenScan={scan_id:'DESIGN-TOKEN-001',scan_name:'Fictional token holders',source_type:'token',
 source_address:demoMintUSDC,snapshot_at:'2026-11-12T15:45:00.000Z',scanned_assets:64,
 eligible_assets:0,eligible_wallets:17,entry_count:17,token_detail_count:26,
 has_nft_details:false,has_exclusion_details:false};
const repairScanRows=[
 {wallet:'DESIGN_FAKE_WALLET_ALPHA_0000000000000001'},
 {wallet:'DESIGN_FAKE_WALLET_BRAVO_0000000000000002'},
 {wallet:'DESIGN_FAKE_WALLET_CHARLIE_000000000000003'}
];
function repairHolderAccess(){
 const included=founding()||partner(); const manage=repairOwner();
 return {can_view:true,community_id:'design-demo',eligible:included,
  can_manage:manage,paid_mode:manage&&!included,
  access_tier:included?(partner()?'partner':'founding'):'listed'};
}
function repairWheelAccess(){
 const enhanced=repairPartner();return {community_id:'design-demo',tier:enhanced?'partner':'listed',
  can_view:true,can_manage:repairOwner(),max_entries:10000,retention_days:enhanced?180:30,
  partner_expires_at:enhanced?expires:null};
}
function repairWheelDrawings(req){
 const access=repairWheelAccess();
 if(req.searchParams.get('hidden')==='1')return {drawings:[],access};
 const expiry=new Date(Date.now()+access.retention_days*86400000).toISOString();
 return {access,drawings:[
  {drawing_id:'DESIGN-WHEEL-001',title:'Fictional Community Giveaway',status:'draft',entry_count:12,
   ticket_count_v2:24,record_count:12,version:1,created_at:now(),updated_at:now(),expires_at:expiry},
  {drawing_id:'DESIGN-WHEEL-002',title:'Fictional Monthly Prizes',status:'in-progress',entry_count:36,
   ticket_count_v2:36,record_count:36,version:2,created_at:now(),updated_at:now(),expires_at:expiry}
 ]};
}
const repairScanList=req=>({scans:req.searchParams.get('source')==='token'?[repairTokenScan]:[repairNftScan],next_cursor:null});
function repairScanResults(req){
 const isToken=req.searchParams.get('scan_id')==='DESIGN-TOKEN-001';
 const base=isToken?repairTokenScan:repairNftScan;
 return {...base,nft_page:0,excluded_page:0,token_page:0,wallets:repairScanRows,
  nft_rows:isToken?[]:[{number:17,name:'Example #17',mint:'DESIGN_MINT_17',wallet:repairScanRows[0].wallet,
    acquired_at:'2026-10-01T12:00:00Z'},{number:28,name:'Example #28',mint:'DESIGN_MINT_28',
    wallet:repairScanRows[1].wallet,acquired_at:'2026-09-01T12:00:00Z'}],
  token_rows:isToken?[{wallet:repairScanRows[0].wallet,balance:'1200',usd_value:'125',
    held_hours:480,held_since:'2026-10-20T12:00:00Z',qualification:'qualified'}]:[],
  excluded_rows:isToken?[]:[{number:2,name:'Example #2',mint:'DESIGN_MINT_BURN',
    wallet:'DESIGN_FAKE_WALLET_EXCLUDED',reason:'Burned'}]};
}
function repairHolderGeneric(req){
 const sub=req.pathname.replace('/api/dashboard/giveaways/','');
 switch(sub){
  case 'access':return repairHolderAccess();
  case 'collections':return {collections:[{collection_address:demoMintSol,label:'Fictional NFT Collection'}]};
  case 'scans':return repairScanList(req);
  case 'results':return repairScanResults(req);
  case 'presets':return {presets:[{preset_id:'DESIGN-PRESET-1',preset_type:'template',name:'Long-term holder filters',rules:{}}]};
  case 'token-presets':return {presets:[{preset_id:'DESIGN-TOKEN-PRESET-1',preset_type:'template',name:'$100+ holder',rules:{}}]};
  case 'token-jobs':return {jobs:[{job_id:'DESIGN-JOB-1',scan_name:'Fictional token holders',token_mint:demoMintUSDC,
   min_usd:100,min_hours:168,status:'completed',attempts:1,requested_at:repairTime(),scan_id:'DESIGN-TOKEN-001'}]};
  case 'payments/status':return {available:repairCredit(),reserved:0,checkout_enabled:false,preview_only:true};
  case 'receipts':return {receipts:[],next_cursor:null};
  case 'token-evidence':return {legacy:true,message:'Synthetic evidence preview only. No blockchain audit was run.'};
  default:return {ok:true,collections:[],scans:[],presets:[],jobs:[],receipts:[],rows:[],next_cursor:null};
 }
}
function repairCycleCatalog(){
 const old=rewardsPolicy();const ts=old.taskCatalog.tasks.map(t=>({...t}));
 const daily=[7,3,2,3,1],bonuses=[8,24,28,8],quest=[3,3,5,5,8,8,24,22];
 for(let i=0;i<ts.length;i++)ts[i].maximumPoints=i<5?daily[i]:i<9?bonuses[i-5]:quest[i-9];
 const cycleDays=new Date(new Date().getUTCFullYear(),new Date().getUTCMonth()+1,0).getDate();
 old.enrollment.acknowledgment=['Synthetic enrollment reference; no real enrollment or signature is possible.'];
 old.taskCatalog={...old.taskCatalog,taskCount:17,dailyMaximumPoints:16,fixedCyclePoints:146,
  categoryTotals:{daily:16,cycle_bonus:68,quest:78},pointSnapshotVersion:'rewards-points-v1.1',
  cycleScenarios:[28,29,30,31].map(d=>({cycleDays:d,startingMaximumPoints:16*d+146,
    eligibilityThresholdPoints:Math.ceil((16*d+146)*0.30)})),tasks:ts};
 return old;
}
function repairRewardsCycle(){
 const c=rewardsCycle(),d=c.cycleDays;const max=16*d+146;
 return {...c,state:'published',pointSnapshotVersion:'rewards-points-v1.1',startingMaximumPoints:max,
  adjustedMaximumPoints:max,eligibilityThresholdPoints:Math.ceil(max*.30),taskCount:17};
}
function repairRewardsMe(){
 const r=rewardsMe(),c=repairRewardsCycle(),p=points();
 r.cycle=c;r.points={...r.points,adjustedMaximumPoints:c.adjustedMaximumPoints,
  eligibilityThresholdPoints:c.eligibilityThresholdPoints,thresholdMet:p>=c.eligibilityThresholdPoints,
  pointsToThreshold:Math.max(0,c.eligibilityThresholdPoints-p),
  pointsToMaximum:Math.max(0,c.adjustedMaximumPoints-p)};
 r.daily.maximumPoints=16;r.daily.tasks=r.daily.tasks.map((t,i)=>({...t,maximumPoints:[7,3,2,3,1][i]}));
 return r;
}
function repairEvm(){
 const chains=[{chainId:8453,name:'Base',nativeSymbol:'ETH',explorer:'https://basescan.org'},
  {chainId:42161,name:'Arbitrum',nativeSymbol:'ETH',explorer:'https://arbiscan.io'},
  {chainId:137,name:'Polygon',nativeSymbol:'POL',explorer:'https://polygonscan.com'},
  {chainId:1,name:'Ethereum',nativeSymbol:'ETH',explorer:'https://etherscan.io'}];
 const communities=['aquavaults','pond0x','demplar','randycoin','swampai','fatmemes','pokeahoe',
  'lazypos','tazomania','derpydave','sirnasty','pissin','toez','aisocket','dnc','gorba',
  'shork','bawlsonu','ufocoin','stupidmfs','touchgrass','avtest01'];
 return {chains,communities,communitySupport:{8453:communities,137:communities.slice(0,12),
   1:communities.slice(0,12),42161:[]},bounds:{feeBps:{min:30,default:100,max:300},
   slippageBps:{min:30,default:100,max:1000}},version:1};
}
function repairApplications(req){
 const code=req.searchParams.get('code');
 return {ok:true,applicationOpen:true,referralAvailable:Boolean(code)&&
  (/^avc_[0-9a-v]{12}$/.test(code)||/^[a-z0-9_-]{2,32}$/.test(code)),
  referralCode:code||null,communityId:code||null,previewOnly:true};
}
function repairCampaignStandings(){
 // Successful idle branch reflects the observed production mode. Other states are clearly fictional.
 if(scenario().campaign_state==='idle')return {ok:true,campaign:null,upcoming:[],standings:[],eligible_roster:[]};
 return {ok:true,campaign:null,upcoming:[],standings:[],eligible_roster:[],
  message:'No public campaign is scoring right now (synthetic preview).'};
}
function repairPublicWheelResults(req){
 const rows=[{drawing_id:'DESIGN-PUBLIC-001',title:'Fictional October Drawing',
  community_id:'example-one',completed_at:'2026-10-31T18:00:00Z',state:'published'}];
 const q=(req.searchParams.get('q')||'').toLowerCase();return {results:q?rows.filter(x=>JSON.stringify(x).toLowerCase().includes(q)):rows};
}
function repairPublicWheelDetail(req){return {result:{drawing_id:'DESIGN-PUBLIC-001',completed_at:'2026-10-31T18:00:00Z',
 prize_total:2,results_hash:'DESIGN_ONLY_NO_BLOCKCHAIN_HASH',prizes:[
  {prize_no:1,outcome:'awarded',name:'Demo Winner Alpha',accepted_at:'2026-10-31T18:01:00Z'},
  {prize_no:2,outcome:'unawarded',recorded_at:'2026-10-31T18:02:00Z'}],
  state:'demo-only',part_total:0,publisher_address:null,transactions:[]}};}
function repairRigAdmin(){
 const stateName=({idle:'idle',mining:'mining',cooldown:'cooldown'})[scenario().coop_state]||'authorized';
 const status=stateName==='idle'?'authorized':stateName;
 return {ok:true,status,sessionAuthorized:status==='authorized',activeSessionId:status==='mining'?'DESIGN-RIG-SESSION':null,
  sessionSequence:465,cooldownUntil:status==='cooldown'?new Date(Date.now()+1200000).toISOString():null,
  sessionStartedAt:status==='mining'?repairTime():null,lastHeartbeatAt:repairTime(),
  liveHashrate:status==='mining'?680:0,liveUnclaimed:0,countMode:'manifest',
  countedSwapsBanked:10,requiredCountedSwaps:21,pendingBurnTokens:0,pendingBurnMinutes:0,
  nextSessionDurationMinutes:5,pendingHashboostAmount:0.01,totalSessionCount:468,
  totalClaimedSessions:411,totalHashboostSol:3.98};
}
function repairRigSessions(){return {ok:true,sessions:Array.from({length:14},(_,i)=>({sequence:468-i,
  status:i<8?'queued':i===8?'authorized':i<12?'missed':'reset',
  startedAt:i<8?null:'2026-11-01T10:00:00Z',claimedAt:null,durationMinutes:i<8?5:31,
  burnTokens:i<8?0:2,burnMinutes:i<8?0:4,hashboostAmount:i%3===0?'0.01':'0',hashboostSuccess:false}))};}
function repairRigSwap(){
 const syms=['SOL','USDC','USDT','wPOND','hSOL','PepeOnSOL'];
 return {ok:true,executor:{walletPublicKey:'DESIGN_FAKE_EXECUTOR_IDENTITY',matchesExpectedRigWallet:true},
  balances:{balances:Object.fromEntries(syms.map((s,i)=>[s,{uiAmount:i===0?1.2:1000+i*10,
     usdValue:45+i*5,floorUsd:i===0?20:10,seedUsd:20}]))},
  loop:{paused:scenario().coop_executor!=='running',rotationIndex:1,pendingManifestCheck:null},
  last:{lastRunResult:{status:'halted-balance-gate',at:repairTime()}},
  batches:Array.from({length:8},(_,i)=>({pair:i%2?'USDC_SOL':'WPOND_SOL',
    direction:i%2?'USDC->SOL':'WPOND->SOL',attempted:7,counted:1,executedAt:repairTime(),
    manifestCheckedAt:repairTime()}))};
}
function repairRigContrib(kind){return {ok:true,contributions:Array.from({length:8},(_,i)=>({
 userWallet:'DESIGN_FAKE_WALLET_'+(i+1),community:['design-demo','example-one'][i%2],
 grossAmount:'0.01',feeAmount:'0',netAmount:'0.01',burnTokens:i+1,rewardWeight:(i+1)*.5,
 createdAt:repairTime()}))};}
function repairRigEvents(){return {ok:true,events:Array.from({length:16},(_,i)=>({eventType:i%4===0?'session_queued':'executor_manifest_synced',
  sessionId:i%4===0?'DESIGN-SESSION-1':null,createdAt:repairTime(),payload:JSON.stringify({preview:true,sequence:i})}))};}
function repairGrowth(){
 const communities=mockAdminCommunities().communities;
 return {ok:true,generated_at:repairTime(),mode:{detected_mode:'routing_active',routing_enabled:true,
    program_enabled:true,program_start_date:'2026-07-01'},
  thresholds:{silver_threshold_usd:10,gold_threshold_usd:50,standard_floor_bps:5000,
    founding_floor_bps:6000,connector_floor_bps:6000},
  config:{growth_program_start_date:'2026-07-01',growth_program_enabled:true,
    growth_program_routing_enabled:true,legacy_routing_model:'legacy_80_40',
    silver_threshold_usd:10,gold_threshold_usd:50,standard_floor_bps:5000,founding_floor_bps:6000},
  qualification_summary:{base:communities.length,silver:0,gold:0,active_fee_rows:communities.length,
    zero_fee_rows:0,near_silver:1,near_gold:0},
  health:{community_program_rows:communities.length,null_updated_at:0,
    null_current_month_fee:0,tier_bps_mismatch:0,missing_month_fields:0,suspicious_issues:0},
  movement_summary:{would_increase:0,would_decrease:0,no_change:communities.length},
  transitions:{rows:[],items:[]},history:[],rows:communities};
}
function repairAdminConnector(){return {ok:true,overview:{registered:3,active:3,referred:4,
  verified:2,paid_floor_upgrades:1},stats:{registered:3,active:3},counts:{registered:3,active:3},
  sources:{connector:'available',swap:'available'},participants:[],applications:[],rewards:[],
  connector:{participants:[],registered:3,applications:[]},
  swap:{volume_lamports:'25000000000',swaps:62},rows:[],items:[]};}
function repairAdminHome(){const b=adminHome();b.totals={communities:3,no_owner:1,disabled_owner:1,
 pending_claims:0,pending_invites:0,stale_founders:1,near_tier:1,low_volume:1};
 b.attention={no_owner:[{community_id:'example-one',status:'standard',tier:'base',last_active_at:repairTime()}],
  disabled_owner:[{community_id:'example-two',status:'founding',tier:'base'}],pending_claims:[],pending_invites:[],
  stale_founders:[],near_tier:[],low_volume:[]};
 b.recent_admin_actions=[{actor:'design-operator',action:'claim_created',target:'design-demo',created_at:repairTime()}];
 return b;}
function repairAdminRewards(req){
 const drafted=scenario().rewards_cycle==='draft';const cycleKey=drafted?'2026-12':'2026-11';
 return {ok:true,cycle:{cycleKey,state:drafted?'draft':'published',participants:drafted?0:12,
  taskCount:17,startingMaximumPoints:642,eligibilityThresholdPoints:193},
  cycles:[{cycleKey:'2026-12',state:'draft',participants:0},{cycleKey:'2026-11',state:'published',participants:12}],
  readiness:{status:drafted?'blocked':'open',production_enrollment_open:!drafted},
  taskCatalog:repairCycleCatalog().taskCatalog,participants:[],roster:roster,
  review:{publication_status:drafted?'not_published':'published',startingMaximumPoints:642,
    eligibilityThresholdPoints:193,rosterCount:21,taskCount:17},
  rows:[],items:[],entries:[],total:0};
}
function repairAdminRevenue(){return {ok:true,generated_at:repairTime(),rollups_updated_at:repairTime(),
  pricing_coverage_pct:100,attribution_clean:true,windows:{d7:{totalTrackedSol:0.041,
  listingRevenueSol:0.014,communityShareSol:0.027,swaps:134},
  d30:{totalTrackedSol:0.33,listingRevenueSol:0.12,communityShareSol:0.21,swaps:510}},
  lifetime:{totalTrackedSol:4.09,listingRevenueSol:1.24,communityShareSol:2.85,swaps:23026},
  daily:[],rows:[],totals:{totalTrackedSol:4.09},coverage:{percent:100},health:{ok:true}};}
function repairTreasuryInventory(){return {ok:true,policy:{live_enabled:false},execution:{live_enabled:false},
 treasury:{native_sol_balance:'1.5',reserve_satisfied:true},counts:{eligible_assets:2,blocked_assets:1},
 assets:[{mint:demoMintUSDC,symbol:'USDC',name:'USD Coin',eligible:true,balance:'3500000',
  ui_balance:3.5,usd_value:3.5,program:'spl-token',status:'READY'},
  {mint:demoMintSol,symbol:'SOL',eligible:false,balance:'0',ui_balance:0,
   usd_value:0,program:'spl-token',status:'BLOCKED'}],treasury_operation_conflicts:{counts:{}},
  rows:[],conversions:[]};}
function repairRevenueClaims(){return {ok:true,vaults:[],protected_reserve_sol:0.25,
  treasury:{native_sol_balance:1.5},totals:{},rows:[]};}
// Display-only LP sample pools. These are fictional, not executable on Meteora.
const repairLpPools=[
 {poolAddress:'DESIGN_POOL_SOL_USDC_ALPHA',communityId:'design-demo',displayLabel:'Example SOL / USDC official pool',
  founderNote:'Synthetic community example — not a real pool',primary:true,supportStatus:'supported',
  badges:{officialCommunityPool:true,primaryPool:true,founderCreated:false,aquaVaultsSupported:true},
  poolIdentity:{tokenAMint:demoMintSol,tokenBMint:demoMintUSDC,collectFeeMode:0}},
 {poolAddress:'DESIGN_POOL_USDC_SOL_BETA',communityId:'example-one',displayLabel:'Example Token B fees pool',
  founderNote:'Synthetic routing example — not a real pool',primary:false,supportStatus:'pending_aquavaults_review',
  badges:{officialCommunityPool:true,primaryPool:false,founderCreated:false,aquaVaultsSupported:false},
  poolIdentity:{tokenAMint:demoMintUSDC,tokenBMint:demoMintSol,collectFeeMode:1}},
 {poolAddress:'DESIGN_POOL_COMPOUND_GAMMA',communityId:'example-two',displayLabel:'Example compounding pool',
  founderNote:'Fictional compounding example',primary:true,supportStatus:'supported',
  badges:{officialCommunityPool:true,primaryPool:true,founderCreated:false,aquaVaultsSupported:true},
  poolIdentity:{tokenAMint:demoMintSol,tokenBMint:demoMintUSDC,collectFeeMode:2}}
];
function repairLpSearch(req){
 const q=(req.searchParams.get('query')||'').trim().toLowerCase();
 const pools=repairLpPools.filter(p=>!q||[p.poolAddress,p.communityId,p.displayLabel,'sol','usdc'].some(x=>x.toLowerCase().includes(q)))
  .map((p,i)=>({...p,meteora:{address:p.poolAddress,poolConfig:{collectFeeMode:p.poolIdentity.collectFeeMode,compoundingFeePct:5},
    tokenX:{symbol:i===1?'USDC':'SOL',mint:p.poolIdentity.tokenAMint},
    tokenY:{symbol:i===1?'SOL':'USDC',mint:p.poolIdentity.tokenBMint},
    tvl:20000+i*5000,volume:{h24:3400+i*300},fees:{h24:18+i*3}},
    overlay:{communityId:p.communityId,poolAddress:p.poolAddress},defaultSupportBps:1000,
    requestEligibility:{eligible:false,label:'Design example only',reason:'Synthetic pool; no real routing possible'}}));
 return {ok:true,cluster:'mainnet',mode:req.searchParams.get('mode')||'routing',pools,source:'design-only'};
}
function repairLpCommunityPools(req){
 const filter=req.searchParams.get('community');
 return {ok:true,cluster:'mainnet',communityId:filter||null,
  pools:repairLpPools.filter(p=>!filter||p.communityId===filter),source:'synthetic-design-only',
  note:'These fictional pool identities do not exist on chain. No liquidity operations are available.'};
}
function repairLpCapability(){return {ok:true,ready:false,actions:{create_position:{allowed:false},
  add_liquidity:{allowed:false},remove_liquidity:{allowed:false}},reason:'DESIGN_ONLY_NO_TRANSACTIONS'};}

const repairReadFixtures={
 '/api/lp/community-pools':req=>repairLpCommunityPools(req),
 '/api/lp/search':req=>repairLpSearch(req),
 '/api/lp/positions':()=>({ok:true,positions:[],source:'synthetic-design-only'}),
 '/api/lp/liquidity/capability':()=>repairLpCapability(),
 '/api/lp/liquidity/remove/capability':()=>repairLpCapability(),
 '/api/lp/claim-fund/history':()=>({ok:true,claims:[],source:'synthetic-design-only'}),
 '/api/dashboard/giveaways/access':requireFounder(()=>repairHolderAccess()),
 '/api/dashboard/community-connect':requireFounder(()=>scenario().community_connector==='hidden'
   ? {ok:true,communityId:'preview-hidden-panel'} : communityConnect()),
 '/api/coop/me':requireAccount(()=>({ok:true,authenticated:scenario().coop_participation==='open',
   wallet:scenario().coop_participation==='open'?demoWallet:null,
   usageToday:{tokenUsage:{limit:6,totalUsed:repairDroplets(),remaining:6-repairDroplets(),
     countSwapsUsed:repairDroplets(),burnTokensUsed:0},hashboostUsage:{totalUsed:0,limit:3,remaining:3}},
   rewards:{cycle:{active:true},totals:{totalRewardWeight:repairDroplets()},allTimeSummary:{},todaySummary:{}}})),
 '/api/dashboard/wheel/access':requireFounder(()=>({access:repairWheelAccess()})),
 '/api/dashboard/wheel/drawings':requireFounder(req=>repairWheelDrawings(req)),
 '/api/rewards/policy':()=>repairCycleCatalog(),
 '/api/rewards/cycle':()=>({ok:true,cycle:repairRewardsCycle(),roster,tasks:repairCycleCatalog().taskCatalog.tasks}),
 '/api/rewards/me':requireAccount(()=>repairRewardsMe()),
 '/api/evm/config':()=>repairEvm(),
 '/api/connector/referral':req=>repairApplications(req),
 '/api/community-connect/referral':req=>repairApplications(req),
 '/api/campaign/standings':()=>repairCampaignStandings(),
 '/api/wheel/results':req=>repairPublicWheelResults(req),
 '/api/admin/operator-home':requireAdmin(()=>repairAdminHome()),
 '/api/admin/growth-program':requireAdmin(()=>repairGrowth()),
 '/api/admin/community-rewards':requireAdmin(()=>({ok:true,rewards:[],scheduled:[],history:[],rows:[],items:[]})),
 '/api/admin/coop-rig-worker-state':requireAdmin(()=>repairRigAdmin()),
 '/api/admin/coop-rig-sessions':requireAdmin(()=>repairRigSessions()),
 '/api/admin/coop-swap-status':requireAdmin(()=>repairRigSwap()),
 '/api/admin/coop-rig-hashboost-history':requireAdmin(()=>repairRigContrib('hashboost')),
 '/api/admin/coop-rig-burn-history':requireAdmin(()=>repairRigContrib('burn')),
 '/api/admin/coop-rig-events':requireAdmin(()=>repairRigEvents()),
 '/api/admin/connector-overview':requireAdmin(()=>repairAdminConnector()),
 '/api/admin/me':()=>admin()?{username:'Design Operator',role:'super_admin'}:{error:'AUTH_REQUIRED',_status:401},
 '/api/admin/connector-participants':requireAdmin(()=>({...repairAdminConnector(),participants:[],rows:[]})),
 '/api/admin/connector-reward-ledger':requireAdmin(()=>({...repairAdminConnector(),rewards:[],rows:[]})),
 '/api/admin/connector-applications':requireAdmin(()=>({ok:true,applications:[{application_id:'DESIGN-APP-1',community_name:'Fictional Listed Community',
  status:'submitted',submitted_at:repairTime(),source:'direct'}],rows:[],count:1})),
 '/api/admin/connector-disassociations':requireAdmin(()=>({ok:true,requests:[],items:[],rows:[]})),
 '/api/admin/community-connect':requireAdmin(()=>({ok:true,connections:[],applications:[],items:[],rows:[]})),
 '/api/admin/access':requireAdmin(()=>({ok:true,users:[],claims:[],invites:[],sessions:[],rows:[]})),
 '/api/admin/audit':requireAdmin(()=>({ok:true,events:[{actor:'design-operator',action:'claim_created',
   target:'design-demo',reason:'Fictional demonstration',created_at:repairTime()}],rows:[],total:1})),
 '/api/admin/revenue/conversions/inventory':requireAdmin(()=>repairTreasuryInventory()),
 '/api/admin/revenue/conversions':requireAdmin(()=>({ok:true,conversions:[],history:[],rows:[],items:[]})),
 '/api/admin/revenue/claims/inventory':requireAdmin(()=>repairRevenueClaims()),
 '/api/admin/av-swap-revenue':requireAdmin(()=>repairAdminRevenue()),
 '/api/admin/rewards/launch':requireAdmin(req=>repairAdminRewards(req)),
 '/api/admin/rewards/review':requireAdmin(req=>repairAdminRewards(req)),
 '/api/admin/rewards/cycle':requireAdmin(req=>repairAdminRewards(req)),
 '/api/admin/rewards/distribution':requireAdmin(req=>repairAdminRewards(req)),
 '/api/admin/rewards/finalization':requireAdmin(req=>repairAdminRewards(req)),
 '/api/admin/campaigns':requireAdmin(()=>({ok:true,campaigns:[],history:[],items:[],rows:[]})),
 '/api/dashboard/connector-upgrade/status':requireFounder(()=>repairFloor()==='none'
   ? {ok:true,status:'eligible',eligibility:'eligible',checkout_enabled:false}
   : {ok:true,status:'verified',floor_status:repairFloor()==='purchased_pending'?'scheduled':'active',
      checkout_enabled:false,paid_at:'2026-11-14T12:00:00Z',
      floor_effective_at:'2026-12-01T00:00:00Z',
      floor_applied_at:repairFloor()==='active'?'2026-12-01T02:00:00Z':null}),
 '/api/program/recent-swaps':requireFounder(()=>({ok:true,swaps:[],items:[],rows:[],hasMore:false})),
 '/api/dashboard/lp/community-pools':requireFounder(()=>({ok:true,pools:[],rows:[],items:[]})),
 '/api/dashboard/lp/dfs-vaults':requireFounder(()=>({ok:true,vaults:[],rows:[],items:[]})),
 '/api/dashboard/lp/dfs-claims':requireFounder(()=>({ok:true,claims:[],rows:[],items:[]}))
};
Object.assign(GET,repairReadFixtures);
// Narrow prefix handling; the existing parent stub still refuses any unreviewed request.
PREFIX.unshift(
 ['/api/dashboard/giveaways/',requireFounder(req=>repairHolderGeneric(req))],
 ['/api/dashboard/wheel/drawings/',requireFounder(req=>({ok:true,
   drawing:repairWheelDrawings(req).drawings[0],entries:[],official:null,results:[]}))],
 ['/api/wheel/results/',req=>repairPublicWheelDetail(req)]
);
// Only read-only JSON-RPC methods; no broadcast, simulate-send, signing or transactions.
WRITES['POST /api/rpc']=function(_req,opts){
 let body={};try{body=JSON.parse(opts?.body||'{}');}catch(_){return {_status:400,error:'INVALID_JSON'};}
 if(Array.isArray(body))return {_status:501,error:'DESIGN_RPC_BATCH_DISABLED'};
 const method=body.method,id=body.id??1;
 const results={getBalance:{context:{slot:123456789},value:4500000000},
  getTokenAccountsByOwner:{context:{slot:123456789},value:[]},
  getLatestBlockhash:{context:{slot:123456789},value:{blockhash:'DESIGN_NO_VALID_BLOCKHASH',lastValidBlockHeight:0}},
  getMinimumBalanceForRentExemption:2039280};
 if(!Object.prototype.hasOwnProperty.call(results,method))return {_status:501,ok:false,
  error:'DESIGN_RPC_METHOD_BLOCKED',method};
 return {jsonrpc:'2.0',id,result:results[method]};
};
window.AquaVaultsDesignRepair={version:'coordinated-v2',getReadPaths:()=>Object.keys(repairReadFixtures),
 holderAccess:repairHolderAccess,wheelAccess:repairWheelAccess,adminRig:repairRigAdmin};

/* AQUAVAULTS STAGE 4 CONTRACT OVERLAY — synthetic data only, no live writes. */
function stage4CommunityId(){
 const profile=scenario().preview_profile;
 return profile==='avtest01'?'avtest01':profile==='pond0x'?'pond0x':'design-demo';
}
const stage4Now='2026-11-18T19:00:00.000Z';
const stage4Rows=[
 {id:'DESIGN-USER-OWNER',username:'fictional-owner',role:'owner',disabled:0,is_self:true,
  created_at:'2026-10-05T00:00:00Z',last_login_at:stage4Now,last_active_at:stage4Now},
 {id:'DESIGN-USER-MEMBER',username:'fictional-member',role:'member',disabled:0,is_self:false,
  created_at:'2026-10-09T00:00:00Z',last_login_at:'2026-11-17T11:00:00Z',last_active_at:'2026-11-17T11:00:00Z'}
];
function stage4Team(){return {
 ok:true,community_id:stage4CommunityId(),users:stage4Rows,
 pending_invites:[{id:'DESIGN-NONREDEEMABLE-HASH',role:'member',created_at:'2026-11-17T00:00:00Z',
   expires_at:'2026-11-24T00:00:00Z',invited_by:'fictional-owner'}]
};}
GET['/api/dashboard/team']=requireFounder(()=>repairOwner()?stage4Team():{_status:403,ok:false,error:'Owner only'});
const stage4PriorDashboard=GET['/api/program/dashboard'];
GET['/api/program/dashboard']=requireFounder(req=>{
 const d=stage4PriorDashboard(req);
 if(d.ok===false||!d.found)return d;
 d.community_id=stage4CommunityId();
 if(d.standing&&scenario().preview_profile==='avtest01'){
  d.standing.share_bps=5000;d.standing.share_pct=50;d.standing.durable_share_bps=5000;
  d.standing.durable_share_pct=50;d.standing.min_share_bps=5000;
  d.standing.partner_active=false;d.standing.partner_dashboard_active=false;
 }
 return d;
});
GET['/api/dashboard/giveaways/access']=requireFounder(()=>({...repairHolderAccess(),community_id:stage4CommunityId()}));
GET['/api/dashboard/wheel/access']=requireFounder(()=>({access:{...repairWheelAccess(),community_id:stage4CommunityId()}}));
GET['/api/dashboard/wheel/drawings']=requireFounder(req=>{
 const d=repairWheelDrawings(req);d.access.community_id=stage4CommunityId();
 d.drawings.forEach(x=>{x.community_id=stage4CommunityId();
  const ref=stage4SavedDrawings[x.drawing_id];if(ref){x.entry_count=ref.entries.length;
  x.ticket_count_v2=ref.entries.length;x.record_count=ref.entries.length;}});return d;
});
GET['/api/dashboard/community-connect']=requireFounder(()=>{
 if(scenario().community_connector==='hidden')return {ok:true,communityId:'preview-hidden-panel'};
 return {...communityConnect(),communityId:stage4CommunityId(),code:stage4CommunityId(),
  link:location.origin+'/apply?connector='+encodeURIComponent(stage4CommunityId())};
});
// Match the completed Token job to an existing retained result, independently of tab initialization order.
const stage4PriorGiveaways=PREFIX.find(row=>row[0]==='/api/dashboard/giveaways/');
if(!stage4PriorGiveaways)throw Error('Missing reviewed Holder fixture prefix');
stage4PriorGiveaways[1]=requireFounder(req=>{
 const d=repairHolderGeneric(req);
 if(req.pathname.endsWith('/scans')){
  const source=req.searchParams.get('source');
  d.scans=source==='token'?[repairTokenScan]:source==='nft'?[repairNftScan]:[repairNftScan,repairTokenScan];
 }
 if(req.pathname.endsWith('/token-jobs'))d.jobs[0].scan_id=repairTokenScan.scan_id;
 return d;
});
const stage4SavedDrawings={
 'DESIGN-WHEEL-001':{title:'Fictional Community Giveaway',status:'draft',version:1,
  entries:Array.from({length:12},(_,i)=>'Demo participant '+String(i+1).padStart(2,'0')),prize_total:1,
  settings:{theme:'slate',spin_ms:10000,entry_grouping:'entry',drawing_mode:'fixed',onchain_results:false}},
 'DESIGN-WHEEL-002':{title:'Fictional Monthly Prizes',status:'in-progress',version:2,
  entries:Array.from({length:36},(_,i)=>'Demo participant '+String(i+1).padStart(2,'0')),prize_total:2,
  settings:{theme:'abyss',spin_ms:12000,entry_grouping:'entry',drawing_mode:'fixed',onchain_results:false}}
};
function stage4WheelDetail(req,lifecycle){
 const id=decodeURIComponent(req.pathname.split('/').filter(Boolean).at(-1));
 const entry=stage4SavedDrawings[id];
 if(!entry)return {_status:404,ok:false,error:'DESIGN_DRAWING_NOT_FOUND'};
 const base={drawing_id:id,community_id:stage4CommunityId(),title:entry.title,status:entry.status,
  version:entry.version,entry_count:entry.entries.length,record_count:entry.entries.length,
  entries:entry.entries.slice(),settings:JSON.parse(JSON.stringify(entry.settings)),
  created_at:'2026-11-09T00:00:00Z',updated_at:stage4Now,
  expires_at:new Date(Date.now()+repairWheelAccess().retention_days*86400000).toISOString()};
 if(!lifecycle)return {ok:true,drawing:base,verified_brand:null};
 return {ok:true,drawing:{...base,prize_total:entry.prize_total,drawing_mode:entry.settings.drawing_mode,
  has_eligible_entries:entry.status==='in-progress',pending_spin_no:null,
  spins:[],prizes:[],results:[],completed_at:null}};
}
// Explicit lifecycle and draft detail contracts; no official start/spin write is provided.
PREFIX.unshift(
 ['/api/dashboard/wheel/lifecycle/',requireFounder(req=>stage4WheelDetail(req,true))],
 ['/api/dashboard/wheel/drawings/',requireFounder(req=>stage4WheelDetail(req,false))]
);
// Existing GET handlers use a named reference cycle; do not allow the leaderboard to exceed it.
GET['/api/rewards/leaderboard']=()=>({ok:true,totalParticipants:3,entries:[
 {rank:1,tieSize:1,wallet:'DESIGN-WALLET-ALPHA',points:432,thresholdMet:true},
 {rank:2,tieSize:1,wallet:'DESIGN-WALLET-BRAVO',points:320,thresholdMet:true},
 {rank:3,tieSize:1,wallet:'DESIGN-WALLET-CHARLIE',points:96,thresholdMet:false}
]});
const stage4OriginalMe=GET['/api/rewards/me'];
GET['/api/rewards/me']=requireAccount(req=>{
 const d=stage4OriginalMe(req);if(!d?.points)return d;
 const cap=Number(d.cycle?.adjustedMaximumPoints)||642;
 d.points.verifiedPoints=Math.min(cap,Number(d.points.verifiedPoints)||0);
 d.points.pointsToMaximum=Math.max(0,cap-d.points.verifiedPoints);
 d.points.thresholdMet=d.points.verifiedPoints>=(d.cycle?.eligibilityThresholdPoints||193);
 return d;
});
const stage4CommunityRows=()=>mockAdminCommunities().communities;
GET['/api/admin/operator-home']=requireAdmin(()=>{
 const list=stage4CommunityRows();const pendingClaims=list.reduce((n,x)=>n+(x.pending_claim_count||0),0);
 const pendingInvites=list.reduce((n,x)=>n+(x.pending_invite_count||0),0);
 return {ok:true,program_started:true,program_start:'2026-07-01',
 totals:{communities:list.length,no_owner:list.filter(x=>x.owner_count===0).length,disabled_owner:0,
  pending_claims:pendingClaims,pending_invites:pendingInvites,stale_founders:0,near_tier:1,low_volume:1},
 attention:{no_owner:[],disabled_owner:[],pending_claims:pendingClaims?[{community_id:'example-one',
   status:'standard',tier:'silver',pending_claim_count:pendingClaims}]:[],
  pending_invites:pendingInvites?[{community_id:'design-demo',status:'standard',tier:'base',pending_invite_count:pendingInvites}]:[],
  stale_founders:[],near_tier:[{community_id:'design-demo',tier:'base'}],low_volume:[{community_id:'example-one',tier:'silver'}]},
 recent_admin_actions:[{actor:'design-operator',action:'claim_created',target:'design-demo',created_at:stage4Now}],
 recent_grant_activity:[],quick_links:[{label:'Communities',hash:'#/communities'},
  {label:'Growth Program',hash:'#/growth'},{label:'Co-Op Rig',hash:'#/coop-rig'}]};
});
GET['/api/volume/stats/global-sol']=()=>({ok:true,totals:{swaps:825,volume_sol:540,platform_fees_sol:5.4},
 d7:{swaps:136,volume_sol:81,platform_fees_sol:0.81},d30:{swaps:510,volume_sol:330,platform_fees_sol:3.3},
 window:'d30',generated_at:stage4Now,preview_only:true});
GET['/api/admin/growth-program']=requireAdmin(()=>{
 const d=repairGrowth(),c=stage4CommunityRows();
 d.qualification_summary={base_count:1,silver_count:1,gold_count:1,
  active_current_month_fee_count:3,zero_current_month_fee_count:0,
  near_silver_count:1,near_gold_count:0};
 d.mode={detected_mode:'routing_active',program_enabled:true,routing_enabled:true,
  program_start_date:'2026-07-01'};
 d.thresholds={silver_threshold_usd:10,gold_threshold_usd:50,config_matches_active:true};
 d.config={program_enabled:{value:'true',source:'database'},routing_enabled:{value:'true',source:'database'},
  silver_threshold_usd:{value:'10',source:'database'},gold_threshold_usd:{value:'50',source:'database'},
  standard_floor_bps:{value:'5000',source:'database'},founding_floor_bps:{value:'6000',source:'database'}};
 d.health={community_program_rows:c.length,newest_program_update:stage4Now,
  oldest_program_update:'2026-11-11T11:00:00Z',stale_rows:0,null_updated_rows:0,null_fee_rows:0,
  negative_fee_rows:0,share_below_floor_rows:0,share_invariant_mismatch_rows:0,
  tier_bps_mismatch_rows:0,missing_month_rows:0,suspicious_rows:0};
 d.movement_summary={increase:1,decrease:0,no_change:2};
 d.transitions={base_to_silver:1,silver_to_gold:0,down_from_gold:0,down_to_floor:0};
 d.near_thresholds=[{community_id:'design-demo',next_threshold:'Silver',
  current_month_fee_usd:9.4,fees_to_next_usd:0.6}];
 d.suspicious_rows=[];
 d.recent_tier_history=[{community_id:'example-one',qualification_month:'2026-10',
  active_month:'2026-11',tier:'silver',min_share_bps:5000,effective_share_bps:6500,
  created_at:'2026-11-01T02:00:00Z'}];
 return d;
});
const stage4ConnectorSource={connector:'available',swap:'available',evidence:'available',account:'not_checked'};
GET['/api/admin/connector-participants']=requireAdmin(req=>({ok:true,generatedAt:stage4Now,
 participants:[{connectorId:'DESIGN-CONNECTOR-01',code:'avc_demoalpha01',type:'external',status:'active',
  walletMasked:'DESIGN…OWNER',applicationsTotal:2,approvedApplications:1,liveListings:1,
  verifiedUpgrades:1,adminPayoutHold:false,permanentRewardHalt:false}],
 total:1,limit:Number(req.searchParams.get('limit')||25),offset:Number(req.searchParams.get('offset')||0),
 sources:stage4ConnectorSource,rewards:{status:'not_implemented'}}));
PREFIX.unshift(['/api/admin/connector-participants/',requireAdmin(req=>({ok:true,
 participant:{connectorId:'DESIGN-CONNECTOR-01',code:'avc_demoalpha01',type:'external',status:'active',
  createdAt:'2026-11-01T00:00:00Z',walletMasked:'DESIGN…OWNER',rewardWalletMasked:'DESIGN…REWARDS',
  newReferralsEnabled:true,adminPayoutHold:false,permanentRewardHalt:false,applicationsTotal:2,
  approvedApplications:1,historicalLinks:1,liveListings:1,verifiedUpgrades:1,evidenceStatus:'consistent'},
 accountProjection:{status:'active'},
 applications:{rows:[{applicationId:'DESIGN-APP-1',projectName:'Fictional Project',status:'approved',
  relationshipState:'verified_live',communityId:'example-one',submittedAt:stage4Now}],total:1,limit:25,offset:0},
 links:{rows:[],total:0,limit:25,offset:0},disassociations:{rows:[],total:0,limit:25,offset:0},
 sources:stage4ConnectorSource,rewards:{status:'not_implemented'}}))]);
GET['/api/admin/connector-rewards']=requireAdmin(req=>({ok:true,total:1,sources:stage4ConnectorSource,
 receipts:[{communityId:'example-one',paidAt:'2026-11-14T10:00:00Z',
  receivedUsdcBaseUnits:'20000000',connectorCode:'avc_demoalpha01',
  reviewState:'external_evidence_verified_policy_unchecked',floorStatus:'scheduled',
  paymentSignature:null,firstClaimMatches:true,verifiedLinkMatches:true,
  floorEffectiveAt:'2026-12-01T00:00:00Z',adminPayoutHold:false,
  permanentRewardHalt:false,rewardWalletMasked:'DESIGN…REWARDS'}]}));
GET['/api/admin/connector-reward-ledger']=requireAdmin(req=>({ok:true,generatedAt:stage4Now,
 ledgerStatus:'available',total:0,limit:Number(req.searchParams.get('limit')||25),
 offset:Number(req.searchParams.get('offset')||0),
 accounting:{awards:0,prepared:0,finalized:0,openAwardValueBaseUnits:'0',
  approvedValueBaseUnits:'0',finalizedValueBaseUnits:'0'},awards:[],
 operations:{awardApproval:'disabled',payoutPreparation:'disabled',payoutSubmission:'disabled',
  settlementRecording:'disabled'},notice:'Fictional preview only. No real awards, payouts, or wallet transfers.'}));
// Draft/published/finalized Admin Rewards contracts follow the UI's view= endpoint.
function stage4CycleState(key){return key==='2026-12'?'draft':key==='2026-10'?'finalized':'published';}
function stage4Cycle(key){
 const d=key==='2026-12'?31:key==='2026-10'?31:30;
 const state=stage4CycleState(key);const max=16*d+146;
 return {cycleKey:key,state,startsAt:key+'-01T00:00:00Z',
  endsAt:(key==='2026-10'?'2026-11-01':key==='2026-11'?'2026-12-01':'2027-01-01')+'T00:00:00Z',
  cycleDays:d,rulesVersion:'1.1',consentVersion:'1.1',pointSnapshotVersion:'rewards-points-v1.1',
  eligibilityThresholdPoints:Math.ceil(max*.3),startingMaximumPoints:max,
  adjustedMaximumPoints:max,rosterCount:4,taskCount:17,
  ...(state==='finalized'?{finalizedAt:'2026-11-02T03:00:00Z',finalParticipantCount:3,
   finalEligibleCount:2,finalEligiblePoints:610,finalTopThreeBoundaryTies:0}:{})};
}
function stage4AdminRewards(req){
 const view=req.searchParams.get('view')||'cycles';
 const selected=req.searchParams.get('cycle')||'2026-11';
 const cycle=stage4Cycle(selected);
 const participants=[{wallet:'DESIGN-WALLET-ALPHA',accountId:'DESIGN-ACCT-01',status:'active',
  points:320,thresholdMet:true,provisionalRank:1,eventCount:26,pendingEvents:0,heldEvents:0,
  lastEventAt:stage4Now},{wallet:'DESIGN-WALLET-BRAVO',accountId:'DESIGN-ACCT-02',status:'active',
  points:290,thresholdMet:true,provisionalRank:2,eventCount:21,pendingEvents:0,heldEvents:0,
  lastEventAt:stage4Now}];
 if(view==='cycles')return {ok:true,cycles:['2026-12','2026-11','2026-10'].map(k=>({
  ...stage4Cycle(k),participantAccounts:k==='2026-12'?0:3}))};
 if(view==='cycle')return {ok:true,overview:{cycle,
  counts:{participantAccounts:cycle.state==='draft'?0:3,enrolledAccounts:3,accountsWithPoints:2,
   netPoints:cycle.state==='draft'?0:610,ledgerEntries:cycle.state==='draft'?0:47},
  readiness:{canEnterReconciliation:false,canFinalize:false},
  roster:cycle.state==='draft'?[]:roster.map((x,i)=>({...x,rosterOrder:i})),
  tasks:repairCycleCatalog().taskCatalog.tasks}};
 if(view==='enrollments')return {ok:true,totalEnrolled:3,total:3,limit:50,offset:0,
  enrollments:['ALPHA','BRAVO','CHARLIE'].map((name,i)=>({
   wallet:'DESIGN-WALLET-'+name,accountId:'DESIGN-ACCT-0'+(i+1),status:'active',
   enrolledAt:'2026-09-03T00:00:00Z',createdAt:'2026-09-03T00:00:00Z'}))};
 if(view==='participants')return {ok:true,total:participants.length,limit:50,offset:0,participants};
 if(view==='participant')return {ok:true,participant:{account:{accountId:req.searchParams.get('account'),
   wallet:'DESIGN-WALLET-ALPHA',status:'active',walletHash:'DESIGN-HASH-NONREDEEMABLE',
   enrolledAt:'2026-09-03T00:00:00Z'},points:{verifiedPoints:320,
   eligibilityThresholdPoints:cycle.eligibilityThresholdPoints,thresholdMet:true},
   ledger:[],events:[],checks:[],holds:[]}};
 return {ok:true,cycles:[]};
}
GET['/api/admin/rewards/review']=requireAdmin(req=>stage4AdminRewards(req));
PREFIX.unshift(['/api/admin/rewards/cycle/preview',requireAdmin(req=>({ok:true,
 cycle:stage4Cycle(req.searchParams.get('cycle')||'2026-12'),
 preview:{cycle:stage4Cycle(req.searchParams.get('cycle')||'2026-12'),
  taskCount:17,rosterCount:4,startingMaximumPoints:642,eligibilityThresholdPoints:193},
 publication:{ready:false,reason:'Fictional draft; no real publishing enabled'},
 roster:roster.map((x,i)=>({...x,rosterOrder:i})),
 tasks:repairCycleCatalog().taskCatalog.tasks,
 errors:[],warnings:[],taskCatalog:repairCycleCatalog().taskCatalog}))]);
// POST is used by production for a status READ. Permit only that inert status action; never preview/freeze/pay.
WRITES['POST /api/admin/rewards/distribution']=function(_req,opts){
 let payload={};try{payload=JSON.parse(opts?.body||'{}')}catch(_){return {_status:400,error:'INVALID_JSON'}}
 if(payload.action!=='status')return {_status:501,ok:false,error:'DESIGN_FINANCIAL_ACTION_BLOCKED'};
 return {ok:true,status:{cycle:stage4Cycle(payload.cycleKey||'2026-10'),manifest:null,
  reconciliation:null,previewOnly:true}};
};
window.AquaVaultsDesignRepair={...window.AquaVaultsDesignRepair,version:'coordinated-v2',stage4Version:'stage4-v3',
 stage4Community:stage4CommunityId,stage4SavedDrawings:()=>Object.keys(stage4SavedDrawings)};

/* AQUAVAULTS DESIGN VISUAL PARITY PATCH v5 — mock responses to EXISTING production renderers.
 * Does not create or restyle HTML, CSS, or JS components. No real API, wallet, or write calls.
 */
const stage5PublicRows = [
 ['pond0x',1273.45],['demplar',1120.1],['randycoin',985.2],['swampai',875.6],
 ['fatmemes',811.7],['pokeahoe',723.95],['lazypos',620.42],['tazomania',551.18],
 ['derpydave',480.05],['sirnasty',455.8],['pissin',420.26],['toez',392.17],
 ['aisocket',352.9],['dnc',310.2],['gorba',287.47],['shork',241.2],
 ['bawlsonu',193.66],['ufocoin',151.15],['stupidmfs',98.3],['touchgrass',74.8]
];
const stage5Lamports = sol => String(Math.round(sol * 1_000_000_000));
const stage5PlatformSol = 178.64;
const stage5GlobalSol = stage5PublicRows.reduce((n,row)=>n+row[1],stage5PlatformSol);
const stage5GlobalLamports = String(BigInt(stage5Lamports(stage5PlatformSol))+
 stage5PublicRows.reduce((n,row)=>n+BigInt(stage5Lamports(row[1])),0n));
GET['/api/volume/stats/global-sol'] = () => ({
 solMint:demoMintSol,solLamportsTotal:stage5GlobalLamports,updatedAt:stage4Now
});
GET['/api/volume/stats/leaderboard-sol'] = () => ({
 updatedAt:stage4Now,
 leaderboard:stage5PublicRows.map(([communityId,sol],i)=>({
  rank:i+1,communityId,totalSolLamports:stage5Lamports(sol),topTokens:[]
 })),
 platform:{communityId:'aquavaults',totalSolLamports:stage5Lamports(stage5PlatformSol)}
});
const stage5Badge = (key,label,group,priority) => ({key,label,group,priority,tone:key});
GET['/api/program/public-badges'] = () => ({generated_at:stage4Now,
 badges_by_community:{
  demplar:[stage5Badge('founding','Founding Community','status',10)],
  pond0x:[stage5Badge('partner','Partner Subscription','subscription',20)],
  pissin:[stage5Badge('gold','Gold','tier',30)],
  pokeahoe:[stage5Badge('silver','Silver','tier',31)],
  derpydave:[stage5Badge('silver','Silver','tier',31)],
  shork:[stage5Badge('early_growth','Early Growth Community','status',11)]
 }});
// Existing production Connector checklist expects pageCounts.{due,needsReview,paid,held}.
// These are separate fictional checklist statuses, NOT actual rewards owed to Connectors.
GET['/api/admin/connector-manual-rewards']=requireAdmin(req=>{
 const offset=Math.max(0,Number(req.searchParams.get('offset'))||0);
 const limit=Math.min(50,Math.max(1,Number(req.searchParams.get('limit'))||25));
 const items=[
  {communityId:'example-one',connectorCode:'avc_demoalpha01',paymentId:'DESIGN-RECEIPT-01',
   status:'needs_review',rewardWalletMasked:'DESIGN…REWARDS'},
  {communityId:'example-two',connectorCode:'avc_demobravo02',awardId:'DESIGN-AWARD-02',
   status:'due',amountBaseUnits:'20000000',sequence:22,rewardWalletMasked:'DESIGN…REWARDS',
   expiresAt:'2026-12-15T00:00:00Z'},
  {communityId:'design-demo',connectorCode:'avc_democharlie03',awardId:'DESIGN-AWARD-03',
   status:'paid',amountBaseUnits:'20000000',sequence:23,rewardWalletMasked:'DESIGN…REWARDS'},
  {communityId:'example-one',connectorCode:'avc_demadelta04',awardId:'DESIGN-AWARD-04',
   status:'on_hold',rewardWalletMasked:'DESIGN…REWARDS'}
 ];
 const page=items.slice(offset,offset+limit);
 const number=status=>page.filter(x=>x.status===status).length;
 return {ok:true,ledgerReady:true,total:items.length,limit,offset,items:page,
  pageCounts:{due:number('due'),needsReview:number('needs_review'),paid:number('paid'),held:number('on_hold')}};
});
// Keep the original Admin Communities table and Growth/HOME fixtures coherent.
const stage5PriorAdminCommunities=mockAdminCommunities;
mockAdminCommunities=function(){
 const out=stage5PriorAdminCommunities();
 out.communities=out.communities.map(row=>{
  if(row.community_id==='design-demo')return {...row,tier:'base',share_bps:5000,current_month_fee_usd:9.4};
  if(row.community_id==='example-one')return {...row,tier:'base',share_bps:5000,current_month_fee_usd:16};
  if(row.community_id==='example-two')return {...row,tier:'gold',share_bps:7500,current_month_fee_usd:65};
  return row;
 });
 return out;
};
const stage5PriorGrowth=GET['/api/admin/growth-program'];
GET['/api/admin/growth-program']=requireAdmin(req=>{
 const d=stage5PriorGrowth(req);
 d.qualification_summary={base_count:1,silver_count:1,gold_count:1,
  active_current_month_fee_count:3,zero_current_month_fee_count:0,
  near_silver_count:1,near_gold_count:0};
 d.near_thresholds=[{community_id:'design-demo',tier:'base',current_month_fee_usd:9.4,
  next_threshold:'Silver',fees_to_next_usd:.6,progress_pct:94}];
 d.health={...d.health,oldest_program_update:'2026-11-18T18:00:00Z',
  newest_program_update:stage4Now,stale_rows:0};
 d.activation_preview_changed=1;
 d.activation_preview=[
  {community_id:'design-demo',status:'standard',tier:'base',badges:[],current_active_tier:'base',
   current_share_bps:5000,floor_bps:5000,current_month_fee_usd:9.4,qualifying_tier:'base',
   preview_share_bps:5000,delta_bps:0,movement:'no_change',reason:'Below Silver threshold'},
  {community_id:'example-one',status:'standard',tier:'base',badges:[],current_active_tier:'base',
   current_share_bps:5000,floor_bps:5000,current_month_fee_usd:16,qualifying_tier:'silver',
   preview_share_bps:6500,delta_bps:1500,movement:'increase',reason:'Qualified for Silver next month'},
  {community_id:'example-two',status:'founding',tier:'gold',badges:[],current_active_tier:'gold',
   current_share_bps:7500,floor_bps:6000,current_month_fee_usd:65,qualifying_tier:'gold',
   preview_share_bps:7500,delta_bps:0,movement:'no_change',reason:'Gold maintained'}
 ];
 d.movement_summary={increase:1,decrease:0,no_change:2};
 d.transitions={base_to_silver:1,silver_to_gold:0,down_from_gold:0,down_to_floor:0};
 return d;
});
const stage5PriorOperator=GET['/api/admin/operator-home'];
GET['/api/admin/operator-home']=requireAdmin(req=>{
 const d=stage5PriorOperator(req);
 d.attention.near_tier=[{community_id:'design-demo',tier:'base',status:'standard',badges:[],
  current_month_fee_usd:'9.40',next_threshold:'Silver',fees_to_next_usd:'0.60',progress_pct:94}];
 d.attention.low_volume=[{community_id:'design-demo',tier:'base',status:'standard',
  swaps_30d:4,last_user_activity:'2026-11-18T18:00:00Z',badges:[]}];
 return d;
});
window.AquaVaultsDesignRepair={...window.AquaVaultsDesignRepair,stage5Version:'stage5-visual-parity-v1'};

const parentFetch=window.fetch.bind(window);
const misses=new Map();
function lookup(request,opts){
  const url=new URL(request instanceof Request?request.url:String(request),location.href);
  if(url.origin!==location.origin) return null; // phase-one mock rejects external fetch
  const path=url.pathname.replace(/\/$/,'')||'/';
  if(path!=='/api'&&!path.startsWith('/api/'))return null;
  const method=String(opts?.method||(request instanceof Request?request.method:'GET')).toUpperCase();
  const handler=method==='GET'?(GET[path]||PREFIX.find(([prefix])=>path.startsWith(prefix))?.[1]):WRITES[method+' '+path];
  if(!handler) return null;
  try{
    const data=handler(url,opts);
    const status=data._status||200;
    const local=data._local;
    delete data._status;delete data._local;
    if(local){try{const saved=JSON.parse(localStorage.getItem(key)||'{}');
      localStorage.setItem(key,JSON.stringify({...saved,...local}));}catch(_){}}
    return Promise.resolve(respond(data,status));
  }catch(err){console.error('[Design Preview fixture error]',path,err);
    return Promise.resolve(respond({ok:false,error:'LOCAL_FIXTURE_ERROR',path},500));}
}
window.fetch=function(input,opts){
  const response=lookup(input,opts);
  return response||parentFetch(input,opts);
};
// Safety: prevent accidental navigation to any production site or external checkout.
// A first-party absolute AquaVaults link is converted to localhost; all other
// external destinations are disabled for this UI-only sandbox.
document.addEventListener('click',function(event){
  const anchor=event.target?.closest?.('a[href]');if(!anchor)return;
  const href=anchor.getAttribute('href')||'';
  if(!href||href[0]==='#'||/^(mailto:|tel:|javascript:)/i.test(href)) {
    if(/^javascript:/i.test(href)){event.preventDefault();event.stopImmediatePropagation();}
    return;
  }
  let u;try{u=new URL(anchor.href,location.href);}catch(_){return;}
  if(u.origin===location.origin)return;
  if(['aquavaults.com','www.aquavaults.com'].includes(u.hostname)){
    event.preventDefault();event.stopImmediatePropagation();location.assign(u.pathname+u.search+u.hash);return;
  }
  event.preventDefault();event.stopImmediatePropagation();
  console.info('[Design Preview] external navigation blocked:',u.origin);
  window.dispatchEvent(new CustomEvent('av-design-external-blocked',{detail:{url:u.origin}}));
},true);
// Prevent third-party outbound form submissions (even if the page created one dynamically).
document.addEventListener('submit',function(event){
  const form=event.target;if(!form?.action)return;
  const url=new URL(form.action,location.href);
  if(url.origin!==location.origin || form.method.toUpperCase()!=='GET'){
    event.preventDefault();event.stopImmediatePropagation();
    window.dispatchEvent(new CustomEvent('av-design-form-blocked',{detail:{path:url.pathname}}));
  }
},true);
// All mock data and wallet states exist in this ephemeral preview environment.
window.AquaVaultsDesignMockFull={getFixturePaths:()=>Object.keys(GET),version:'full-local-v1'};
})();
