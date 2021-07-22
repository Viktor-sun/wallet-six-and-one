import axios from 'axios';
import {
  MODAL_IS_OPEN,
  ADD_NEW_TRANSACTION_SUCCES,
  ADD_NEW_TRANSACTION_REQUEST,
  ADD_NEW_TRANSACTION_ERROR,
} from './modalTransactionActions';
import transactionOperations from '../transactions/transactionOperations';
import notification from '../../helpers/react-toastify';
import transitions from '@material-ui/core/styles/transitions';

export const modalTrancactionIsOpen = modalState => async dispatch => {
  dispatch(MODAL_IS_OPEN(modalState));
};

export const addTrancaction = transaction => async dispatch => {
  const result = {
    year: transaction.year,
    month: transaction.month,
    day: transaction.day,
    type: transaction.checkBox ? 'DEPOSIT' : 'WITHDRAW',
    category: transaction.category,
    comment: transaction.comment,
    amount: Number(transaction.transaction),
  };
  dispatch(ADD_NEW_TRANSACTION_REQUEST());
  try {
    await axios

      .post(`${axios.defaults.baseURL}/transactions`, result)
      .then(data => {
        dispatch(ADD_NEW_TRANSACTION_SUCCES(data.data.data.transaction));
        //update table online
        dispatch(transactionOperations.fetchTransactions());
        notification.sucess('Транзакция успешно добавлена');
      })
      .catch(er => console.log(er));
    // console.log(`${axios.defaults.baseURL}/transactions`);
  } catch (error) {
    console.log(error);
    dispatch(ADD_NEW_TRANSACTION_ERROR('Не удалось добавить'));
    notification.error('Что-то пошло не так!');
  }
};
