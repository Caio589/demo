// DADOS
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

let graficoFaturamento = null;
let graficoVendas = null;

// LOGIN
function doLogin() {
  const loginDiv = document.getElementById("login");
  const appDiv = document.getElementById("app");
  const user = document.getElementById("user");
  const pass = document.getElementById("pass");

  if (user.value === "demo" && pass.value === "1234") {
    loginDiv.style.display = "none";
    appDiv.classList.remove("hidden");
    atualizar();
  } else {
    alert("Login inválido");
  }
}

function logout() {
  location.reload();
}

// NAVEGAÇÃO
function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// CLIENTES
function addCliente() {
  const input = document.getElementById("novoCliente");
  if (!input.value) return;

  clientes.push(input.value);
  input.value = "";
  salvar();
}

// PRODUTOS
function addProduto() {
  const nome = document.getElementById("nomeProduto");
  const preco = document.getElementById("precoProduto");

  if (!nome.value || !preco.value) return;

  produtos.push({
    nome: nome.value,
    preco: Number(preco.value)
  });

  nome.value = "";
  preco.value = "";
  salvar();
}

// VENDAS
function registrarVenda() {
  const cliente = document.getElementById("clienteVenda").value;
  const pagamento = document.getElementById("pagamentoVenda").value;
  const produtoIndex = document.getElementById("produtoVenda").selectedIndex;

  if (!cliente || !pagamento || produtoIndex < 0) {
    alert("Preencha todos os campos");
    return;
  }

  const produto = produtos[produtoIndex];

  vendas.push({
    cliente,
    produto: produto.nome,
    valor: produto.preco,
    pagamento,
    data: new Date().toLocaleString()
  });

  salvar();

  const msg = document.getElementById("msgVenda");
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 2000);
}

// SALVAR
function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("vendas", JSON.stringify(vendas));
  atualizar();
}

// ATUALIZAR TELA
function atualizar() {
  document.getElementById("listaClientes").innerHTML =
    clientes.map(c => `<li>${c}</li>`).join("");

  document.getElementById("listaProdutos").innerHTML =
    produtos.map(p => `<li>${p.nome} - R$ ${p.preco.toFixed(2)}</li>`).join("");

  document.getElementById("clienteVenda").innerHTML =
    clientes.map(c => `<option>${c}</option>`).join("");

  document.getElementById("produtoVenda").innerHTML =
    produtos.map(p => `<option>${p.nome}</option>`).join("");

  document.getElementById("listaVendas").innerHTML =
    vendas.slice(-5).reverse().map(v =>
      `<li>
        ${v.produto} - R$ ${v.valor.toFixed(2)}<br>
        <small>${v.pagamento} • ${v.data}</small>
      </li>`
    ).join("");

  document.getElementById("vendas").innerText = vendas.length;
  document.getElementById("clientes").innerText = clientes.length;
  document.getElementById("produtos").innerText = produtos.length;

  const total = vendas.reduce((s, v) => s + v.valor, 0);
  document.getElementById("faturamento").innerText =
    total.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  criarGraficos();
}

// GRÁFICOS
function criarGraficos() {
  if (typeof Chart === "undefined") return;

  const fat = document.getElementById("graficoFaturamento");
  const qtd = document.getElementById("graficoVendas");

  if (graficoFaturamento) graficoFaturamento.destroy();
  if (graficoVendas) graficoVendas.destroy();

  // 🔥 FATURAMENTO ACUMULADO
  let acumulado = 0;
  const faturamentoAcumulado = vendas.map(v => {
    acumulado += v.valor;
    return acumulado;
  });

  graficoFaturamento = new Chart(fat, {
    type: "line",
    data: {
      labels: faturamentoAcumulado.map((_, i) => `Venda ${i + 1}`),
      datasets: [{
        label: "Faturamento acumulado (R$)",
        data: faturamentoAcumulado,
        borderWidth: 3,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 50000
        }
      }
    }
  });

  // 📊 QUANTIDADE DE VENDAS
  graficoVendas = new Chart(qtd, {
    type: "bar",
    data: {
      labels: ["Vendas"],
      datasets: [{
        label: "Quantidade",
        data: [vendas.length]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
