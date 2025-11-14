// admin.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const menuPanel = document.getElementById("menuPanel");
const menuList = document.getElementById("menuList");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    emailInput.style.display = passwordInput.style.display = loginBtn.style.display = "none";
    menuPanel.style.display = "block";
    loadMenu();
  } catch (err) {
    alert("ورود ناموفق: " + err.message);
  }
};

async function loadMenu() {
  menuList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "menu"));
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("div");
    row.innerHTML = `
      <p>${data.name} — 
      <input type="number" id="price-${docSnap.id}" value="${data.price}">
      <button onclick="updatePrice('${docSnap.id}')">ذخیره</button></p>
    `;
    menuList.appendChild(row);
  });
}

window.updatePrice = async (id) => {
  const priceField = document.getElementById(`price-${id}`);
  const newPrice = parseInt(priceField.value);
  await updateDoc(doc(db, "menu", id), { price: newPrice });
  alert("قیمت با موفقیت ذخیره شد ✅");
};

logoutBtn.onclick = async () => {
  await signOut(auth);
  location.reload();
};
