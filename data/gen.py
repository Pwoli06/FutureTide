import json
P={"reducing":("SSP1-2.6","ssp126"),"maintaining":("SSP2-4.5","ssp245"),"increasing":("SSP5-8.5","ssp585")}
# sst, ice, chl, krill, hotspot, outside, peng, whale, seal, stress, conf
D={
("baseline",2025):(0.20,100,0.62,100,0.55,30,70,65,72,25,"medium"),
("reducing",2035):(0.40,93,0.60,94,0.52,33,66,64,69,31,"medium"),
("maintaining",2035):(0.45,91,0.59,92,0.50,34,64,63,68,34,"medium"),
("increasing",2035):(0.50,88,0.58,89,0.48,36,62,61,66,37,"medium"),
("reducing",2050):(0.55,89,0.58,90,0.49,36,62,62,66,36,"medium"),
("maintaining",2050):(0.75,81,0.55,82,0.43,41,55,58,61,46,"medium"),
("increasing",2050):(1.00,71,0.51,72,0.36,48,47,52,54,57,"low"),
("reducing",2100):(0.60,86,0.57,87,0.47,38,60,61,64,40,"low"),
("maintaining",2100):(1.30,63,0.49,66,0.32,52,42,47,50,63,"low"),
("increasing",2100):(2.40,35,0.38,42,0.18,68,22,30,33,86,"low"),
}
TXT={
("baseline",2025):("Today's Southern Ocean is already warming, but krill hotspots still largely overlap the Antarctic Peninsula's feeding grounds.",
 "This is the reference point for all futures. Antarctic krill depend on winter sea ice to shelter their young, and today's ice still supports large swarms around the Antarctic Peninsula and Scotia Sea. Roughly a third of krill hotspots already sit outside protected areas. Penguins, whales and seals that eat krill are holding steady but are sensitive to any decline.",
 ["Current sea ice extent","Early surface warming since the 1990s","Concentrated krill fishery near the Peninsula"]),
("reducing",2035):("Near-term warming is locked in, so even the cleanest path shows modest ice and krill losses by 2035.",
 "Climate futures look similar in the 2030s because much of the near-term warming is already committed. Sea ice thins slightly and krill numbers dip a few percent. Protected areas still cover most hotspots. Early action now is what sets up the big differences later this century.",
 ["Committed warming","Slight winter sea ice decline"]),
("maintaining",2035):("By 2035, a middle-of-the-road path looks only slightly worse than the cleanest one, but the gap is starting to open.",
 "Ocean temperatures rise a little faster than under strong cuts, and winter sea ice shrinks by about a tenth. Krill nurseries under the ice lose some ground, and slightly more swarms drift outside protected areas. Predators feel small but noticeable pressure.",
 ["Gradual warming","Sea ice nursery loss","Krill drift beyond MPAs"]),
("increasing",2035):("Even by 2035, rising fossil fuel use nudges krill and sea ice onto a steeper downward path.",
 "The differences between paths are still small in the 2030s, but this is the worst of the three. Sea ice shrinks more, krill density slips by around a tenth, and over a third of hotspots sit outside protected zones. This is when policy choices start to show up in the ocean.",
 ["Faster surface warming","Earlier sea ice retreat","Growing MPA mismatch"]),
("reducing",2050):("With strong emission cuts, the Southern Ocean stabilises by mid-century and krill losses stay limited.",
 "Warming slows as emissions fall, so sea ice and krill decline only modestly from today. Most krill hotspots remain inside or near existing protected areas, meaning current CCAMLR protections still largely work. Predators stay close to today's condition.",
 ["Emissions decline","Sea ice largely retained","Stable krill habitat"]),
("maintaining",2050):("Holding today's emissions trends means losing about a fifth of sea ice and krill by 2050.",
 "Continued warming erodes the winter sea ice that young krill need, and swarms begin shifting south toward the Antarctic coast. Around 40% of hotspots now fall outside protected areas, so today's MPA boundaries protect less of the food web. Penguin colonies that rely on nearby krill are the first to struggle.",
 ["Sea ice loss","Poleward krill contraction","Penguin foraging pressure"]),
("increasing",2050):("A high-emissions path cuts krill by roughly a quarter and pushes nearly half of hotspots outside protection by 2050.",
 "Faster warming and sea ice loss shrink krill nursery habitat and push swarms poleward. Nearly half of krill hotspots now lie outside protected areas, where fishing is allowed. Penguins, whales and seals all lose part of their food supply. Protected-area boundaries drawn for today's ocean would need to be redrawn.",
 ["Rapid sea ice loss","Krill habitat contraction","MPA boundaries out of date"]),
("reducing",2100):("Cutting emissions keeps the Southern Ocean food web broadly intact through 2100.",
 "Warming levels off well under 1°C above the recent past in the Southern Ocean surface. Sea ice and krill remain close to today's levels, and most hotspots stay within protected areas. This is the future where current conservation tools remain effective.",
 ["Low emissions","Stabilised sea ice","Effective MPAs"]),
("maintaining",2100):("Middle-of-the-road emissions leave the Southern Ocean with about a third less sea ice and krill by 2100.",
 "Sustained warming shrinks sea ice and concentrates krill closer to the Antarctic continent. More than half of hotspots fall outside protected areas, weakening today's safeguards. Penguin and seal populations that depend on krill decline significantly, with knock-on effects for whales.",
 ["Sustained warming","Krill shift toward the continent","Majority of hotspots unprotected"]),
("increasing",2100):("Under very high emissions, most of the Southern Ocean's sea ice and over half of its krill are gone by 2100.",
 "The Southern Ocean surface warms by more than 2°C, and winter sea ice shrinks to around a third of today. Krill collapse toward the coast and drop by more than half, with about two-thirds of hotspots outside protected areas. Krill-dependent penguins, seals and whales face severe declines. Current protection plans would no longer match where life is.",
 ["Severe warming","Sea ice collapse","Krill crash and food-web stress"]),
}
def tint(stress):
    # healthy deep blue -> murky green-grey
    a=(0x0a,0x4f,0x8f); b=(0x4a,0x5e,0x52); t=stress/100
    return "#%02x%02x%02x"%tuple(round(a[i]+(b[i]-a[i])*t) for i in range(3))
