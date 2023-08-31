const apiKey = "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";

const maxImages = 4; // Quantidade de imagens que serão geradas 

let selectedImageNumber = null;

//função para gerar um número aleatório entre mínimo e máximo

function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//função para desativar o botão gerar durante o processamento

function disableGenerateButton(){
    document.getElementById(generate).disable = true;
}

//função para desativar o botão gerar depois do processo

function enableGenerateButton(){
    document.getElementById(generate).disable = false;
}

// Função para limpar a imagem da grade

function clearImageGrid() {
    const imageGrid = document.getElementById("image-grid");
    imageGrid.innerHTML = "";
}
}
//função para gerar imagens

async function generateImages(input) {
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];
    for (let i = 0; i < maxImages; i++) {
        // Gera um número aleatório entre 1 e 100 e anexe-o ao campo de busca

        const randomNumber = getRandomNumber(1, 10000);
        const prompt = `${input} ${randomNumber}`;
        // Adicionamos um número aleatório ao prompt para criar resultados diferentes
        const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({ inputs: prompt }),
            }
        );
    
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);
    
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // Reset selected image number
}


document.getElementById("generate").addEventListener('click', () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
    const link = document.createElement("a");
    link.href = imgUrl;
    //Coloca o nome do arquivo baseado na imagem selecionada
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}