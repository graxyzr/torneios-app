let participantes = [];
let limiteParticipantes = 0;

function iniciarRegistro() {

    const quantidade = parseInt(document.getElementById('quantidadeParticipantes').value);

    if (!isNaN(quantidade) && quantidade > 0) {

        limiteParticipantes = quantidade;
        document.getElementById('quantidadeParticipantes').disabled = true;
        document.getElementById('registroParticipantes').style.display = 'block';

    }

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

carregarParticipantes();