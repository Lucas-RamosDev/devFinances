/* Abrir e fechar modal HTML */
const Modal = {// OBS: Função dentro de uma variável é chamado de método

  open() {
    // Abrir modal
    // Adicionar a class active ao modal
    //estará selecionando a classe "modal-overlay" e adicionar outra classe a "active"
    document 
      .querySelector('.modal-overlay') //seleciona a classe
      .classList.add('active')         //adiciona a classe
  },

  close() {
    // Fechar modal
    // Remover a class active ao modal
    document
      .querySelector('.modal-overlay') //seleciona a classe
      .classList.remove('active')      //remove a classe

  }

}

/* --- # PENSAMENTO 4 # --- 
  "Preciso armazenar os dados em algum lugar.
  Neste app estaremos armazenando as informações 
  no LocalStorage do navegador."
*/
const Storage = {
  
  //guarda as informações no LocalStorage
  set(transactions) {
    /* Obs: quando salvamos os valores no storage ele transforma tudo em string */

    localStorage.setItem("dev.finances:transactions",
      JSON.stringify(transactions) //"JSON.strinfy()" transforma todo meu array para uma string
    )
  },
  
  
  // pega as informações do localStorage
  get() {

    
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []//"parse()" -> transforma string para array ou objeto
            // se não encontrar nenhum valor no storage, de volver um array vazio
  },

}

/*  --- # PENSAMENTO 1 # ---
  "Eu Preciso somar as entradas
  depois eu preciso somar as saídas e
  remover das entradas o valor das saídas
  assim, eu terei o total."
*/
const Transaction = {
    
  all: Storage.get(),
  /*
  [
    {
      description: 'Luz',
      amount: -50001,
      date: '23/01/2021',
    },
    {
      description: 'Website',
      amount: 500010,
      date: '23/01/2021',
    },
    {
      description: 'Internet',
      amount: -20000,
      date: '23/01/2021',
    },
    {
      description: 'App',
      amount: 200000,
      date: '23/02/2021',
    },
  ], 
  */

  // adiciona transação
  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  // remove a transação
  remove (index) {
  // "splice" é um metodo do array que vai esperar um numero do "index" e excluir ele do array
    Transaction.all.splice(index, 1) // "index" -> qual elemento vou deletar / "1" -> quantos vou deletar
    
    App.reload()
  },

  // soma as entradas
  incomes() {
    let income = 0;

    // Pegar todas as transacoes
    Transaction.all.forEach(transaction => { // o nome "transection" poreia ser qualquer coisa
      //se ela for maior que zero
      if (transaction.amount > 0) {
        // somar a uma variavel e retornar a variavel
        income = income + transaction.amount
      }

    })

    return income
  },

  // somar as saídas
  expenses() {
    let expensive = 0;

    // Pegar todas as transacoes
    Transaction.all.forEach(transaction => { // o nome "transection" poreia ser qualquer coisa
      //se ela for menor que zero
      if (transaction.amount < 0) {
        // somar a uma variavel e retornar a variavel
        expensive = expensive + transaction.amount
      }

    })

    return expensive
  },

  // mostrar o total
  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
}

