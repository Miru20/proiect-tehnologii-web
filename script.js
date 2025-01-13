document.addEventListener('DOMContentLoaded', () => {
    const orasSelect = document.getElementById('oras-select');
    const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const form = document.getElementById('search-form');
    const tabelContainer = document.getElementById('tabel-container');
    const graficContainer = document.getElementById('grafic-container');
    const chartCanvas = document.getElementById('indice-chart');
    const explicatieDiv = document.getElementById('explicatie-indice');
    let chart;

    const oraseDisponibile = [
        "Alba Iulia", "Arad", "Pitesti", "Bacau", "Onesti", "Oradea", "Bistrita", "Botosani", "Braila", "Brasov", "Buzau", "Calarasi", "Resita", "Cluj-Napoca", "Turda", "Constanta", "Sfantu Gheorghe", "Targoviste", "Craiova", "Galati", "Giurgiu", "Targu Jiu", "Miercurea Ciuc", "Deva", "Hunedoara", "Slobozia", "Iasi", "Baia Mare", "Drobeta-Turun Severin", "Targu Mures", "Piatra Neamt", "Roman", "Slatina", "Ploiesti", "Zalau", "Satu Mare", "Sibiu", "Medias", "Suceava", "Alexandria", "Timisoara", "Tulcea", "Ramnicu Valcea", "Vaslui", "Barlad", "Focsani"
    ];

    oraseDisponibile.forEach(oras => {
        const option = document.createElement('option');
        option.value = oras;
        option.textContent = oras;
        orasSelect.appendChild(option);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedOras = orasSelect.value;

        fetch(`/api/cauta-oras?oras=${selectedOras}`)
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    alert(`Date pentru orașul "${selectedOras}" nu au fost găsite.`);
                    return;
                }

                tabelContainer.style.display = 'block';
                populateTable(data);

                const labels = ['2010', '2011', '2012', '2013', '2014', '2015', '2016'];
                const values = [
                    data[0].an_2010, data[0].an_2011, data[0].an_2012,
                    data[0].an_2013, data[0].an_2014, data[0].an_2015, data[0].an_2016
                ];
                graficContainer.style.display = 'block';
                createChart(labels, values);
                displayExplicatieIndice(values);
            })
            .catch(err => console.error('Eroare:', err));
    });

    function populateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            Object.values(row).forEach(val => {
                const td = document.createElement('td');
                td.textContent = val || 'N/A';
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    function createChart(labels, data) {
        if (chart) chart.destroy();
        chart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Indice Cultural',
                    data: data,
                    borderColor: 'rgba(138, 43, 226, 1)',
                    backgroundColor: 'rgba(138, 43, 226, 0.2)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    function displayExplicatieIndice(values) {
        const suma = values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
        explicatieDiv.style.display = 'block';
        explicatieDiv.innerHTML = `
            <h3>Interpretare:</h3>
            <p>
                ${suma > 0 
                    ? "Orașul selectat are, in medie, un indice cultural pozitiv, ceea ce indică faptul că acesta este dezvoltat din punct de vedere cultural."
                    : "Orașul selectat are, in medie, un indice cultural negativ, ceea ce ar putea indica o activitate culturală mai redusă sau un potențial neexploatat."
                }
            </p>
        `;
    } 
});