let englishWords = [];
let translateWords = [];



document.querySelectorAll(".englishWord").forEach((div, index) => {
    englishWords.push(div.innerText);
});

document.querySelectorAll(".translateWord").forEach((div, index) => {
    translateWords.push(div.innerText);
});


document.querySelectorAll(".deleteWord").forEach((item, index) => {
    deleteWord(item, index)

})


 function deleteWord(item, index) {
    item.addEventListener("click", async (e) => {
       try {
        const [En, Tn] = [englishWords[index], translateWords[index]]
        const value = ({
            englishWord:En,
            translateWords: Tn
        })
        
        await fetch('/delete-word',{
            headers: {
                'Content-Type':'application/json',
            },
            method: "DELETE",
            body: JSON.stringify(value)
        });
       } catch (error) {
        
       }

    })
}