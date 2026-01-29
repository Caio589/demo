let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

let graficoFaturamento;
let graficoVendas;

function login() {
  if (user.value === "demo" && pass.value === "1234") {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    atualizar();
  } else {
    alert("Login inválido");
  }
}

function logout() {
  location.reload();
}

function show(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function addCliente() {
  if (!novoCliente.value) return;
  clientes.push(novoCliente.value);
  novoCliente.value = "";
  salvar();
}

function addProduto() {
  if (!nomeProduto.value || !precoProduto.value) return;
  produtos.push({ nome: nomeProduto.value, preco: Number(precoProduto.value) });
  nomeProduto.value = precoProduto.value = "";
  salvar();
}

function registrarVenda() {
  if (clientes.length === 0 || produtos.length === 0) {
    alert("Cadastre cliente e produto");
    return;
  }

  const produto = produtos[produtoVenda.selectedIndex];
  if (!produto) return;

  vendas.push(produto.preco);
  salvar();
  alert("Venda registrada!");
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

  const total = vendas.reduce((a, b) => a + b, 0);

  document.getElementById("vendas").innerText = vendas.length;
  document.getElementById("clientes").innerText = clientes.length;
  document.getElementById("produtos").innerText = produtos.length;
  document.getElementById("faturamento").innerText = total;

  criarGraficos();
}

function criarGraficos() {

  if (typeof Chart === "undefined") {
    console.error("Chart.js não carregou");
    return;
  }

  const canvasFat = document.getElementById("graficoFaturamento");
  const canvasVen = document.getElementById("graficoVendas");

  if (!canvasFat || !canvasVen) {
    console.warn("Canvas do gráfico não encontrado");
    return;
  }

  if (graficoFaturamento) graficoFaturamento.destroy();
  if (graficoVendas) graficoVendas.destroy();

  graficoFaturamento = new Chart(canvasFat, {
    type: "line",
    data: {
      labels: vendas.map((_, i) => `Venda ${i + 1}`),
      datasets: [{
        label: "Faturamento (R$)",
        data: vendas,
        borderWidth: 3,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  graficoVendas = new Chart(canvasVen, {
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

  graficoVendas = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Vendas"],
      datasets: [{
        label: "Quantidade",
        data: [vendas.length]
      }]
    }
  });
}
