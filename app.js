let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

let graficoFaturamento;
let graficoVendas;

function doLogin() {
  if (user.value === "demo" && pass.value === "1234") {
    login.style.display = "none";
    app.classList.remove("hidden");
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
  const pagamento = pagamentoVenda.value;
  const cliente = clienteVenda.value;

  if (!produto || !pagamento || !cliente) {
    alert("Preencha todos os campos");
    return;
  }

  vendas.push({
    produto: produto.nome,
    valor: produto.preco,
    pagamento,
    cliente,
    data: new Date().toLocaleString()
  });

  salvar();

  msgVenda.style.display = "block";
  setTimeout(() => msgVenda.style.display = "none", 2000);
}

function salvar() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
  localStorage.setItem("produtos", JSON.stringify(produtos));
  localStorage.setItem("vendas", JSON.stringify(vendas));
  atualizar();
}

function atualizar() {

  listaClientes.innerHTML = clientes.map(c => `<li>${c}</li>`).join("");
  listaProdutos.innerHTML = produtos.map(p => `<li>${p.nome} - R$ ${p.preco.toFixed(2)}</li>`).join("");

  clienteVenda.innerHTML = clientes.map(c => `<option>${c}</option>`).join("");
  produtoVenda.innerHTML = produtos.map(p => `<option>${p.nome}</option>`).join("");

  listaVendas.innerHTML = vendas.slice(-5).reverse().map(v =>
    `<li>
      ${v.produto} - R$ ${v.valor.toFixed(2)}<br>
      <small>${v.pagamento} • ${v.data}</small>
    </li>`
  ).join("");

  const total = vendas.reduce((s, v) => s + v.valor, 0);

  vendasEl.innerText;
  document.getElementById("vendas").innerText = vendas.length;
  document.getElementById("clientes").innerText = clientes.length;
  document.getElementById("produtos").innerText = produtos.length;
  document.getElementById("faturamento").innerText =
    total.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  criarGraficos();
}

function criarGraficos() {

  if (graficoFaturamento) graficoFaturamento.destroy();
  if (graficoVendas) graficoVendas.destroy();

  const valores = vendas.map(v => v.valor);

  graficoFaturamento = new Chart(
    document.getElementById("graficoFaturamento"),
    {
      type: "line",
      data: {
        labels: valores.map((_, i) => `Venda ${i + 1}`),
        datasets: [{
          label: "Faturamento (R$)",
          data: valores,
          borderWidth: 3,
          tension: 0.4
        }]
      },
      options: {
        scales: {
          y: { min: 0, max: 50000 }
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
      }
    }
  );
}
