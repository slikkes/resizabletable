const tableCreator = {
    createTHead() {
        const thead = document.querySelector("#datatable thead")
        const tr = document.createElement('tr')
        for (const key of Object.keys(this.data[0])) {
            const th = document.createElement('th')
            const div = document.createElement('div')
            div.innerText = key
            th.append(div)
            tr.append(th)
        }
        thead.append(tr)
    },
    createTBody() {
        const tbody = document.querySelector("#datatable tbody")
        for (const item of this.data) {
            const tr = document.createElement('tr')
            for (const [key, value] of Object.entries(item)) {
                const td = document.createElement('td')
                td.innerText = value
                tr.append(td)
            }
            tbody.append(tr)
        }
    },
    data: [
        {
            "id": 1,
            "first_name": "Ronnie",
            "last_name": "Oaks",
            "email": "roaks0@theguardian.com",
            "ip_address": "166.152.73.120",
        },
        {
            "id": 2,
            "first_name": "Scotti",
            "last_name": "Lile",
            "email": "slile1@w3.org",
            "ip_address": "24.207.12.16",
        },
        {
            "id": 3,
            "first_name": "Genna",
            "last_name": "Sexstone",
            "email": "gsexstone2@mashable.com",
            "ip_address": "74.247.146.79",
        },
        {
            "id": 4,
            "first_name": "Juliann",
            "last_name": "McLewd",
            "email": "jmclewd3@gnu.org",
            "ip_address": "153.162.236.71",
        },
        {
            "id": 5,
            "first_name": "Bernie",
            "last_name": "Ondrich",
            "email": "bondrich4@upenn.edu",
            "ip_address": "250.221.234.141",
        }],

}
