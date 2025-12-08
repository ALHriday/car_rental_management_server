
const calculateNumberOfDay = (startTime: Date, endTime: Date) => {

    const startDate = new Date(startTime).getTime();
    const endDate = new Date(endTime).getTime();

    const result = endDate - startDate;
    const numberOfDays = Math.ceil(result / (1000 * 60 * 60 * 24));

    return numberOfDays;
};

export default calculateNumberOfDay;