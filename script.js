"use strict";

/*
 * ==========================================
 * ACESSIBILIDADE DA PÁGINA
 * ==========================================
 */

const corpo = document.body;

const aumentarFonte = document.getElementById("aumentarFonte");
const diminuirFonte = document.getElementById("diminuirFonte");

const botaoContraste = document.getElementById("contraste");
const botaoModoEscuro = document.getElementById("modoEscuro");

const botaoLerTexto = document.getElementById("lerTexto");
const botaoPararLeitura = document.getElementById("pararLeitura");

const conteudo = document.getElementById("conteudo");


/*
 * ==========================================
 * TAMANHO DA FONTE
 * ==========================================
 */

let tamanhoFonte = 18;

function atualizarFonte() {
    document.documentElement.style.setProperty(
        "--tamanho-base",
        `${tamanhoFonte}px`
    );
}

aumentarFonte.addEventListener("click", function () {
    if (tamanhoFonte < 30) {
        tamanhoFonte += 2;
        atualizarFonte();
    }
});

diminuirFonte.addEventListener("click", function () {
    if (tamanhoFonte > 14) {
        tamanhoFonte -= 2;
        atualizarFonte();
    }
});


/*
 * ==========================================
 * ALTO CONTRASTE
 * ==========================================
 */

botaoContraste.addEventListener("click", function () {
    const ativado = corpo.classList.toggle("alto-contraste");

    botaoContraste.setAttribute(
        "aria-pressed",
        ativado.toString()
    );
});


/*
 * ==========================================
 * MODO ESCURO
 * ==========================================
 */

botaoModoEscuro.addEventListener("click", function () {
    const ativado = corpo.classList.toggle("modo-escuro");

    botaoModoEscuro.setAttribute(
        "aria-pressed",
        ativado.toString()
    );
});


/*
 * ==========================================
 * LEITURA DO TEXTO EM VOZ ALTA
 * ==========================================
 *
 * Utiliza a API SpeechSynthesis do navegador.
 * O recurso depende do suporte do navegador
 * e das vozes instaladas no dispositivo.
 */

function obterTextoParaLeitura() {
    return conteudo.innerText;
}

function lerTexto() {

    if (!("speechSynthesis" in window)) {
        alert(
            "Seu navegador não oferece suporte à leitura de texto em voz alta."
        );

        return;
    }

    // Interrompe uma leitura anterior.
    window.speechSynthesis.cancel();

    const texto = obterTextoParaLeitura();

    const fala = new SpeechSynthesisUtterance(texto);

    // Português do Brasil.
    fala.lang = "pt-BR";

    // Velocidade confortável para leitura.
    fala.rate = 0.9;

    // Tom padrão.
    fala.pitch = 1;

    fala.onstart = function () {
        botaoLerTexto.setAttribute("aria-pressed", "true");
        botaoLerTexto.textContent = "🔊 Lendo...";
    };

    fala.onend = function () {
        botaoLerTexto.setAttribute("aria-pressed", "false");
        botaoLerTexto.textContent = "🔊 Ler texto";
    };

    fala.onerror = function () {
        botaoLerTexto.setAttribute("aria-pressed", "false");
        botaoLerTexto.textContent = "🔊 Ler texto";
    };

    window.speechSynthesis.speak(fala);
}

botaoLerTexto.addEventListener("click", lerTexto);


/*
 * ==========================================
 * PARAR LEITURA
 * ==========================================
 */

botaoPararLeitura.addEventListener("click", function () {

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    botaoLerTexto.setAttribute("aria-pressed", "false");
    botaoLerTexto.textContent = "🔊 Ler texto";
});


/*
 * ==========================================
 * TECLA ESC PARA PARAR A LEITURA
 * ==========================================
 */

document.addEventListener("keydown", function (evento) {

    if (evento.key === "Escape") {

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        botaoLerTexto.setAttribute("aria-pressed", "false");
        botaoLerTexto.textContent = "🔊 Ler texto";
    }
});


/*
 * ==========================================
 * RESTAURAR CONFIGURAÇÕES COM CTRL + 0
 * ==========================================
 *
 * Atalho útil para usuários que aumentaram
 * ou diminuíram muito o tamanho do texto.
 */

document.addEventListener("keydown", function (evento) {

    if (evento.ctrlKey && evento.key === "0") {

        evento.preventDefault();

        tamanhoFonte = 18;

        atualizarFonte();
    }
});
