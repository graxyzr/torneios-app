let participantes = [];
let limiteParticipantes = 0;

function iniciarRegistro() {
    var codigoHTML = `
  <div id="registroParticipantes" style="display: none;">
    <h2>Registro de Participantes</h2>
    <input type="text" id="nomeParticipante" placeholder="Insira o nome aqui">
    <button onclick="adicionarParticipante()">Adicionar</button>
  </div>
`;

    document.querySelector("#numeroParticipantes").innerHTML = codigoHTML;
    //const quantidade = parseInt(document.getElementById('quantidadeParticipantes').value);

    //if (!isNaN(quantidade) && quantidade > 0) {

    //    limiteParticipantes = quantidade;
    //document.getElementById('quantidadeParticipantes').disabled = true;
    //document.getElementById('registroParticipantes').style.display = 'block';

}




function carregarParticipantes() {

    const participantesSalvos = JSON.parse(localStorage.getItem('participantes'));
    if (participantesSalvos && participantesSalvos.length > 0) {
        participantes.push(...participantesSalvos);
        atualizarListaParticipantes();

    }

}


function adicionarParticipante() {

    if (limiteParticipantes === 0) {
        alert('Informe a quantidade de participantes.');
        return;
    }

    const nomeParticipante = document.getElementById('nomeParticipante').value;
    if (nomeParticipante.trim() !== '') {

        participantes.push({ nome: nomeParticipante, pontos: 0 });
        document.getElementById('nomeParticipante').value = '';
        atualizarListaParticipantes();

        localStorage.setItem('participantes', JSON.stringify(participantes));
        if (participantes.length >= limiteParticipantes) {

            document.getElementById('nomeParticipante').disabled = true;
            document.querySelector('button').disabled = true;

        }

        // Seleciona a div com o id "numeroParticipantes"
        var divNumeroParticipantes = document.getElementById("numeroParticipantes");

        // Define o estilo CSS para ocultar a div
        divNumeroParticipantes.style.display = "none";

    }

}


function atualizarListaParticipantes() {

    const listaParticipantes = document.getElementById('listaParticipantes');
    listaParticipantes.innerHTML = '';

    for (let i = 0; i < participantes.length; i++) {

        const participante = participantes[i];
        const li = document.createElement('li');
        li.textContent = participante.nome;
        listaParticipantes.appendChild(li);

    }

}

function limparFormulario() {

    document.getElementById("buttonInicio").reset();
    localStorage.clear();

}

document.getElementById("buttonInicio").addEventListener("click", limparFormulario);
carregarParticipantes();

mostrarOcultarDiv(id);
