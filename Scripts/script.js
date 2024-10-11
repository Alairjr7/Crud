// Pegando os campos de input do formulário
const CustomerName = document.getElementById("CustomerName");
const CustomerEmail = document.getElementById("CustomerEmail");
const CustomerCellPhone = document.getElementById("CustomerCellPhone");
const ClientCity = document.getElementById("ClientCity");

let cont = 1; // Contador de IDs para cada cliente adicionado

// Função para abrir o modal de cadastro de clientes
const OpenModal = () =>
  (Modal = document.getElementById("modal").classList.add("active"));

// Adiciona um evento para abrir o modal quando o botão de cadastrar cliente é clicado
document
  .getElementById("cadastrarCliente")
  .addEventListener("click", OpenModal);

// Função para fechar o modal de cadastro de clientes
const CloseModal = () =>
  (Modal = document.getElementById("modal").classList.remove("active"));

// Adiciona um evento para fechar o modal quando o botão de fechar (X) é clicado
document.getElementById("modalClose").addEventListener("click", CloseModal);

// Função para pegar os dados armazenados no LocalStorage e convertê-los para um array
const GetLocalStorage = () => JSON.parse(localStorage.getItem("data")) || [];

// Função para salvar o array atualizado no LocalStorage como uma string JSON
const SetLocalStorage = (CustomerData) =>
  localStorage.setItem("data", JSON.stringify(CustomerData));

// Função para salvar os dados do cliente dentro de um objeto e validar os campos obrigatórios
const SaveData = () => {
  const DataObject = {
    id: cont++, // Atribui um ID incremental
    name: CustomerName.value.trim(), // Nome do cliente
    email: CustomerEmail.value.trim(), // E-mail do cliente
    phone: CustomerCellPhone.value.trim(), // Celular do cliente
    City: ClientCity.value.trim(), // Cidade do cliente
  };

  // Verifica se os campos nome, celular e cidade estão preenchidos
  if (
    DataObject.name !== "" &&
    DataObject.phone !== "" &&
    DataObject.City !== ""
  ) {
    try {
      // Pega os dados do LocalStorage, adiciona o novo cliente e salva novamente
      let CustomerData = GetLocalStorage();
      CustomerData.push(DataObject);
      SetLocalStorage(CustomerData);
      ShowData(CustomerData); // Atualiza a tabela com os novos dados
    } catch (error) {
      console.error("Erro ao acessar o localStorage:", error); // Tratamento de erro
    }
  } else {
    // Alerta caso algum campo obrigatório esteja vazio
    alert("Por Favor adicione os dados do cliente.");
  }

  // Fecha o modal e limpa os campos do formulário
  CloseModal();
  CustomerName.value = "";
  CustomerEmail.value = "";
  CustomerCellPhone.value = "";
  ClientCity.value = "";
};

// Adiciona o evento de clique para salvar os dados quando o botão "Salvar" é clicado
document.getElementById("save-button").addEventListener("click", SaveData);

// Função para cancelar o cadastro, fechando o modal e limpando os campos do formulário
const CancelData = () => {
  CloseModal();
  CustomerName.value = "";
  CustomerEmail.value = "";
  CustomerCellPhone.value = "";
  ClientCity.value = "";
};

// Adiciona o evento de clique para cancelar o cadastro quando o botão "Cancelar" é clicado
document.getElementById("cancel-button").addEventListener("click", CancelData);

// Função para mostrar os dados do cliente na tabela
// Adiciona eventos aos botões de editar e excluir para cada cliente
const ShowData = (array) => {
  const Tbody = document.getElementById("tbody");
  Tbody.innerHTML = ""; // Limpa o conteúdo da tabela
  array.forEach((element, index) => {
    // Adiciona cada cliente à tabela
    Tbody.innerHTML += `
        <tr>
        <div class="name-container">
        <td>${element.name}</td>
        </div>
        <div class = "date-container">
        <td>${element.email}</td>
        <td>${element.phone}</td>
        <td>${element.City}</td>
        </div>
        <td>
        <button type="button" class="button green edit-button" data-index="${index}">editar</button>
        <button type="button" class="button red delete-button" data-index="${index}">excluir</button>
            </td>
      </tr>
    `;
  });

  // Adiciona eventos para o botão de editar para cada cliente
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", EditData);
  });

  // Adiciona eventos para o botão de excluir para cada cliente
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", DeleteData);
  });
};

