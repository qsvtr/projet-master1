const getUrlVars = () => {
    const search = location.search.substring(1);
    return search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
}

const getToken = async (id, key) => {
    $('#loading').html(`<p>loading...</p>`)
    fetch("http://localhost:8080/api/getNFT", {method: "POST", headers: new Headers({'content-type': 'application/json'}), body: JSON.stringify( {id: id, key: key} )})
        .then(res => res.json())
        .then(data => {
            $('#loading').html('')
            const metadata = data.data
            console.log(data);
            $('#qrcodeText').html("Scan another!")
            if(data.message !== 'success') {
                $('#error').append(`<h2 style="color: red">${data.message}</h2>`)
            } else {
                $('#content').append('<div class="alert alert-success"><strong>Success!</strong> this diploma is authentic!</div><br>')
                $('#content').append(`<h2 style="">${metadata.name}</h2>`)
                $('#content').append(`<img class="logo" style="height: auto;" src=${metadata.image} alt='logo'/>`)
                $('#content').append(`<h2 style="">${metadata.description}</h2>`)
                $('#content').append(`<p style=""><strong>${metadata.attributes.lastname}</strong> <strong>${metadata.attributes.firstname}</strong> born on <strong>${metadata.attributes.birthdate}</strong></p>`)
            }
        })
        .catch(error => {
            $('#loading').html('')
            $('#error').append(`<h2 style="color: red">fatal error</h2>`)
            console.log('error', error)
        })
}
