var integration = {}

integration.alert = function (title, data) {
    try {
        Android.showAlert(title, data)
    } catch (e) {
        console.log(e)
    }
}












