const getUrlVars = () => {
    const search = location.search.substring(1);
    return search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
}

const getToken = async (id, key) => {
    fetch("http://localhost:8080/api/getNFT", {method: "POST", body: JSON.stringify({id: id, key: key})})
        .then(res => {
            console.log("res:", res);
        })
        .catch(error => {
            console.log('error', error)
        })
}
