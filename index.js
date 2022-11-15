'use strict';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

let vendor;

async function data(){
    vendor = await fetch(`https://op.fd-api.com/api/v5/vendors/${id}?include=menus,bundles,multiple_discounts,payment_types&language_id=7&dynamic_pricing=0&opening_type=delivery&basket_currency=SEK`).then((res) => res.json());
    console.log(vendor);
    render();
}

function render(){
    const data = document.getElementById('data');

    const download = document.createElement('a');
    download.innerHTML = 'download';

    data.append(download);

    const map = document.getElementById('map');
    map.src= `//maps.google.com/maps?q=${vendor.data.latitude},${vendor.data.longitude}&z=15&output=embed`

    const name = document.createElement('h1');
    name.innerHTML = vendor.data.name;
    const adress = document.createElement('p');
    adress.innerHTML = vendor.data.address;
    const city = document.createElement('p');
    city.innerHTML = vendor.data.city.name;
    const isBest = document.createElement('p');
    isBest.innerHTML = "Best in city: " + vendor.data.is_best_in_city;
    const isBusy = document.createElement('p');
    isBusy.innerHTML = "Is busy: " + vendor.data.is_busy;
    const isPromoted = document.createElement('p');
    isBusy.innerHTML = "Is promoted: " + vendor.data.is_promoted;

    data.append(name);
    data.append(city);
    data.append(adress);
    data.append(isBest);
    data.append(isBusy);

    const table = document.createElement('table');


    const categories = Object.getOwnPropertyNames(vendor.data);

    const specialDays = document.createElement('div');
    specialDays.id = 'special-day';
    for(const day of vendor.data.special_days){
        const card = document.createElement('div');
        card.className = 'card';
        const type = document.createElement('p');
        type.innerHTML = day.opening_type;
        const start = document.createElement('p');
        start.innerHTML = day.date + " " + day.opening_time
        const end = document.createElement('p');
        end.innerHTML = day.end_date + " " + day.closing_time
        
        card.append(type);
        card.append(start);
        card.append(end);
        specialDays.append(card);
    }
    data.append(specialDays);

    for(const category of vendor.data.menus[0].menu_categories){
        const div = document.createElement('div');
        const innerDiv = document.createElement('table');
        const col = document.createElement('tr')
        innerDiv.id = 'table';

        const p = document.createElement('p');
        p.innerHTML = category.description;
        
        const c = document.createElement('h1');
        c.innerText = category.name;

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

        for(const product of category.products){
            
            const cell = document.createElement('th');
            const div = document.createElement('div');
            div.className = 'card';
            const title = document.createElement('h3');
            title.innerHTML = product.name;
            const img = document.createElement('img');
            img.src = product.logo_path;
            const description = document.createElement('p');
            description.innerHTML = product.description;
            const price = document.createElement('p');
            price.innerHTML = product.product_variations[0].price + 'sek';
            
            div.append(title);
            div.append(img);
            div.append(description);
            div.append(price);
            cell.append(div);
            col.append(cell);
        }
    }

    download.href= `./download.html?id=${id}`

    data.append(table);
}

data();



