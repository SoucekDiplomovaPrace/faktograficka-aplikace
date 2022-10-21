
const getMessage = (req) => {
    let success = req.flash('success')
    let warning = req.flash('warning')
    let error = req.flash('error')

    let messageHtmlClass = ''
    let message = ''
    
    if (success.length !== 0) {
        messageHtmlClass = 'text-success'
        message = success
    } else if (warning.length !== 0) {
        messageHtmlClass = 'text-warning'
        message = warning
    } else if (error.length !== 0) {
        messageHtmlClass = 'text-danger'
        message = error
    }

    let messageObj = 
        {
            message: message,
            messageHtmlClass: messageHtmlClass
        }

    return messageObj
}

module.exports = {
    getMessage
}