let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

function login() {
  if (user.value === "demo" && pass.value === "1234") {
    loginDiv(true);
  } else {
    alert("Login inválido");
  }
}

function loginDiv(ok) {
  document.getElementById("login").style.display = ok ? "none" : "flex";
  document.getElementById("app").classList.toggle("hidden", !ok);
  atualizar();
}

function logout() {
  location.reload();
}

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function addCliente() {
  clientes.push(novoCliente.value);
  novoCliente.value = "";
  salvar();
}

function addProduto() {
  produtos.push({nome: nomeProduto.value, preco: precoProduto.value});
  nomeProduto.value = precoProduto.value = "";
  salvar();
}

function registrarVenda() {
  const p = produtos[produtoVenda.selectedIndex];
  vendas.push(p.preco);
  salvar();
}

function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("vendas", JSON.stringify(vendas));
  atualizar();
}

function atualizar() {
  listaClientes.innerHTML = clientes.map(c => `<li>${c}</li>`).join("");
  listaProdutos.innerHTML = produtos.map(p => `<li>${p.nome} - R$ ${p.preco}</li>`).join("");

  clienteVenda.innerHTML = clientes.map(c => `<option>${c}</option>`).join("");
  produtoVenda.innerHTML = produtos.map(p => `<option>${p.nome}</option>`).join("");

  vendasSpan = vendas.reduce((a,b)=>a+Number(b),0);

  vendas.innerHTML;
  document.getElementById("vendas").innerText = vendas.length;
  document.getElementById("clientes").innerText = clientes.length;
  document.getElementById("produtos").innerText = produtos.length;
  document.getElementById("faturamento").innerText = vendasSpan;
}
