/* AQUAVAULTS REDESIGN MOCK RUNTIME — local preview only, never production. */
(function () {
  'use strict';
  if (!/^(?!(?:[a-z0-9-]+\.)*aquavaults\.com$)(?!(?:[a-z0-9-]+\.)*aquavaults-com\.pages\.dev$)(?!(?:[a-z0-9-]+\.)*aquavaults\.pages\.dev$)[a-z0-9.-]+$/.test(location.hostname)) {
    throw new Error('AquaVaults design mocks refuse unauthorized host');
  }
  const KEY = 'av-design-preview-v1';
  const DEMO_WALLET = '9nAM57vViGc4hmfgHAkCzZu8HTUwbcvhBgfuS1eK5Chm'; // Non-signing test identity only.
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const month = now.getUTCFullYear() + '-' + pad(now.getUTCMonth() + 1);
  const first = month + '-01T00:00:00.000Z';
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
  const day = now.toISOString().slice(0, 10);
  const EXPIRES = '2099-01-01T00:00:00Z';
  const defaults = {
    wallet: 'connected', account: 'setup', community_type: 'founding',
    partner: 'active', role: 'owner', connector: 'linked', points: 320,
    coop_state: 'mining', coop_droplets: 3, dashboard_view: 'dashboard'
  };
  function scenario() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) {}
    const merged=Object.assign({}, defaults, saved);
    merged.coop_droplets=Math.max(0,Math.min(6,Number(merged.coop_droplets)||0));
    return merged;
  }
  const state = scenario();
  const connected = () => scenario().wallet === 'connected';
  const hasAccount = () => scenario().account === 'setup'; // Account cookie persists independently of wallet connection.
  const hasFounder = () => scenario().role === 'owner' || scenario().role === 'member' || scenario().role === 'admin';
  const mockPublicKey = Object.freeze({ toBase58: () => DEMO_WALLET, toString: () => DEMO_WALLET });
  const fakeWallet = Object.freeze({
    get connected() { return connected(); },
    get publicKeyString() { return connected() ? DEMO_WALLET : null; },
    get publicKey() { return connected() ? mockPublicKey : null; },
    getWalletAddress() { return connected() ? DEMO_WALLET : null; },
    async connect() { window.AquaVaultsDesignPreview?.setState({wallet:'connected'}); return {publicKey:mockPublicKey}; },
    async disconnect() { window.AquaVaultsDesignPreview?.setState({wallet:'disconnected'}); },
    async signTransaction() { throw Error('Disabled: design preview cannot sign transactions'); },
    async signAllTransactions() { throw Error('Disabled: design preview cannot sign transactions'); },
    async signMessage() { throw Error('Disabled: design preview cannot sign messages'); },
    async sendTransaction() { throw Error('Disabled: design preview cannot send transactions'); },
    async signAndSendTransaction() { throw Error('Disabled: design preview cannot send transactions'); },
    on() {}, off() {}, removeListener() {}
  });
  // Mask this platform's wallet singleton for Account/Rewards/Connector UI.
  // A wallet extension may operate outside this JS realm; use a clean browser profile.
  try {
    Object.defineProperty(window, 'AquaVaultsWallet', {
      configurable: false, enumerable: true, get: () => fakeWallet, set: () => {}
    });
  } catch (error) { console.warn('[Design mock] Wallet singleton could not be masked', error); }

  const roster = [
    {communityId:'aquavaults',communityName:'AquaVaults',rosterOrder:1,status:'active'},
    {communityId:'demplar',communityName:'Knights Demplar',rosterOrder:2,status:'active'},
    {communityId:'touchgrass',communityName:'Touch Grass',rosterOrder:3,status:'active'}
  ];
  const taskList = [
    {taskId:'daily_qualifying_swaps', label:'Qualifying Swaps',title:'Qualifying Swaps',category:'daily',maximumPoints:7,points:7},
    {taskId:'daily_coop_participation', label:'Co-Op participation',title:'Co-Op participation',category:'daily',maximumPoints:2,points:2},
    {taskId:'cycle_product_explorer',label:'Product Explorer',title:'Product Explorer',category:'cycle_bonus',maximumPoints:5,points:5},
  ];
  function qualified() { return Math.max(0,Number(scenario().points)||0)>=300; }
  function isFounding() { return scenario().community_type==='founding'; }
  function isPartner() { return scenario().partner==='active'; }
  function entitlement() {
    const paid=isPartner(), founding=isFounding(), full=paid||founding;
    return {isFounding:founding,isPaid:paid,dataTier:full?'full':'free',
      retentionMonths:paid?12:founding?6:3,betaAccess:founding,kAnonymityFloor:5,
      features:{earnings:true,projectedTier:true,trend:true,newReturningBasic:true,
        successRate:true,topTokens:true,tokenHeroBasic:true,deeplinkSplit:true,
        coopSummary:true,benchmarkRank:true,usdEverywhere:full,cohorts:full,
        retention:full,heatmap:full,tokenFlowDeep:full,attribution:full,
        campaignRoi:full,coopNamed:full,benchmarkFull:full,alerts:full,
        liveFeed:full,perSwapFeed:full,csvExport:full},
      perks:{revenueBoost:paid,exclusiveCampaigns:paid}};
  }
  function dashboardData(tour=false) {
    const st=scenario(), partner=isPartner(), founding=isFounding(), full=partner||founding;
    const floor=(st.floor_upgrade==='active')?6000:(founding||st.community_type==='early_growth'?6000:5000);
    const share=Math.min(10000,floor+(partner?1000:0));
    const recent=st.points>0;
    const profit = recent ? Math.floor(1800000000 * share / 10000) : 0;
    const samples=recent?[
      {mint:'So11111111111111111111111111111111111111112',swaps:64,swaps_prev_7d:39,direction:'up',share_pct:61.5},
      {mint:'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',swaps:40,swaps_prev_7d:45,direction:'down',share_pct:38.5}
    ]:[];
    const baseFees={volume_lamports:recent?180000000000:0,fees_lamports:recent?1800000000:0,
      community_fees_lamports:recent?profit:0,community_fee_coverage_pct:97.2};
    const trend=Array.from({length:30},(_,i)=>{
      const d=new Date(Date.now()-(29-i)*86400000).toISOString().slice(0,10);
      const swaps=recent?6+(i*7)%17:0;
      return {date:d,swaps,active_wallets:swaps-2,volume_lamports:swaps*180000000,fees_lamports:swaps*1800000};
    });
    const emptyTokens={items:recent?samples:[],coverage_pct:recent?94:0};
    const activeMonth={month,swaps:recent?412:0,distinct_wallets:recent?83:0,
      new_wallets:recent?41:0,returning_wallets:recent?42:0,wallet_coverage_pct:96,
      volume_lamports:recent?350000000000:0,fees_lamports:recent?3500000000:0,
      community_fees_lamports:recent?Math.floor(3500000000*share/10000):0,
      community_fee_coverage_pct:98,fee_usd:recent?525:0};
    const tt={d7:emptyTokens,d30:emptyTokens};
    const src=recent?{single:120,autoswap:66,flipflop:30,evm:40,sdk:56}:{};
    const attrItems=recent?[{key:'demo-campaign',swaps:42,distinct_wallets:18,
      volume_lamports:12000000000,fee_total_lamports:120000000}]:[];
    return {preview_mode:tour,found:true,community_id:'design-demo',updated_at:now.toISOString(),
      entitlements:entitlement(),sol_usd:150,
      standing:{status:founding?'founding':st.community_type==='early_growth'?'early_growth':'standard',
        tier:'base',share_bps:share,share_pct:share/100,durable_share_bps:share,
        durable_share_pct:share/100,min_share_bps:floor,tier_bps:floor,
        partner_active:partner,partner_dashboard_active:partner,
        partner_effective_at:partner?first:null,partner_expires_at:partner?'2099-01-01T00:00:00Z':null,
        reward_active:false,reward_effect_bps:0,reward_conflict:false,reward_unavailable:false,
        reward:null,founding:founding?1:0,badges:[
          ...(founding?[{key:'founding',label:'Founding',tone:'founding'}]:[]),
          ...(partner?[{key:'partner',label:'Partner',tone:'partner'}]:[]),
        ],last_fee_usd_30d:recent?380:0,current_month_fee_usd:recent?525:0,
        qualification_month:month,active_month:month,next_tier:'silver',fees_to_next_usd:250,
        progress_to_next_pct:67,recent_movement:null},
      growthProgram:{model:'calendar_month',program_start:'2026-07-01',current_month_fee_usd:recent?525:0,
        qualification_month:month,active_month:month,current_month_qualifying_tier:'base',
        next_threshold:'silver',fees_to_next_threshold_usd:250,progress_to_next_threshold_pct:67,notes:[]},
      earnings:{lifetime:{volume_lamports:'4580000000000',fees_lamports:'45800000000',
        community_fees_lamports:String(Math.floor(45800000000*share/10000))},d7:baseFees,
        d30:{...baseFees,volume_lamports:recent?920000000000:0,fees_lamports:recent?9200000000:0,community_fees_lamports:recent?Math.floor(9200000000*share/10000):0}},
      activity:{d7:{swaps:recent?76:0,distinct_wallets:recent?24:0,active_wallets:recent?24:0,
        volume_lamports:recent?180000000000:0,success_rate_pct:96},
        d30:{swaps:recent?412:0,distinct_wallets:recent?83:0,active_wallets:recent?83:0,
        volume_lamports:recent?920000000000:0,success_rate_pct:97}},
      drivers:{by_source:{d7:src,d30:src},top_tokens:tt},trend,
      coop:{cycle_number:3,cycle_start:first,cycle_end:end,points:st.coop_droplets*1.5,
        contributors:recent?19:0,entries:st.coop_droplets,swap_weight:st.coop_droplets,
        burn_weight:0,boost_weight:st.coop_droplets/2,cycle_rank:4,has_activity:st.coop_droplets>0},
      benchmark:{total_communities:24,rank_volume:7,rank_fees:6,rank_coop:4,
        pct_volume:74,pct_fees:78,pct_coop:86},
      months:{this_month:activeMonth,last_month:{...activeMonth,month:'2026-10',fee_usd:330}},
      history:recent?[{qualification_month:'2026-10',active_month:month,tier:'base',tier_bps:floor,
        min_share_bps:floor,effective_share_bps:share,fee_usd:330}]:[],
      attribution:full?{referrer:{d7:attrItems,d30:attrItems},campaign:{d7:attrItems,d30:attrItems},
        integration_origin:{d7:attrItems,d30:attrItems}}:null,
      hero_tokens:full&&recent?[{token_id:'demo-sol',chain:'solana',label:'SOL',
        flow:{d7:{buys:34,sells:12,net_swaps:22,buy_vol_lamports:34000000000,sell_vol_lamports:12000000000,buy_pressure_pct:74,
          unique_buyers:12,unique_sellers:7,wallet_coverage_pct:92},
          d30:{buys:98,sells:65,net_swaps:33,buy_vol_lamports:98000000000,sell_vol_lamports:65000000000,buy_pressure_pct:60,
          unique_buyers:35,unique_sellers:27,wallet_coverage_pct:95}}}]:[],
      next_action:'Design-only sample data. Explore the tabs and responsive layouts; no production actions are available.'};
  }
  function cycleInfo(){return{cycleKey:month,state:'active',startsAt:first,endsAt:end,cycleDays:30,
    rulesVersion:'1.1',consentVersion:'1.1',pointSnapshotVersion:'1',startingMaximumPoints:1000,
    adjustedMaximumPoints:1000,eligibilityBps:3000,eligibilityThresholdPoints:300,
    rosterSnapshotSha256:'demo-only',taskSnapshotSha256:'demo-only',rosterCount:roster.length,
    taskCount:taskList.length,publishedAt:first};}
  function rewardsMe(){const pts=Math.max(0,Number(scenario().points)||0), thresh=300;
    return{ok:true,authenticated:true,account:{wallet:DEMO_WALLET,walletDisplay:'DESIGN…DEMO',status:'active'},
      cycle:cycleInfo(),points:{verifiedPoints:pts,adjustedMaximumPoints:1000,eligibilityThresholdPoints:thresh,
        pointsToThreshold:Math.max(0,thresh-pts),pointsToMaximum:Math.max(0,1000-pts),
        thresholdMet:pts>=thresh,eligibilityStatus:pts>=thresh?'qualified_provisional':'not_yet_qualified',
        progressBps:Math.max(0,Math.min(10000,pts*10))},
      daily:{utcDay:day,maximumPoints:3,pointsEarned:pts?2:0,tasks:taskList.filter(x=>x.category==='daily').map(x=>({
        ...x,complete:pts>0,displayedPoints:pts>0?x.points:0,progress:{current:pts>0?1:0,required:1}}))},
      cycleBonuses:{maximumPoints:5,pointsEarned:pts>60?5:0,
        pendingCandidateCount:0,pendingCandidatePoints:0,tasks:taskList.filter(x=>x.category==='cycle_bonus').map(x=>({
          ...x,complete:pts>60,displayedPoints:pts>60?5:0}))},
      quest:{maximumPoints:15,pointsEarned:0,awardedThroughSequence:0,evidenceReadyThroughSequence:0,tasks:[]},
      productExplorer:{requiredDistinctSurfaces:3,distinctSurfaces:pts>60?3:1,
        surfaces:['manual_swap'],pointsEarned:pts>60?5:0,complete:pts>60},
      loyalty:{selection:null,selectionHistory:[]},roster,
      rosterSummary:{active:roster.length,waived:0,total:roster.length}};
  }
  function coopStatus(){const st=scenario(); const active=st.coop_state==='mining';
    return{rigId:'design-rig',rigWallet:DEMO_WALLET,status:active?'active':st.coop_state,
      countMode:'tokens',modeNotice:null,countedSwaps:Math.min(18,Number(st.coop_droplets)||0),countedSwapsTarget:18,
      boostsEarned:Math.floor((Number(st.coop_droplets)||0)/6),boostsRequired:3,sessionReady:st.coop_droplets>=18,
      queuedSessions:0,manifestSwaps:0,manifestBxSwaps:0,manifestFetchError:null,
      activeSessionId:active?'design-session-001':null,cooldownRemaining:st.coop_state==='cooldown'?950:0,
      currentDuration:active?22:0,nextDuration:22,pendingBurnMin:0,pendingHashboost:0,
      hashboostBucket:{id:'demo-bucket',status:'open',dropletsCommitted:st.coop_droplets%6,
        dropletsTarget:6},sessionAuthorized:false,sessionSequence:3,
      sessionQueueVersion:0,pendingBurnTokens:0,baseSessionMinutes:22,
      effectiveNextSessionMinutes:22,hashboostHandledThisSession:false,
      cooldownUntil:st.coop_state==='cooldown'?new Date(Date.now()+950000).toISOString():null,
      sessionStartedAt:active?new Date(Date.now()-300000).toISOString():null,
      activeSessionDurationMinutes:active?22:null,lastHeartbeatAt:now.toISOString(),
      liveHashrate:active?183:0,liveUnclaimed:active?'0.042':null,liveTelemetryAt:now.toISOString(),
      totalSessionCount:18,totalClaimedSessions:17,totalHashboostSol:0.24,totalClaimedAmount:1.43};
  }
  function coopMe(){const droplets=Math.max(0,Number(scenario().coop_droplets)||0),
    unit={totalAmount:droplets,totalRewardWeight:droplets,totalEntryCount:Math.ceil(droplets/6),
      countSwapsAmount:droplets,burnTokensAmount:0,countSwapsEntryCount:Math.ceil(droplets/6),burnTokensEntryCount:0},
    boost={totalAmount:Math.floor(droplets/6),totalRewardWeight:1.5*Math.floor(droplets/6),
      totalEntryCount:Math.floor(droplets/6),hashboostAmount:Math.floor(droplets/6),hashboostEntryCount:Math.floor(droplets/6)},
    totals={totalAmount:unit.totalAmount+boost.totalAmount,totalRewardWeight:unit.totalRewardWeight+boost.totalRewardWeight,
      totalEntryCount:unit.totalEntryCount+boost.totalEntryCount,swapBucket:unit,hashboostBucket:boost},
    summary={swapBucket:{...unit,communityBreakdown:[]},hashboostBucket:{...boost,communityBreakdown:[]}};
    return{authenticated:hasAccount(),wallet:hasAccount()?DEMO_WALLET:null,expiresAt:EXPIRES,
      usageToday:{dayKey:day,tokenUsage:{totalUsed:droplets,remaining:Math.max(0,6-droplets),limit:6,countSwapsUsed:droplets,burnTokensUsed:0},
        hashboostUsage:{totalUsed:Math.floor(droplets/6),remaining:Math.max(0,3-Math.floor(droplets/6)),limit:3}},
      hashboostWindow:{queueMode:false,state:'legacy',windowSessionSequence:null,openedAfterSessionId:null,conflictCount:0},
      hashboostBucket:{id:'demo-bucket',status:'open',dropletsCommitted:droplets%6,dropletsTarget:6,
        userDroplets:Math.min(2,droplets%6),userDailyDroplets:Math.floor(droplets/6)},
      rewards:{cycle:{active:true,cycleStartKey:first.slice(0,10),cycleEndKey:end.slice(0,10)},
        cycleIntegrity:{eligible:true},cycleTotals:totals,cycleSummary:summary,totals,
        allTimeSummary:summary,todaySummary:summary}};
  }
  function connectorStatus(){const st=scenario();const registered=st.connector!=='not_linked';
    const linked=['linked','listing_approved'].includes(st.connector);
    const code='design-connector';
    return registered ? {ok:true,registered:true,accountSync:'active',registrationEnabled:true,
      applicationRouteAvailable:true,earnings:{status:'not_implemented'},
      connector:{code,rewardWallet:DEMO_WALLET,status:'active',newReferralsEnabled:true,
        adminPayoutHold:false,permanentRewardHalt:false,haltedAt:null,
        linkedCommunities:linked?[{communityId:'design-community',source:'routing_verified',
          activatedAt:first,disassociated:false,boostStatus:'not_purchased',
          volumeLamports:'25000000000',firstMilestoneLamports:'50000000000'}]:[],
        createdAt:first,referredApplications:[{applicationId:'demo-001',communityName:'Example Community',
          status:st.connector==='listing_pending'?'under_review':'approved',submittedAt:first,
          progress:st.connector==='listing_pending'?'under_review':st.connector==='listing_approved'?'listed_live':'approved_pending_listing'}]}}:
      {ok:true,registered:false,registrationEnabled:true};
  }
  function accountSession(){return hasAccount()?{ok:true,authenticated:true,
    account:{wallet:DEMO_WALLET},session:{expiresAt:EXPIRES},
    onboarding:{status:'complete',features:{rewards:'active',coop:'active',connector:'active'}}}:
    {ok:true,authenticated:false};}
  function accountActivity(){return{ok:true,programs:{rewards:{status:hasAccount()?'active':'not_activated',
    cycle:cycleInfo(),points:rewardsMe().points,recentEvents:scenario().points>0?[{label:'Example eligible swap',
      netPoints:2,occurredAt:now.toISOString()}]:[]},
    coop:{status:'active',currentCycle:{rewardWeight:scenario().coop_droplets*1.5},
      cycleIntegrity:{eligible:true},recentContributions:scenario().coop_droplets>0?[{
        action:'Count swaps',amount:scenario().coop_droplets,community:'design-demo',rewardWeight:scenario().coop_droplets}]:[]},
    connector:{status:scenario().connector==='not_linked'?'not_activated':'active',earnings:{status:'not_implemented'}}}};}
  const apiGet = {
    '/api/account/session':()=>accountSession(),
    '/api/account/activity':()=>accountActivity(),
    '/api/dashboard/me':()=>hasFounder()?{community_id:'design-demo',username:'Design Preview',
      role:scenario().role==='admin'?'owner':scenario().role}:{error:'AUTH_REQUIRED',_status:401},
    '/api/program/dashboard':()=>hasFounder()?dashboardData(false):{error:'AUTH_REQUIRED',_status:401},
    '/api/dashboard/community-connect':()=>hasFounder()?{ok:true,communityId:'design-demo',code:'design-demo',
      link:'http://127.0.0.1:8788/connect?code=design-demo',treasuryWallet:DEMO_WALLET,
      totalApplications:scenario().connector==='not_linked'?0:5,pendingApplications:1,
      approvedApplications:3,verifiedConnections:scenario().connector==='listing_approved'?2:0,
      recent:[{applicationId:'demo-01',applicationStatus:'approved',submittedAt:first,
        communityId:'example-one',verified:scenario().connector==='listing_approved'}]}:
      {ok:false,error:'AUTH_REQUIRED',_status:401},
    '/api/connector/status':()=>hasAccount()?connectorStatus():{ok:false,error:'ACCOUNT_SESSION_REQUIRED',_status:401},
    '/api/rewards/session':()=>hasAccount()?{ok:true,authenticated:true,unifiedAccountLogin:true,
      account:{accountId:'design-account',wallet:DEMO_WALLET,status:'active'},
      session:{sessionId:'demo-session',openedAt:first,lastAuthenticatedAt:now.toISOString(),expiresAt:EXPIRES,
        source:'account',accountLinked:true}}:{ok:false,authenticated:false,unifiedAccountLogin:true,
          error:'Rewards session is not authenticated',code:'SESSION_REQUIRED',_status:401},
    '/api/rewards/me':()=>hasAccount()?rewardsMe():{ok:false,authenticated:false,error:'SESSION_REQUIRED',_status:401},
    '/api/rewards/cycle':()=>({ok:true,cycle:cycleInfo(),roster,tasks:taskList}),
    '/api/rewards/policy':()=>({ok:true,enrollment:{open:true,mode:'production',productionOpen:true,
      localEnrollment:false,rulesVersion:'1.1',consentVersion:'1.1',heading:'Rewards',acknowledgment:['Preview only — no real enrollment or points are awarded.']},
      rules:{version:'1.1',consentVersion:'1.1',url:'/rewards/rules',summary:[
        'Synthetic design preview data — no rewards are accrued.',
        'Qualifying swaps, daily participation, and monthly cycles are illustrated for layout review.'
      ],limitOrdersIncluded:false,permanentWallet:true,distributionAsset:'USDC',participantClaimRequired:false},
      taskCatalog:{pointSnapshotVersion:'1',dailyMaximumPoints:14,fixedCyclePoints:130,
        taskCount:taskList.length,eligibilityPercent:30,categoryTotals:{daily:9,cycle_bonus:5,quest:0},
        cycleScenarios:[{cycleDays:30,startingMaximumPoints:1000,eligibilityThresholdPoints:300}],
        tasks:taskList.map(t=>({...t,summary:'Preview-only demonstration task.',
          requirements:['This is not a live point-earning activity.']}))}}),
    '/api/rewards/leaderboard':()=>({ok:true,cycle:cycleInfo(),totalParticipants:27,
      standingsStatus:'provisional',entries:[{rank:1,wallet:'DEMO…0001',points:845,thresholdMet:true,tieSize:1},
        {rank:2,wallet:'DEMO…0002',points:600,thresholdMet:true,tieSize:1},
        {rank:3,wallet:'DESIGN…DEMO',points:Math.max(0,Number(scenario().points)||0),
          thresholdMet:qualified(),tieSize:1}]}),
    '/api/rewards/loyalty':()=>({ok:true,cycle:cycleInfo(),selection:null,selectionHistory:[],selectableCommunities:roster}),
    '/api/rewards/history':()=>({ok:true,cycle:cycleInfo(),events:[],points:[],limit:25}),
    '/api/rewards/pending-activity':()=>({ok:true,cycle:cycleInfo(),events:[],pending:[],summary:{}}),
    '/api/rewards/enrollment-eligibility':()=>({ok:true,eligible:true,
      enrollment:{open:true,mode:'production',publicationCleared:true}}),
    '/api/coop/status':()=>coopStatus(),
    '/api/coop/me':()=>hasAccount()?coopMe():{authenticated:false},
    '/api/coop/auth/whoami':()=>hasAccount()?{authenticated:true,wallet:DEMO_WALLET,expiresAt:EXPIRES}:{authenticated:false},
    '/api/coop/history':()=>({history:[],items:[]}),
    '/api/coop/session-history':()=>({sessions:[]}),
    '/api/coop/leaderboard':()=>({entries:[],communities:[]}),
    '/api/leaderboard':()=>({entries:[],communities:[]}),
    '/api/admin/me':()=>scenario().role==='admin'?{username:'Design Admin',role:'admin'}:{error:'AUTH_REQUIRED',_status:401},
    '/api/dashboard/tokens':()=>({ok:true,tokens:[]}),
    '/api/dashboard/wheel/access':()=>({access:{tier:isPartner()?'partner':'listed',canCreate:scenario().role==='owner'},tooling_available:false}),
    '/api/dashboard/giveaways/access':()=>({ok:true,access:{canExecute:scenario().role==='owner'&&(isFounding()||isPartner())}}),
  };
  const apiWrites = {
    '/api/rewards/enrollment-eligibility':()=>({ok:true,eligible:true,
      enrollment:{open:true,mode:'production',publicationCleared:true}}),
  };
  const errors = new Map();
  function jsonResponse(payload,status) {
    const body = Object.assign({},payload);
    const code = status || body._status || 200;
    delete body._status;
    return new Response(JSON.stringify(body),{status:code,headers:{'Content-Type':'application/json','X-AV-Design-Mock':'1'}});
  }
  function simulate(input, options) {
    let request;
    try {
      const url = input instanceof Request ? input.url : String(input);
      request = new URL(url, location.href);
    } catch (_) { return null; }
    if (request.origin !== location.origin) {
      // External fetches are also blocked by the localhost server's CSP.
      return Promise.resolve(jsonResponse({ok:false,error:'External network access disabled in design preview'},403));
    }
    if (request.pathname !== '/api' && !request.pathname.startsWith('/api/')) return null;
    const method = String(options?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const path = request.pathname.replace(/\/$/,'');
    const handler = method==='GET'?apiGet[path]:apiWrites[path];
    if (!handler) {
      const key=method+' '+path; errors.set(key,(errors.get(key)||0)+1);
      window.dispatchEvent(new CustomEvent('av-design-unmocked-api',{detail:{method,path}}));
      return Promise.resolve(jsonResponse({ok:false,error:'DESIGN_MOCK_NOT_IMPLEMENTED',code:'DESIGN_MOCK_NOT_IMPLEMENTED',
        method,path,message:'This design-only interaction has not been mocked. No live request was made.'},501));
    }
    try {return Promise.resolve(jsonResponse(handler(request,options)));}
    catch(err){console.warn('[AV design mock]',path,err);return Promise.resolve(jsonResponse({ok:false,error:'MOCK_FIXTURE_ERROR'},500));}
  }
  const nativeFetch = window.fetch.bind(window);
  window.fetch=function(input,options){
    const mocked=simulate(input,options);return mocked===null?nativeFetch(input,options):mocked;
  };
  const isTour = location.pathname.startsWith('/portal/dashboard') && scenario().dashboard_view==='tour';
  if (isTour) {
    window.__AV_EMBED=true;
    document.addEventListener('DOMContentLoaded',()=>{
      if (window.AVCommandCenter?.render) window.AVCommandCenter.render(dashboardData(true),{preview:true});
      else console.warn('[Design mock] Command Center demo renderer not available');
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    window.dispatchEvent(new CustomEvent('walletStateChanged',{
      detail:{connected:connected(),address:connected()?DEMO_WALLET:null,provider:'DESIGN_ONLY'}}));
  });
  window.addEventListener('av-design-state-change',()=>location.reload());
  window.AquaVaultsDesignMock={
    getUnmocked:()=>Array.from(errors,([route,count])=>({route,count})),
    getScenario:scenario,makeDashboardFixture:dashboardData,
    fixturePaths:()=>Object.keys(apiGet).sort(),
    version:'phase1'
  };
})();
