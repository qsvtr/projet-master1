window.addEventListener('load', async () => {
    const params = getUrlVars();
    if (!params.id || !params.key) {
        console.log('verify url parameters')
        $('#error').html('verify url parameters')
    } else {
        await getToken(params.id, params.key)
    }
})