/*  --- # PENSAMENTO 2 # ---
  "Preciso pegar as minhas transações 
  ("const transactions") do meu objeto 
  aqui no Javascript e colocar lá
  no HTML."
*/
const DOM = {

  // Seleciona o "tbody" da tabela
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {

    // cria o elemento "tr"
    const tr = document.createElement('tr')
    // o "tr" criado recebe os dados da função "innerHTMLTransaction"
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    //console.log(transaction)

    tr.dataset.index = index

    // faz o "tr" aparecer no tbody do html
    DOM.transactionsContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction, index) {

    //"amount" é maior que "zero"? então coloque a classe "income" se não coloca a classe "expense"
    const CSSclass = transaction.amount > 0 ? "income" : "expense"

    // const "amount" recebe os valores formatados em moeda executando a função "formatCurrency"
    const amount = Utils.formatCurrency(transaction.amount)

    // estrutura html dos "td" da tabela
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img class="delete" onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="imagem remover transação">
      </td>
    `
    return html

  },

  updateBalance() {
    document
      .getElementById("incomeDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById("expensiveDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById("totalDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransections() {
    DOM.transactionsContainer.innerHTML = ""
  }

}

const Utils = {

  formatDate(date) {

    const splitedDate = date.split("-") // "split" -> esplhar, neste caso vc declara dentro do split oque quer retirar "-".

    dateFormated = `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
    
    //console.log(date)
    //console.log(dateFormated)
    return dateFormated    
  },

  formatAmount(value) {
    value = Number(value.replace(/\,\./g,"")) * 100 // "replace(/\,\./g,"")" -> tira os "." e "," da string

    //console.log(value)
    return value
  },

  formatCurrency(value) {

    // converte o valor em número (caso receba uma string ele força a conversão para number) 
    // e depois compara se o "value" for menor que "zero" então acrescenta o sinal de "-"
    const signal = Number(value) < 0 ? "-" : ""

    // remove qualquer caractere especial
    value = String(value).replace(/\D/g, "")
    // divide por 100 pq na minha base de dados salvo multiplicado por 100 (ex: 10,00 = 1000)
    value = Number(value) / 100
    // formata em dinheiro (pt-BR)
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    //console.log(signal + value)
    return signal + value
  },

}

/*  --- # PENSAMENTO 3 # ---
  "Gravar as informações do forme na tabela, seguindo
  as seguintes especivficações:
  ->Verificar se todas as informações foram preenchidas;
  -> formatar os dados para salvar;
  -> salvar
  -> Apagar os dados do formulário
  -> Fechar o Modal
  -> Atualizar a aplicação
*/
const Form = {
  
  // 1 - pegando os dados no form HTML
  description: document.querySelector('input#description'), // ('input#description') -> pegando o input q tenha id description
  amount: document.querySelector('input#amount'), // ('input#amount') -> pegando o input q tenha id description
  date: document.querySelector('input#date'), // ('input#date') -> pegando o input q tenha id description

  // 2 - salvando os valores do HTML em um ARRAY
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    // desestruturando para pegar apenas os valores
    const { description, amount, date } = Form.getValues()
    //console.log(description)

    if(description.trim() === "" || // "trim()" -> serve para fazer uma limpeza dos espação vazios
      amount.trim() === "" ||
      date.trim() === "" ) {
        // throw -> reporta o "error" para o catch capturar
        throw new Error("Por favor preencha todos os campos")
      } 
  },

  formatValues() {
    // desestruturando para pegar apenas os valores
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description: description,
      amount: amount,
      date: date,
    }

  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  
  submit(event) {
    // interrompe o comportamento padrão do formulario ao enviar informações
    event.preventDefault()

    /* ---# "try" / "catch" #---
    try = tentar: Vai "tentar" executar cada um desses passos abaixo.
    catch = capturar: Se gerar algum erro o mesmo será "capturado"
    
     */
    
    try {
      //Verificar se todas as informações foram preenchidas
      Form.validateFields()
  
      //formatar os dados para salvar
      const transaction = Form.formatValues()

      // Salva os dados
      Transaction.add(transaction)

      //apagar os dados do formullario
      Form.clearFields()

      //fecha o modal
      Modal.close()

      //atualiza a aplicação
      //App.reload() -> Dentro da função "Transaction.add(transaction)" ja tem uma função de atualização (App.reload()), por isso não precisa colocar novamente.

    } catch (error) {
      alert(error.message)
    }





  }
}

const App = {

  //inicia a aplicação
  init() {

    // realiza a repetição de todos os objetos que tenho dentro do array
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })

    DOM.updateBalance()

    Storage.set(Transaction.all)

  },

  //atualiza a aplicação
  reload() {

    DOM.clearTransections()
    App.init()

   },

}

// realiza a execução para iniciar meu app
App.init()



// simula quando eu for adicionar uma nova transação
/*
Transaction.add({
  description: 'Alo',
  amount: 2000,
  date: '23/01/2021'
})
*/