out=[]; base=None
for (pw,yr),v in D.items():
    sst,ice,chl,kr,hp,om,pe,wh,se,st,cf=v
    lab,code=("Present day","baseline") if pw=="baseline" else P[pw]
    h,e,k=TXT[(pw,yr)]
    s={"id":"baseline_2025" if pw=="baseline" else f"{code}_{yr}","pathway":pw,"sspLabel":lab,"year":yr,
       "sstAnomalyC":sst,"seaIceExtentPctOfToday":ice,"chlorophyllIndex":chl,"krillDensityPctOfToday":kr,
       "hotspotProbability":hp,"krillOutsideMpaPct":om,"predatorHealth":{"penguins":pe,"whales":wh,"seals":se},
       "ecosystemStress":st,"confidence":cf,"headline":h,"explanation":e,"keyDrivers":k,
       "visual":{"iceCoverage":round(0.8*ice/100,2),"krillSwarmCount":round(40*kr/100),
                 "waterTurbidity":round(0.15+0.6*st/100,2),"waterTint":tint(st),
                 "predatorCount":round(12*(pe+wh+se)/300/0.69),"mpaBreachIntensity":round((om-30)/40,2) if om>30 else 0.0}}
    if pw=="baseline": base=s
    else: out.append(s)
doc={"version":"1.0","project":"FutureTide","referenceProject":"https://github.com/gt-big-data/fish-cast",
 "region":"Southern Ocean / Antarctic Peninsula & Scotia Sea (CCAMLR Area 48)",
 "disclaimer":"Illustrative scenario values informed by published CMIP6 / IPCC AR6 ranges and krill literature, generated by Grok Bot. These are NOT FishCast model output and NOT validated predictions. FishCast's own README notes that no climate-only model yet shows predictive skill for krill hotspots.",
 "sources":[
  "IPCC (2021) Climate Change 2021: The Physical Science Basis, WG1 Contribution to AR6. Chapter 9: Ocean, Cryosphere and Sea Level Change (Fox-Kemper et al.).",
  "IPCC (2019) Special Report on the Ocean and Cryosphere in a Changing Climate (SROCC).",
  "Atkinson, A. et al. (2019) Krill (Euphausia superba) distribution contracts southward during rapid regional warming. Nature Climate Change 9, 142-147.",
  "CMIP6 projections via Copernicus Climate Data Store (CDS), as used by FishCast."],
 "pathways":{"reducing":"SSP1-2.6","maintaining":"SSP2-4.5","increasing":"SSP5-8.5"},
 "years":[2035,2050,2100],"baseline":base,"scenarios":out}
json.dump(doc,open("scenarios.json","w"),indent=2,ensure_ascii=False)
