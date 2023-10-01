// addEventListener para o botão "Confirmar" que inicia o cadastro dos times
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

        const confirmarNomesBtn = document.createElement("button");
        confirmarNomesBtn.type = "button";
        confirmarNomesBtn.id = "confirmarNomes";
        camposNomesDiv.appendChild(document.createElement("br"));
        confirmarNomesBtn.classList.add("confirmarQuantidade"); // Adiciona a classe de estilo ao botão
        confirmarNomesBtn.textContent = "Iniciar";

        nomesJogadoresDiv.appendChild(confirmarNomesBtn);

        nomesJogadoresDiv.classList.remove("hidden");
        document.getElementById("torneioForm").classList.add("hidden");
        document.getElementById("torneioForm").style.display = "none";


        // addEventListener para o botão "Iniciar" que começa a gerar as partidas
        confirmarNomesBtn.addEventListener("click", function () {
            const camposNomeInputs = camposNomesDiv.querySelectorAll("input");
            const nomes = Array.from(camposNomeInputs).map(input => input.value);

            localStorage.setItem("nomesJogadores", JSON.stringify(nomes));

            // Gerar partidas baseado nos times
            const partidas = generateMatches(nomes);

            // Exibir as partidas numa tabela
            const partidasTable = document.getElementById("partidasTable");
            partidasTable.innerHTML = ""; // limpar a tabela

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
        });
    }
});

// Gera combinações possíveis de times
function generateCombinations(teams) {
    const combinations = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            combinations.push([teams[i], teams[j]]);
        }
    }
    return combinations;
}

// Gera partidas baseado nas combinações de times
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

// Adicionar um evento de clique ao botão "Calcular Pontuação"
document.getElementById("calcularPontuacaoBtn").addEventListener("click", function () {
    const partidasTable = document.getElementById("partidasTable");
    const resultadoDiv = document.getElementById("resultadoDiv");

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
    vencedorTexto.classList.add("vencedor-text");
    resultadoDiv.appendChild(vencedorTexto);
});

// Event listener para o botão "Carregar"
document.getElementById("carregar").addEventListener("click", function () {

    const camposNomeInputs = document.querySelectorAll("input[type='text']");
    const storedNomes = JSON.parse(localStorage.getItem("nomesJogadores"));

    if (storedNomes && Array.isArray(storedNomes) && storedNomes.length > 0) {
        storedNomes.forEach((nomes, index) => {
            if (index < camposNomeInputs.length) {
                camposNomeInputs[index].value = nome;
            }
        });
    }


    // Recupere os dados do Local Storage
    const nomesJogadores = JSON.parse(localStorage.getItem("nomesJogadores"));

    if (nomesJogadores) {
        const dadosJogadoresTable = document.getElementById("dadosJogadoresTable");
        dadosJogadoresTable.innerHTML = ""; // Limpe o conteúdo da tabela

        // Crie uma linha de cabeçalho para a tabela
        const cabecalhoRow = dadosJogadoresTable.insertRow();
        cabecalhoRow.innerHTML = "<th>Time</th><th>Nome do Jogador/Time</th>";

        // Preencha a tabela com os dados recuperados
        nomesJogadores.forEach((nome, index) => {
            const row = dadosJogadoresTable.insertRow();
            row.innerHTML = `<td>Time ${index + 1}</td><td><input type="text" value="${nome}" readonly></td>`;
        });

        // Preencha os campos de input com os nomes armazenados no localStorage
        camposNomeInputs.forEach((input, index) => {
            if (index < storedNomes.length) {
                input.value = storedNomes[index];
            }
        });

        // Exiba a tabela
        document.getElementById("nomesJogadores").classList.remove("hidden");
    } else {
        // Se os dados não foram encontrados no Local Storage, exiba uma mensagem de erro ou trate de outra forma apropriada
        alert("Os dados não foram encontrados no Local Storage.");
    }
});

