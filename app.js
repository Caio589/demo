let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

let graficoFaturamento;
let graficoVendas;

function doLogin() {
  const loginDiv = document.getElementById("login");
  const appDiv = document.getElementById("app");
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");

  if (userInput.value === "demo" && passInput.value === "1234") {
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
  const produto = produtos[produtoVenda.selectedIndex];
  if (!produto) return;
  vendas.push(produto.preco);
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

  const total = vendas.reduce((a, b) => a + b, 0);

  vendas.innerText;
  document.getElementById("vendas").innerText = vendas.length;
  document.getElementById("clientes").innerText = clientes.length;
  document.getElementById("produtos").innerText = produtos.length;
  document.getElementById("faturamento").innerText = total;

  criarGraficos();
}

function criarGraficos() {

  if (graficoFaturamento) graficoFaturamento.destroy();
  if (graficoVendas) graficoVendas.destroy();

  graficoFaturamento = new Chart(
    document.getElementById("graficoFaturamento"),
    {
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
        scales: {
          y: {
            min: 0,
            max: 50000
          }
        }
      }
    }
  );

  graficoVendas = new Chart(
    document.getElementById("graficoVendas"),
    {
      type: "bar",
      data: {
        labels: ["Vendas"],
        datasets: [{
          label: "Quantidade",
          data: [vendas.length]
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 50000
          }
        }
      }
    }
  );
}
