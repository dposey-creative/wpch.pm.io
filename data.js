export let projects = [
  {id:1,name:'Maple Ridge Residence',client:'Henderson Family',status:'active',phase:'Framing & Rough-In',progress:42,pm:'Mike W.',addr:'412 Maple Ridge Dr, Sanford, FL',end:'2025-09-15',ctype:'costplus',budget:520000,markup:15,
   cats:{mat:180000,lab:140000,sub:120000,fee:30000,oth:50000}},
  {id:2,name:'Thornwood Custom Build',client:'Thornwood Estates LLC',status:'active',phase:'Foundation & Slab',progress:18,pm:'Sarah K.',addr:'88 Thornwood Ln, Lake Mary, FL',end:'2025-12-20',ctype:'costplus',budget:680000,markup:12,
   cats:{mat:220000,lab:180000,sub:160000,fee:50000,oth:70000}},
  {id:3,name:'Lakeside Retreat',client:'Okafor Family',status:'review',phase:'Final Inspections',progress:91,pm:'James R.',addr:'1200 Lakeview Blvd, Sanford, FL',end:'2025-05-30',ctype:'fixed',budget:410000,markup:0,
   cats:{mat:130000,lab:110000,sub:100000,fee:30000,oth:40000}},
  {id:4,name:'Cedar Grove Spec Home',client:'In-House Spec',status:'planning',phase:'Pre-Construction',progress:5,pm:'Dana L.',addr:'33 Cedar Grove Ct, Deltona, FL',end:'2026-03-01',ctype:'fixed',budget:395000,markup:0,
   cats:{mat:130000,lab:110000,sub:90000,fee:30000,oth:35000}},
  {id:5,name:'Summit View Estate',client:'Patel Family',status:'active',phase:'Drywall & Insulation',progress:65,pm:'Mike W.',addr:'7 Summit Pkwy, Heathrow, FL',end:'2025-08-15',ctype:'gmp',budget:740000,markup:10,
   cats:{mat:240000,lab:200000,sub:180000,fee:60000,oth:60000}},
  {id:6,name:'Riverside Bungalow',client:'Torres Family',status:'hold',phase:'Permitting',progress:12,pm:'Carlos M.',addr:'508 Riverside Rd, Longwood, FL',end:'2025-10-10',ctype:'costplus',budget:330000,markup:18,
   cats:{mat:110000,lab:90000,sub:80000,fee:25000,oth:25000}},
];

export let tasks = {
  1:[
    {id:1,title:'Order framing lumber — delivery confirm',assignee:'Mike W.',due:'2025-05-14',priority:'high',done:false},
    {id:2,title:'Schedule city framing inspection',assignee:'Sarah K.',due:'2025-05-16',priority:'high',done:false},
    {id:3,title:'Rough-in plumbing walkthrough with sub',assignee:'James R.',due:'2025-05-18',priority:'med',done:false},
    {id:4,title:'Verify HVAC duct routing plan',assignee:'Mike W.',due:'2025-05-20',priority:'med',done:true},
    {id:5,title:'Submit RFI to architect on window sizes',assignee:'Dana L.',due:'2025-05-12',priority:'low',done:true},
  ],
  2:[
    {id:6,title:'Confirm concrete pour date with supplier',assignee:'Sarah K.',due:'2025-05-15',priority:'high',done:false},
    {id:7,title:'Install rebar per structural drawings',assignee:'Carlos M.',due:'2025-05-17',priority:'high',done:false},
    {id:8,title:'Soil compaction report review',assignee:'James R.',due:'2025-05-13',priority:'med',done:true},
  ],
  3:[
    {id:9,title:'Schedule CO inspection',assignee:'James R.',due:'2025-05-12',priority:'high',done:false},
    {id:10,title:'Punch list walkthrough with client',assignee:'James R.',due:'2025-05-14',priority:'high',done:false},
    {id:11,title:'Final cleaning & touch-up',assignee:'Linda P.',due:'2025-05-16',priority:'med',done:false},
  ],
  4:[
    {id:12,title:'Submit permit application',assignee:'Dana L.',due:'2025-06-05',priority:'med',done:false},
    {id:13,title:'Finalize site plan with civil engineer',assignee:'Dana L.',due:'2025-05-28',priority:'med',done:false},
  ],
  5:[
    {id:14,title:'Drywall delivery — stage materials',assignee:'Tom B.',due:'2025-05-15',priority:'high',done:false},
    {id:15,title:'Install blown-in insulation',assignee:'Carlos M.',due:'2025-05-18',priority:'med',done:true},
  ],
  6:[{id:16,title:'Follow up with county on permit status',assignee:'Carlos M.',due:'2025-05-13',priority:'high',done:false}],
};

