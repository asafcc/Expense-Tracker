const transList = document.querySelector("ul"); //empty list of transactions
const submitBtn = document.querySelector(".btn"); //submit btn
const transText = document.querySelector("#text"); //text input
const transAmount = document.querySelector("#amount-input"); //amount input

const balance = document.querySelector("#balance");
const plusBalance = document.querySelector(".income");
const minusBalance = document.querySelector(".expense");

//////////////////////////////////////////////////////event listners
//add transaction
submitBtn.addEventListener("click", addTransaction);
document.addEventListener("DOMContentLoaded", getTransactions);

//////////////////////////////////////////////////////functions
function getTransactions() {
  let localList;
  if (localStorage.getItem("localList") === null) {
    localList = [];
  } else {
    localList = JSON.parse(localStorage.getItem("localList"));
  }
  localList.forEach((transObj) => {
    const trans = ObjectToLi(transObj);
    transList.appendChild(newTrans);
  });
  updateBalance();
}

function ObjectToLi(object) {
  newTrans = createNewTransLi(
    object.text,
    object.amount,
    object.liClass,
    object.id
  );
  return newTrans;
}

function createNewTransLi(text, amount, liClass, id) {
  const transText = text;
  const transAmount = +amount;
  const TransLiClass = liClass;
  const newTrans = document.createElement("li");
  newTrans.id = id;
  newTrans.classList.add(liClass);
  const sign = amount >= 0 ? "" : "-";
  newTrans.innerHTML = `<div class="delete">x</div><p class="item-text">${text}</p><p>${sign}$${Math.abs(
    amount
  )}</p>`;
  newTrans.addEventListener("mouseenter", showDeleteBtn);
  newTrans.addEventListener("mouseleave", hideDeleteBtn);
  newTrans.querySelector(".delete").addEventListener("click", deleteFromList);
  return newTrans;
}

function addTransaction(e) {
  e.preventDefault();
  const text = transText.value;
  const amount = +transAmount.value;

  if (amount === 0) {
    alert("Please enter a valid amount");
    return;
  }
  if (text.trim() === "") {
    alert("Please enter a name transaction");
    return;
  }
  transText.value = "";
  transAmount.value = "";
  const liClass = amount > 0 ? "income-item" : "expense-item";

  const id = Math.floor(Math.random() * 1000000000);

  const newTrans = createNewTransLi(text, amount, liClass, id);
  transList.appendChild(newTrans);
  transObj = { text: text, amount: amount, liClass: liClass, id: id };
  //add trans to local storage
  saveLocalTrans(transObj);
  updateBalance();
}

function saveLocalTrans(trans) {
  let localList;
  if (localStorage.getItem("localList") === null) {
    localList = [];
  } else {
    localList = JSON.parse(localStorage.getItem("localList"));
  }

  localList.push(trans);
  localStorage.setItem("localList", JSON.stringify(localList));
}

function hideDeleteBtn(e) {
  e.target.children[0].style.opacity = "0";
}

function showDeleteBtn(e) {
  e.target.children[0].style.opacity = "1";
}

function deleteFromList(e) {
  const transToDelete = e.target.parentElement;
  transToDelete.classList.add("fall");
  removeLocalTrans(transToDelete);
  transToDelete.addEventListener("transitionend", function () {
    transToDelete.remove();
    updateBalance();
  });
}

function removeLocalTrans(trans) {
  let localList = JSON.parse(localStorage.getItem("localList"));
  localList = localList.filter((t) => {
    return +t.id !== +trans.id;
  });

  localStorage.setItem("localList", JSON.stringify(localList));
}

function updateBalance() {
  let calcBalance = 0;
  let calcPlus = 0;
  let calcMinus;

  let localList = JSON.parse(localStorage.getItem("localList"));
  localList.forEach((t) => {
    calcBalance += t.amount;
    calcPlus += t.amount > 0 ? t.amount : 0;
  });
  calcMinus = calcBalance - calcPlus;
  calcBalance = calcBalance.toFixed(2);

  balance.innerHTML = `${calcBalance >= 0 ? "" : "-"}$${Math.abs(calcBalance)}`;
  plusBalance.innerHTML = `$${Math.abs(calcPlus)}`;

  minusBalance.innerHTML = `${calcMinus >= 0 ? "" : "-"}$${Math.abs(
    calcMinus
  )}`;
}
