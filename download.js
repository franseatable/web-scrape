'use strict';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

let vendor;

async function data(){
    vendor = await fetch(`https://op.fd-api.com/api/v5/vendors/${id}?include=menus,bundles,multiple_discounts,payment_types&language_id=7&dynamic_pricing=0&opening_type=delivery&basket_currency=SEK`).then((res) => res.json());
    render();
}

function render(){
    const data = document.getElementById('data');
    const table = document.createElement('table');
    const name = document.createElement('h1');
    name.innerHTML = vendor.data.name;
    for(const category of vendor.data.menus[0].menu_categories){
        for(const product of category.products){
            const tr = document.createElement('tr');
            const title = document.createElement('th');
            title.innerHTML = product.name;
            const description = document.createElement('th');
            description.innerHTML = product.description;
            const price = document.createElement('th');
            price.innerHTML = product.product_variations[0].price;
            const logo = document.createElement('th');
            logo.innerHTML = product.logo_path;
    
            tr.append(title);
            tr.append(description);
            tr.append(price);
            tr.append(logo);
            table.append(tr);
            data.append(table);
        }
    }

    tableToCSV(name.innerHTML);
    
    data.append(table);
}

function tableToCSV(title){
    let csv_data = [];

    let rows = document.getElementsByTagName('tr');
    for(let i = 0; i<rows.length; i++){
        let cols = rows[i].querySelectorAll('th');

        var csvrow = [];
        for(let j = 0; j<cols.length; j++){
            csvrow.push(cols[j].innerHTML.replace(new RegExp(',', 'g'), '-'));
        }

        csv_data.push(csvrow.join(','));
    }

    csv_data = csv_data.join('\n');

    downloadCSVFile(csv_data, title);
}

function downloadCSVFile(csv_data, title){
    let CSVFile = new Blob([csv_data], {type: "text/csv"});

    let temp_link = document.createElement('a');
    temp_link.download = `${title}.csv`;
    let url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    temp_link.style.display = "none";
    document.body.appendChild(temp_link);

    temp_link.click();
    document.body.removeChild(temp_link);
}

data();