export let invoices = [
  {id:1,projId:1,desc:'Framing lumber — load 1',cat:'mat',vendor:'Orlando Lumber Supply',date:'2025-04-10',num:'INV-0031',amount:18500,markup:15,status:'paid'},
  {id:2,projId:1,desc:'Framing crew labor — week 1',cat:'lab',vendor:'Mike W.',date:'2025-04-14',num:'INV-0032',amount:12000,markup:15,status:'paid'},
  {id:3,projId:1,desc:'Plumbing rough-in',cat:'sub',vendor:'Central FL Plumbing LLC',date:'2025-04-20',num:'INV-0035',amount:22000,markup:15,status:'paid'},
  {id:4,projId:1,desc:'Framing lumber — load 2',cat:'mat',vendor:'Orlando Lumber Supply',date:'2025-05-01',num:'INV-0038',amount:16000,markup:15,status:'pend'},
  {id:5,projId:1,desc:'City permit fees',cat:'fee',vendor:'City of Sanford',date:'2025-05-05',num:'INV-0039',amount:3200,markup:0,status:'paid'},
  {id:6,projId:2,desc:'Rebar & wire mesh',cat:'mat',vendor:'Steel Direct Inc.',date:'2025-04-22',num:'INV-0033',amount:9800,markup:12,status:'paid'},
  {id:7,projId:2,desc:'Concrete foundation pour',cat:'sub',vendor:'Tri-County Concrete',date:'2025-04-28',num:'INV-0036',amount:31500,markup:12,status:'pend'},
  {id:8,projId:2,desc:'Soil engineering report',cat:'fee',vendor:'GeoTech Solutions',date:'2025-04-15',num:'INV-0034',amount:2800,markup:12,status:'paid'},
  {id:9,projId:5,desc:'Drywall sheets & compound',cat:'mat',vendor:'Home Depot Pro',date:'2025-05-02',num:'INV-0040',amount:14200,markup:10,status:'pend'},
  {id:10,projId:5,desc:'Insulation installation',cat:'sub',vendor:'Spray Foam FL',date:'2025-05-08',num:'INV-0041',amount:8900,markup:10,status:'draft'},
  {id:11,projId:6,desc:'Site clearing & grading',cat:'sub',vendor:'Central Earthworks',date:'2025-03-15',num:'INV-0028',amount:11000,markup:18,status:'paid'},
];

export let subs = [
  {id:1,name:'Central FL Plumbing LLC',trade:'Plumbing',contact:'Ray Morales',phone:'(407) 555-0181',email:'ray@cfplumbing.com',lic:'FL-CFC-054321',rate:'$90/hr + materials',insExp:'2026-01-15',rating:5,status:'active',projs:[1,5],notes:'Preferred plumber — fast, reliable, good pricing.'},
  {id:2,name:'SunState Electric',trade:'Electrical',contact:'Debbie Nguyen',phone:'(407) 555-0244',email:'debbie@sunstateelectric.com',lic:'FL-EC-013892',rate:'Lump sum per project',insExp:'2025-11-01',rating:4,status:'active',projs:[2,3],notes:'Licensed master electrician. Always pulls own permits.'},
  {id:3,name:'Tri-County Concrete',trade:'Concrete',contact:'Bob Stanton',phone:'(386) 555-0312',email:'bobs@tricountyconcrete.com',lic:'FL-CBC-065112',rate:'$8.50/sq ft slab',insExp:'2025-08-20',rating:5,status:'active',projs:[2],notes:'Best slab crew in the region. Booked 3 weeks out.'},
  {id:4,name:'Premier Framing Co.',trade:'Framing',contact:'Jose Hernandez',phone:'(321) 555-0076',email:'jhernandez@premierframing.com',lic:'FL-CBC-078234',rate:'$6.75/sq ft',insExp:'2025-12-31',rating:4,status:'active',projs:[1,5,6],notes:'Strong crew. Good with complex roof lines.'},
  {id:5,name:'Cool Comfort HVAC',trade:'HVAC',contact:'Terry Walsh',phone:'(407) 555-0093',email:'terry@coolcomforthvac.com',lic:'FL-CAC-0531872',rate:'$12,000–$25,000/home',insExp:'2026-03-10',rating:5,status:'idle',projs:[3],notes:'Energy Star certified. Does full design-build HVAC.'},
  {id:6,name:'Sunshine Flooring',trade:'Flooring',contact:'Maria Torres',phone:'(407) 555-0150',email:'mtorres@sunshineflooring.com',lic:'N/A',rate:'$4.50–$9/sq ft installed',insExp:'2025-09-01',rating:4,status:'idle',projs:[3],notes:'Tile, hardwood, LVP. Great with custom tile layouts.'},
];

export let team = [
  {id:1,name:'Mike W.',role:'Senior Project Manager',phone:'(407) 555-0201',email:'mike@wpcustomhomes.com'},
  {id:2,name:'Sarah K.',role:'Project Manager',phone:'(407) 555-0202',email:'sarah@wpcustomhomes.com'},
  {id:3,name:'James R.',role:'Project Manager',phone:'(407) 555-0203',email:'james@wpcustomhomes.com'},
  {id:4,name:'Dana L.',role:'Project Coordinator',phone:'(407) 555-0204',email:'dana@wpcustomhomes.com'},
  {id:5,name:'Carlos M.',role:'Site Supervisor',phone:'(407) 555-0205',email:'carlos@wpcustomhomes.com'},
  {id:6,name:'Linda P.',role:'Admin / Scheduling',phone:'(407) 555-0206',email:'linda@wpcustomhomes.com'},
  {id:7,name:'Tom B.',role:'Site Supervisor',phone:'(407) 555-0207',email:'tom@wpcustomhomes.com'},
];

export const activity = [
  {icon:'ti-circle-check',cls:'a-gn',text:'<strong>Sarah K.</strong> completed soil compaction report on Thornwood Custom Build',time:'9:42 AM'},
  {icon:'ti-receipt',cls:'a-gd',text:'Invoice INV-0041 ($8,900) added to Summit View Estate — Spray Foam FL',time:'9:15 AM'},
  {icon:'ti-plus',cls:'a-bl',text:'<strong>Mike W.</strong> added task "Verify HVAC duct routing plan" to Summit View Estate',time:'8:55 AM'},
  {icon:'ti-hard-hat',cls:'a-gd',text:'Subcontractor <strong>Premier Framing Co.</strong> assigned to Riverside Bungalow',time:'8:20 AM'},
  {icon:'ti-alert-triangle',cls:'a-rd',text:'<strong>Riverside Bungalow</strong> status changed to On Hold — permitting delay',time:'Yesterday 4:15 PM'},
];

export const nextId = {proj:100,task:200,inv:50,sub:20,team:10};
