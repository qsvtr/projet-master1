

window.addEventListener('load', async () => {
    const params = getUrlVars();
    console.log(params)
    if (!params.id || !params.key) {
        console.log('verify url parameters')
        $('#error').html('verify url parameters')
    } else {
        await getToken(params.id, params.key)
    }
})