// Função para editar os dados de um cliente
const EditData = (event) => {
  const index = event.target.getAttribute("data-index"); // Pega o índice do cliente a ser editado
  let CustomerData = GetLocalStorage(); // Obtém os dados do LocalStorage

  // Preenche o formulário com os dados do cliente selecionado para edição
  const CustomerDataEdit = CustomerData[index];
  document.getElementById("CustomerName").value = CustomerDataEdit.name;
  document.getElementById("CustomerEmail").value = CustomerDataEdit.email;
  document.getElementById("CustomerCellPhone").value = CustomerDataEdit.phone;
  document.getElementById("ClientCity").value = CustomerDataEdit.City;

  // Remove o evento antigo de salvar e adiciona um novo evento para salvar as edições
  const saveButton = document.getElementById("save-button");
  saveButton.removeEventListener("click", SaveData);

  saveButton.addEventListener("click", function SaveEditedData() {
    // Atualiza os dados do cliente com os novos valores do formulário
    CustomerData[index].name = document
      .getElementById("CustomerName")
      .value.trim();
    CustomerData[index].email = document
      .getElementById("CustomerEmail")
      .value.trim();
    CustomerData[index].phone = document
      .getElementById("CustomerCellPhone")
      .value.trim();
    CustomerData[index].City = document
      .getElementById("ClientCity")
      .value.trim();

    // Atualiza o LocalStorage e exibe os dados atualizados na tabela
    SetLocalStorage(CustomerData);
    ShowData(CustomerData);

    // Remove o evento de salvar edições e adiciona o evento de salvar novo cliente novamente
    saveButton.removeEventListener("click", SaveEditedData);
    saveButton.addEventListener("click", SaveData);

    // Fecha o modal após salvar as edições
    CloseModal();
  });

  OpenModal(); // Abre o modal para editar os dados
};

// Função para excluir um cliente da lista
const DeleteData = (event) => {
  const index = event.target.getAttribute("data-index"); // Pega o índice do cliente a ser excluído
  let CustomerData = GetLocalStorage(); // Obtém os dados do LocalStorage

  // Remove o cliente da lista e atualiza o LocalStorage
  CustomerData.splice(index, 1);
  SetLocalStorage(CustomerData);
  ShowData(CustomerData); // Atualiza a tabela com os dados restantes
};

// Carrega os dados do LocalStorage e exibe na tabela ao carregar a página
window.onload = () => {
  const CustomerData = GetLocalStorage();
  ShowData(CustomerData);
};

// Função para formatar o número de celular no padrão brasileiro enquanto o usuário digita
const FormatCellNumber = () => {
  const CleanValue = CustomerCellPhone.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  const NumbersArray = CleanValue.split(""); // Divide os números em um array
  let FormatNumber = "";

  // Adiciona parênteses no DDD
  if (NumbersArray.length > 0) {
    FormatNumber += `(${NumbersArray.slice(0, 2).join('')})`;
  }

  // Adiciona espaço e os primeiros dígitos do celular
  if (NumbersArray.length > 2) {
    FormatNumber += ` ${NumbersArray.slice(2, 7).join('')}`;
  }

  // Adiciona traço nos últimos dígitos
  if (NumbersArray.length > 7) {
    FormatNumber += `-${NumbersArray.slice(7, 11).join('')}`;
  }

  CustomerCellPhone.value = FormatNumber; // Atualiza o campo com o número formatado
};

// Adiciona o evento de formatação ao campo de celular enquanto o usuário digita
CustomerCellPhone.addEventListener("input", FormatCellNumber);
