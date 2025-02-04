import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import transactionOperations from '../redux/transactions/transactionOperations';
import transactionSelectors from '../redux/transactions/transactionSelectors';
import styles from './componentsCSS/Pagination.module.css';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

export default function Pagination() {
  const dispatch = useDispatch();
  const result = useSelector(transactionSelectors.getAllTransactions);

  const pageCount = Math.ceil(result.totalDocs / result.limit);
  const changePage = ({ selected }) => {
    selected = selected + 1;
    dispatch(transactionOperations.fetchTransactions(selected));
  };

  return (
    <div className={styles.paginationContainer}>
      <ReactPaginate
        previousLabel={<KeyboardArrowLeft fontSize="small" />}
        nextLabel={<KeyboardArrowRight fontSize="small" />}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={styles.paginationBttns}
        previousLinkClassName={styles.previousBttn}
        nextLinkClassName={styles.nextBttn}
        disabledClassName={styles.paginationDisabled}
        activeClassName={styles.paginationActive}
      />
    </div>
  );
}
