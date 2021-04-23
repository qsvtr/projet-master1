window.addEventListener('load', async () => {
    const params = getUrlVars();
    if (!params.id || !params.key) {
        console.log('verify url parameters')
        $('#error').html('Use the form or verify the url parameters')
    } else {
        await getToken(params.id, params.key)
    }
})
