let confirmarNomesBtn;
let salvarProgressoBtn; // Adicione esta linha

// Função para gerar combinações possíveis de times
function generateCombinations(teams) {
    const combinations = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            combinations.push([teams[i], teams[j]]);
        }
    }
    return combinations;
}

// Função para gerar partidas baseadas nas combinações de times
function generateMatches(teams) {
    let nomes = teams;

    // Verificar se os nomes já estão no localStorage
    const storedNomes = JSON.parse(localStorage.getItem("nomesJogadores"));
    if (storedNomes && Array.isArray(storedNomes) && storedNomes.length > 0) {
        nomes = storedNomes;
    }

    const combinations = generateCombinations(nomes);
    const matches = combinations.map(combination => {
        return {
            homeTeam: combination[0],
            awayTeam: combination[1]
        };
    });
    return matches;
}

// Event listener para o botão "Confirmar" que inicia o cadastro dos times
document.getElementById("confirmarQuantidade").addEventListener("click", function () {
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const nomesJogadoresDiv = document.getElementById("nomesJogadores");

    if (!isNaN(quantidade) && quantidade >= 1) {
        nomesJogadoresDiv.innerHTML = "";

        const camposNomesDiv = document.createElement("div");

        // Cria campos de input de times com base na quantidade inserida
        for (let i = 0; i < quantidade; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Nome do Time ${i + 1}`;
            input.required = true;
            camposNomesDiv.appendChild(input);

            // Duas quebras de linha para separar os campos
            camposNomesDiv.appendChild(document.createElement("br"));
            camposNomesDiv.appendChild(document.createElement("br"));
        }

        nomesJogadoresDiv.appendChild(camposNomesDiv);

        confirmarNomesBtn = document.createElement("button");
        confirmarNomesBtn.type = "button";
        confirmarNomesBtn.id = "confirmarNomes";
        confirmarNomesBtn.style.display = "block";
        confirmarNomesBtn.style.margin = "0 auto";
        camposNomesDiv.appendChild(document.createElement("br"));
        confirmarNomesBtn.classList.add("confirmarQuantidade"); // Adiciona a classe de estilo ao botão
        confirmarNomesBtn.textContent = "Iniciar";

        nomesJogadoresDiv.appendChild(confirmarNomesBtn);

        nomesJogadoresDiv.classList.remove("hidden");
        document.getElementById("torneioForm").classList.add("hidden");
        document.getElementById("torneioForm").style.display = "none";

        // Event listener para o botão "Iniciar" que começa a gerar as partidas
        confirmarNomesBtn.addEventListener("click", function () {
            const camposNomeInputs = camposNomesDiv.querySelectorAll("input");
            const nomes = Array.from(camposNomeInputs).map(input => input.value);
            confirmarNomesBtn.style.display = "none";

            localStorage.setItem("nomesJogadores", JSON.stringify(nomes));

            // Gerar partidas baseado nos times
            const partidas = generateMatches(nomes);

            // Exibir as partidas numa tabela
            const partidasTable = document.getElementById("partidasTable");
            partidasTable.innerHTML = ""; // Limpar a tabela

            partidas.forEach(partida => {
                const row = partidasTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);

                // Insere "x" entre os nomes dos times na tabela
                cell1.innerHTML = `${partida.homeTeam} x ${partida.awayTeam}`;

                // Adiciona um campo de seleção (dropdown) para o resultado da partida
                const resultadoSelect = document.createElement("select");
                resultadoSelect.id = `resultado-${partida.homeTeam}-${partida.awayTeam}`;

                // Opções de resultado (empate, vitória do time 1, vitória do time 2)
                const empateOption = document.createElement("option");
                empateOption.value = "Empate";
                empateOption.textContent = "Empate";
                resultadoSelect.appendChild(empateOption);

                const vitoriaTime1Option = document.createElement("option");
                vitoriaTime1Option.value = `Vitória de ${partida.homeTeam}`;
                vitoriaTime1Option.textContent = `Vitória de ${partida.homeTeam}`;
                resultadoSelect.appendChild(vitoriaTime1Option);

                const vitoriaTime2Option = document.createElement("option");
                vitoriaTime2Option.value = `Vitória de ${partida.awayTeam}`;
                vitoriaTime2Option.textContent = `Vitória de ${partida.awayTeam}`;
                resultadoSelect.appendChild(vitoriaTime2Option);

                cell2.appendChild(resultadoSelect);
            });

            const partidasDiv = document.getElementById("partidas");
            partidasDiv.classList.remove("hidden");
            partidasTable.insertAdjacentHTML("afterend", "<br></br>");
            camposNomesDiv.classList.add("hidden");
            confirmarNomesBtn.classList.add("hidden");

            // Salvar os dados dos jogos no localStorage
            localStorage.setItem("dadosJogos", JSON.stringify(partidas));

            // Mostrar o botão "Calcular Pontuação"
            const calcularPontuacaoBtn = document.getElementById("calcularPontuacaoBtn");
            calcularPontuacaoBtn.classList.remove("hidden");

            // Mostrar o botão "Salvar"
            salvarProgressoBtn = document.createElement("button");
            salvarProgressoBtn.type = "button";
            salvarProgressoBtn.id = "salvarProgresso";
            salvarProgressoBtn.textContent = "Salvar";
            partidasDiv.appendChild(salvarProgressoBtn);

            // Configurar o evento de clique do botão "Salvar"
            salvarProgressoBtn.addEventListener("click", salvarProgresso);

            // Configurar o evento de clique no botão "Carregar"
            const carregarBtn = document.getElementById("carregar");
            carregarBtn.addEventListener("click", function () {
                restaurarProgresso();
            });

        });
    }
});

// Event listener para o botão "Calcular Pontuação"
document.getElementById("calcularPontuacaoBtn").addEventListener("click", function () {
    const partidasTable = document.getElementById("partidasTable");
    const resultadoDiv = document.getElementById("resultadoDiv");
    const calcularPontuacaoBtn = document.getElementById("calcularPontuacaoBtn");
    document.getElementById("salvarProgresso").style.display = "none";
    calcularPontuacaoBtn.style.display = "none";
    partidasTable.style.display = "none";

    // Inicializar um objeto para rastrear a pontuação de cada time
    const pontuacao = {};

    // Loop através das linhas da tabela de partidas
    for (let i = 0; i < partidasTable.rows.length; i++) {
        const row = partidasTable.rows[i];
        const resultadoSelect = row.cells[1].getElementsByTagName("select")[0];
        const resultado = resultadoSelect.value;

        // Extrair os nomes dos times da célula da tabela
        const times = row.cells[0].innerText.split(" x ");
        const time1 = times[0];
        const time2 = times[1];

        // Determinar o resultado e atualizar a pontuação
        if (resultado === "Empate") {
            pontuacao[time1] = (pontuacao[time1] || 0) + 1;
            pontuacao[time2] = (pontuacao[time2] || 0) + 1;
        } else if (resultado === `Vitória de ${time1}`) {
            pontuacao[time1] = (pontuacao[time1] || 0) + 3;
        } else if (resultado === `Vitória de ${time2}`) {
            pontuacao[time2] = (pontuacao[time2] || 0) + 3;
        }
    }

    // Encontrar o time vencedor e ordenar a pontuação
    const timesOrdenados = Object.keys(pontuacao).sort((a, b) => pontuacao[b] - pontuacao[a]);
    const vencedor = timesOrdenados[0];

    // Limpar o conteúdo anterior do resultadoDiv
    resultadoDiv.innerHTML = "";

    // Exibir a pontuação e destacar o vencedor
    const tabelaPontuacao = document.createElement("table");
    tabelaPontuacao.classList.add("pontuacao-table");

    const cabecalho = tabelaPontuacao.createTHead();
    const cabecalhoRow = cabecalho.insertRow();
    const cabecalhoTimeCell = cabecalhoRow.insertCell();
    const cabecalhoPontuacaoCell = cabecalhoRow.insertCell();

    cabecalhoTimeCell.textContent = "Time";
    cabecalhoPontuacaoCell.textContent = "Pontuação";

    const corpoTabela = tabelaPontuacao.createTBody();
    timesOrdenados.forEach(time => {
        const row = corpoTabela.insertRow();
        const timeCell = row.insertCell();
        const pontuacaoCell = row.insertCell();

        timeCell.textContent = time;
        pontuacaoCell.textContent = pontuacao[time];

        if (time === vencedor) {
            timeCell.classList.add("vencedor");
            pontuacaoCell.classList.add("vencedor");
        }
    });

    resultadoDiv.appendChild(tabelaPontuacao);

    // Exibir o time vencedor
    const vencedorTexto = document.createElement("p");
    vencedorTexto.textContent = `Time Vencedor: ${vencedor}`;
    vencedorTexto.classList.add("vencedor-text", "centralizado");
    resultadoDiv.appendChild(vencedorTexto);
});

// Função para salvar o progresso no Local Storage
function salvarProgresso() {
    const resultadosPartidas = {};
    const partidasTable = document.getElementById("partidasTable");

    for (let i = 0; i < partidasTable.rows.length; i++) {
        const row = partidasTable.rows[i];
        const resultadoSelect = row.cells[1].getElementsByTagName("select")[0].value;
        const times = row.cells[0].innerText.split(" x ");

        resultadosPartidas[`${times[0]} x ${times[1]}`] = resultadoSelect;
    }

    localStorage.setItem("resultadosPartidas", JSON.stringify(resultadosPartidas));
}

function restaurarProgresso() {
    const resultadosPartidasSalvos = localStorage.getItem("resultadosPartidas");

    if (resultadosPartidasSalvos) {
        const resultadosPartidas = JSON.parse(resultadosPartidasSalvos);
        const partidasTable = document.getElementById("partidasTable");

        for (let i = 0; i < partidasTable.rows.length; i++) {
            const row = partidasTable.rows[i];
            const times = row.cells[0].innerText.split(" x ");
            const resultadoSelect = row.cells[1].getElementsByTagName("select")[0];

            // Verifique se há um resultado salvo para a partida e defina-o no dropdown
            const resultadoSalvo = resultadosPartidas[`${times[0]} x ${times[1]}`];
            if (resultadoSalvo) {
                resultadoSelect.value = resultadoSalvo;
            }
        }
    }
}

document.getElementById("carregar").addEventListener("click", () => {
    // Recupere as partidas salvas do Local Storage
    const savedMatches = JSON.parse(localStorage.getItem("dadosJogos"));

    // Verifique se há partidas salvas
    if (savedMatches && Array.isArray(savedMatches) && savedMatches.length > 0) {
        // Exiba as partidas na tela
        const partidasTable = document.getElementById("partidasTable");
        partidasTable.innerHTML = "";

        savedMatches.forEach(partida => {
            const row = partidasTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);

            cell1.innerHTML = `${partida.homeTeam} x ${partida.awayTeam}`;

            const resultadoSelect = document.createElement("select");
            resultadoSelect.id = `resultado-${partida.homeTeam}-${partida.awayTeam}`;
            const empateOption = document.createElement("option");
            empateOption.value = "Empate";
            empateOption.textContent = "Empate";
            resultadoSelect.appendChild(empateOption);

            const vitoriaTime1Option = document.createElement("option");
            vitoriaTime1Option.value = `Vitória de ${partida.homeTeam}`;
            vitoriaTime1Option.textContent = `Vitória de ${partida.homeTeam}`;
            resultadoSelect.appendChild(vitoriaTime1Option);

            const vitoriaTime2Option = document.createElement("option");
            vitoriaTime2Option.value = `Vitória de ${partida.awayTeam}`;
            vitoriaTime2Option.textContent = `Vitória de ${partida.awayTeam}`;
            resultadoSelect.appendChild(vitoriaTime2Option);

            cell2.appendChild(resultadoSelect);
        });
    }
});

document.getElementById("salvarProgresso").addEventListener("click", salvarProgresso);
