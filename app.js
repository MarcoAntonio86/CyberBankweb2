let banco = {
    usuarios: [],
    usuarioLogado: null,
    extrato: ""
};

function showLoginForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Logar</h2>
        <label>CPF (apenas números):</label>
        <input type="text" id="cpf"><br>
        <label>Senha:</label>
        <input type="password" id="senha"><br>
        <button onclick="login()">Logar</button>
    `;
}

function login() {
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    const usuario = banco.usuarios.find(user => user.cpf === cpf && user.senha === senha);

    if (usuario) {
        banco.usuarioLogado = usuario;
        alert("Login realizado com sucesso!");
        document.getElementById('form-container').innerHTML = '';
    } else {
        alert("CPF ou senha incorretos.");
    }
}

function showRegisterForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Cadastrar Usuário</h2>
        <label>Nome:</label>
        <input type="text" id="nome"><br>
        <label>CPF (apenas números):</label>
        <input type="text" id="cpf"><br>
        <label>Senha:</label>
        <input type="password" id="senha"><br>
        <label>Saldo Inicial:</label>
        <input type="number" id="saldo"><br>
        <button onclick="cadastrarUsuario()">Cadastrar</button>
    `;
}

function cadastrarUsuario() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const saldo = parseFloat(document.getElementById('saldo').value);
    
    if (nome && cpf && senha && saldo >= 0) {
        const chequeI = saldo * 4;
        const usuario = { nome, cpf, senha, saldo, chequeEspecial: chequeI, chequeInicial: chequeI };
        banco.usuarios.push(usuario);
        alert("Usuário cadastrado com sucesso!");
        document.getElementById('form-container').innerHTML = '';
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

function showDepositForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Depositar</h2>
        <label>Valor do depósito:</label>
        <input type="number" id="valor"><br>
        <button onclick="depositar()">Depositar</button>
    `;
}

function depositar() {
    const valor = parseFloat(document.getElementById('valor').value);
    
    if (banco.usuarioLogado) {
        if (valor > 0) {
            banco.usuarioLogado.saldo += valor;
            banco.extrato += `Depósito: R$ ${valor.toFixed(2)}\n`;
            alert("Depositado com sucesso!");
            document.getElementById('form-container').innerHTML = '';
        } else {
            alert("Valor inválido.");
        }
    } else {
        alert("Faça login primeiro para realizar um depósito.");
    }
}

function showWithdrawForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Sacar</h2>
        <label>Valor do saque:</label>
        <input type="number" id="valor"><br>
        <button onclick="sacar()">Sacar</button>
    `;
}

function sacar() {
    const valor = parseFloat(document.getElementById('valor').value);
    
    if (banco.usuarioLogado) {
        if (valor > 0 && valor <= banco.usuarioLogado.saldo + banco.usuarioLogado.chequeEspecial) {
            banco.usuarioLogado.saldo -= valor;
            banco.extrato += `Saque: R$ ${valor.toFixed(2)}\n`;
            alert("Saque realizado com sucesso!");
            document.getElementById('form-container').innerHTML = '';
        } else {
            alert("Valor de saque excede o saldo e o limite do cheque especial.");
        }
    } else {
        alert("Faça login primeiro para realizar um saque.");
    }
}

function showStatement() {
    const formContainer = document.getElementById('form-container');
    if (banco.usuarioLogado) {
        formContainer.innerHTML = `
            <h2>Extrato</h2>
            <p>Saldo atual: R$ ${banco.usuarioLogado.saldo.toFixed(2)}</p>
            <p>Cheque Especial disponível: R$ ${banco.usuarioLogado.chequeEspecial.toFixed(2)}</p>
            <pre>${banco.extrato}</pre>
        `;
    } else {
        alert("Faça login primeiro para visualizar o extrato.");
    }
}

function showTransferForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Transferir</h2>
        <label>CPF do Destinatário (apenas números):</label>
        <input type="text" id="cpf_destino"><br>
        <label>Valor da Transferência:</label>
        <input type="number" id="valor"><br>
        <button onclick="transferir()">Transferir</button>
    `;
}

function transferir() {
    const cpf_destino = document.getElementById('cpf_destino').value;
    const valor = parseFloat(document.getElementById('valor').value);
    
    if (banco.usuarioLogado) {
        const destinatario = banco.usuarios.find(user => user.cpf === cpf_destino);
        if (destinatario && valor > 0 && valor <= banco.usuarioLogado.saldo + banco.usuarioLogado.chequeEspecial) {
            banco.usuarioLogado.saldo -= valor;
            destinatario.saldo += valor;
            banco.extrato += `Transferência: R$ ${valor.toFixed(2)} para CPF: ${cpf_destino}\n`;
            alert(`Transferência de R$ ${valor.toFixed(2)} realizada com sucesso para o CPF: ${cpf_destino}.`);
            document.getElementById('form-container').innerHTML = '';
        } else {
            alert("Valor de transferência inválido ou saldo insuficiente.");
        }
    } else {
        alert("Faça login primeiro para realizar uma transferência.");
    }
}

function logout() {
    banco.usuarioLogado = null;
    alert("Você saiu da sua conta.");
    document.getElementById('form-container').innerHTML = '';
}
