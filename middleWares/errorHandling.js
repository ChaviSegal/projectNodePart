export const errorHandling=(err, req, res, next) => {//רק ע"י 4 פרמרטים מזוהה כמידלוואר ללכידת שגיאות
    let statusCode = res.statusCode || 500;
    let message = err.message || "מצטערים התרחשה שגיאה"
    res.status(statusCode).send(message)
}