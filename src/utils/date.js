const unixToDate = (unix) => {
    let date = new Date(unix * 1000);
    // return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}

module.exports = unixToDate;