function AddDay(date,add=1) {

    let parts = date.split('/');
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // index fron 0
    let year = parseInt(parts[2], 10);


    let dateObj = new Date(year, month, day);


    dateObj.setDate(dateObj.getDate() + add);


    let newDay = dateObj.getDate().toString().padStart(2, '0');
    let newMonth = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // 0 index
    let newYear = dateObj.getFullYear().toString().slice(-2);

    return newDay+'/'+newMonth+'/'+newYear;
}
module.exports = {AddDay}