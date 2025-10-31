// ====== Config ======
const SPECIAL_USER = "psdadmin";
const SPECIAL_PASS = "A9x7qR!3";

const ANN_USERS = { "Bryan":"Bry@2025!", "Jensen":"J3ns3n#Save", "Ahmad":"Ahm4d$Edit" };
const ANN_BIN_ID = "6903802ed0ea881f40c76129";

const MASTER_KEY = "$2a$10$N7Wza0NGDUCgaPy3HFSYzOeK4WS5PUMeTrtLSPC9GzUmK.gf3Z/TS";
const ACCESS_KEY = "$2a$10$wpzRqDW3wUNmYfvbnQnbw.wSicD9GaqJa86I3Jwr5QZbIC2mPuspi";

// Docs
let currentDocId = null;

// Ads
const ADS_BIN_KEY = "690383abcdef123456789"; // Example, create a bin for ads

// ====== Editor Login ======
const editorLoginBtn = document.getElementById("editor-login-btn");
editorLoginBtn.addEventListener("click", ()=>{
  const user = prompt("Editor Username:");
  const pass = prompt("Password:");
  if(user===SPECIAL_USER && pass===SPECIAL_PASS){
    localStorage.setItem("editorLoggedIn","true");
    document.querySelectorAll(".editor-only").forEach(e=>e.style.display="block");
    alert("Editor access granted!");
  } else alert("Access denied.");
});
if(localStorage.getItem("editorLoggedIn")==="true"){
  document.querySelectorAll(".editor-only").forEach(e=>e.style.display="block");
}

// ====== Announcements ======
const annView = document.getElementById("announcement-view");
const annTextarea = document.getElementById("announcement-text");
const saveAnnBtn = document.getElementById("save-ann-btn");

async function loadAnn(){
  try{
    const res = await fetch(`https://api.jsonbin.io/v3/b/${ANN_BIN_ID}/latest`,{
      headers:{ "X-Master-Key": MASTER_KEY,"X-Access-Key":ACCESS_KEY }
    });
    const data = await res.json();
    const content = data.record?.content || "";
    annView.textContent = content;
    annTextarea.value = content;
  } catch(err){ annView.textContent="No announcements."; }
}
loadAnn();

saveAnnBtn.addEventListener("click", async ()=>{
  try{
    await fetch(`https://api.jsonbin.io/v3/b/${ANN_BIN_ID}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json","X-Master-Key": MASTER_KEY,"X-Access-Key":ACCESS_KEY },
      body: JSON.stringify({ content: annTextarea.value })
    });
    annView.textContent = annTextarea.value;
    alert("Announcement saved!");
  } catch(err){ alert("Failed to save."); }
});

// ====== Docs ======
const docEditor = document.getElementById("doc-editor");
const docTextarea = document.getElementById("doc-text");
const currentDocInput = document.getElementById("current-doc-id");
const createDocBtn = document.getElementById("create-doc-btn");
const loadDocBtn = document.getElementById("load-doc-btn");
const saveDocBtn = document.getElementById("save-doc-btn");
const deleteDocBtn = document.getElementById("delete-doc-btn");
const exportDocBtn = document.getElementById("export-doc-btn");

createDocBtn.addEventListener("click", async ()=>{
  const title = prompt("Enter doc title/ID:");
  if(!title) return;
  try{
    const res = await fetch("https://api.jsonbin.io/v3/b",{
      method:"POST",
      headers:{ "Content-Type":"application/json","X-Master-Key":MASTER_KEY,"X-Access-Key":ACCESS_KEY },
      body: JSON.stringify({ title, content:"" })
    });
    const data = await res.json();
    currentDocId = data.metadata.id;
    currentDocInput.value = currentDocId;
    docTextarea.value="";
    docEditor.style.display="block";
    alert("New doc created! Bin ID: "+currentDocId);
  } catch(err){ alert("Failed to create doc."); }
});

loadDocBtn.addEventListener("click", async ()=>{
  const binId = prompt("Enter Bin ID to load:");
  if(!binId) return;
  try{
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`,{
      headers:{ "X-Master-Key":MASTER_KEY,"X-Access-Key":ACCESS_KEY }
    });
    const data = await res.json();
    currentDocId = binId;
    currentDocInput.value = currentDocId;
    docTextarea.value = data.record.content || "";
    docEditor.style.display="block";
    alert("Doc loaded.");
  } catch(err){ alert("Failed to load doc."); }
});

saveDocBtn.addEventListener("click", async ()=>{
  if(!currentDocId) return alert("No doc loaded.");
  try{
    await fetch(`https://api.jsonbin.io/v3/b/${currentDocId}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json","X-Master-Key":MASTER_KEY,"X-Access-Key":ACCESS_KEY },
      body: JSON.stringify({ content: docTextarea.value })
    });
    alert("Doc saved!");
  } catch(err){ alert("Failed to save."); }
});

deleteDocBtn.addEventListener("click", async ()=>{
  if(!currentDocId) return alert("No doc loaded.");
  if(!confirm("Are you sure you want to delete this doc?")) return;
  try{
    await fetch(`https://api.jsonbin.io/v3/b/${currentDocId}`,{
      method:"DELETE",
      headers:{ "X-Master-Key":MASTER_KEY,"X-Access-Key":ACCESS_KEY }
    });
    currentDocId=null;
    docTextarea.value="";
    currentDocInput.value="";
    docEditor.style.display="none";
    alert("Doc deleted!");
  } catch(err){ alert("Failed to delete."); }
});

exportDocBtn.addEventListener("click", ()=>{
  const text = docTextarea.value;
  if(!text) return alert("Nothing to export!");
  const blob = new Blob([text], { type:"text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "PSDROA_doc.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

// ====== Ads ======
const adsContainer = document.getElementById("ads-container");
const adText = document.getElementById("ad-text");
const adLink = document.getElementById("ad-link");
const createAdBtn = document.getElementById("create-ad-btn");

async function loadAds(){
  try{
    const res = await fetch(`https://api.jsonbin.io/v3/b/${ADS_BIN_KEY}/latest`,{
      headers:{ "X-Master-Key":MASTER_KEY,"X-Access-Key":ACCESS_KEY }
    });
    const data = await res.json();
    adsContainer.innerHTML = "";
    (data.record?.ads||[]).forEach(a=>{
      const div = document.createElement("div");
      div.className="ad-box";
      div.innerHTML = a.link? `<a href="${a.link}" target="_blank">${a.text}</a>` : a.text;
      adsContainer.appendChild(div);
    });
  } catch(err){ adsContainer.textContent="No ads available."; }
}
loadAds();

createAdBtn.addEventListener("click", async ()=>{
  if(localStorage.getItem("editorLoggedIn")!=="true") return alert("Access denied.");
  const text = adText.value.trim();
  if(!text) return alert("Ad text required.");
  const link = adLink.value.trim() || null;
  try{
    const res = await fetch(`https://api.jsonbin.io/v3/b/${ADS_BIN_KEY}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json","X-Master-Key":MASTER_KEY,"X-Access-Key":ACCESS_KEY },
      body: JSON.stringify({ ads:[...document.querySelectorAll(".ad-box")].map(d=>({text:d.innerText, link:d.querySelector("a")?.href})).concat({text, link})] })
    });
    adText.value=""; adLink.value="";
    loadAds();
    alert("Ad created!");
  } catch(err){ alert("Failed to create ad."); }
});
