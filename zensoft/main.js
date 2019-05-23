document.getElementById('form').addEventListener('submit', onSubmit, false);

function onSubmit(event) {
    event.preventDefault();
    let inputFile = document.getElementById('input');
    let patternsFile = document.getElementById('patterns');

    if (!inputFile.value) {
        alert('Выберите input file');
        return false;
    }
    if (!patternsFile.value) {
        alert('Выберите patterns file');
        return false;
    }

    const promises = [];
    promises.push(readFile(inputFile));
    promises.push(readFile(patternsFile));

    Promise.all(promises).then(function ([inputLines, patternsLines]) {
        const searchPattern = patternsLines[0];

        const tableBody = document.querySelector('#table > tbody');
        const mode = Number(document.querySelector('input[name="mode"]:checked').value);

        let bodyHtml = '';
        let counter = 0;
        console.log(mode);
        for (let line of inputLines) {
            counter++;
            // Полное совпадение
            if (mode === 1 && line === searchPattern) {
                bodyHtml += `
                    <tr>
                    <td>${counter++}</td>
                    <td>${line}</td>
                    </tr>
                `;
                // Частичное совпадение
            } else if (mode === 2 && line.indexOf(searchPattern) !== -1) {
                bodyHtml += `
                    <tr>
                    <td>${counter++}</td>
                    <td>${line}</td>
                    </tr>
                `;
            }
        }
        tableBody.innerHTML = bodyHtml;
    }, function (err) {
        // error occurred
    });
}

function readFile(target) {
    return new Promise(function (resolve, reject) {
        let files = target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.onload = function (event) {
            let lines = event.target.result.split('\n');
            resolve(lines);
        };
        reader.readAsText(file)
    });
}