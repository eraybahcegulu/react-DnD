import moment from 'moment';

const dateNow = () => {
    const dateNow = moment().format('YYYY-MM-DD HH:mm:ss');
    return dateNow;
};

export { dateNow };