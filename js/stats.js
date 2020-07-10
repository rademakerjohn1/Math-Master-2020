document.addEventListener("DOMContentLoaded", function (event) {
    var stats = JSON.parse(window.localStorage.getItem('stats')) || [];
    window.localStorage.setItem('stats', JSON.stringify(stats));
    if (stats.length !== 0) renderTable(stats)
    else renderMessage();
    function convertOperator(item) {
        switch (item.operation) {
            case ("+"):
                return item.operation = "Addition";
            case ("-"):
                return item.operation = "Subtraction";
            case ("*"):
                return item.operation = "Multiplication";
            case ("/"):
                return item.operation = "Division"
            case ("mixed"):
                return item.operation = "Mixed"
        }
    }
    function renderTable(storage) {
        document.getElementById("heading").innerHTML = "User Statistics";
        // create wrapper
        let wrapper = document.createElement("div");
        wrapper.classList.add("table-responsive-lg");
        document.getElementById("main").append(wrapper);
        // create table element
        let table = document.createElement("table");
        table.classList.add("table", "table-striped", "table-hover");
        wrapper.append(table);
        // create thead
        let tableHeader = document.createElement("thead");
        table.append(tableHeader);
        let tableHeaderRow = document.createElement("tr")
        tableHeader.append(tableHeaderRow);
        renderTableHeader(storage, tableHeaderRow)
        // create table body
        let tableBody = document.createElement("tbody");
        table.append(tableBody);
        renderTableBody(storage, tableBody)
        // create button
       renderClearButton(wrapper)
    }

    function renderTableBody(data, tbody) {
        data.forEach((item) => {
            convertOperator(item);
            console.log(item.operation);
            if (Number.isInteger(item.score)) item.score = `${item.score}%`;
            item.difficulty = capitalizeFirst(item.difficulty);
            item.user = item.user.toUpperCase();
            let tableBodyRow = document.createElement("tr")
            let obj = Object.values(item);
            obj.forEach((value) => {
                let tableData = document.createElement("td");
                tableData.textContent = value;
                tableBodyRow.append(tableData)
            })
            tbody.prepend(tableBodyRow);
        })
    }
    function renderTableHeader(data, headerRow) {
        let keys = Object.keys(data[0]);
        keys.forEach(category => {
            let heading = document.createElement("th");
            heading.textContent = capitalizeFirst(category);
            headerRow.append(heading);
        });
    }
    function renderClearButton(parent) {
        let clearButton = document.createElement("button");
        clearButton.textContent = "Clear Statistics";
        clearButton.classList.add("btn-primary");
        parent.append(clearButton);
        clearButton.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.clear();
            parent.style.display = "none";
            renderMessage();
        })
    }
    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function renderMessage() {
        document.getElementById("heading").innerHTML = "Play the game to add statistics!";
    }
})