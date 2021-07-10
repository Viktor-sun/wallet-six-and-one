import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FormControl, Modal, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import {
  modalTrancactionIsOpen,
  addTrancaction,
} from '../redux/modaltransaction/modalTransactionOperations';
import { IsModalTrasaction } from '../redux/modaltransaction/modalTransactionSelector';
import style from './componentsCSS/ModalAddTransaction.module.css';
import './componentsCSS/checkBox.css';

import { useFormik } from 'formik';
import * as Yup from 'yup';

const CssTextField = withStyles({
  root: {
    '& .MuiMenu': {
      top: '334px',
    },
    '& .MuiInputBase-input': {
      fontFamily: 'Circe-regular, sans-serif',
      fontSize: '18px',
      lineHeight: '1.5',
    },
    '& label': {
      fontFamily: 'Circe-regular, sans-serif',
      fontSize: '18px',
    },
    '& label.Mui-focused': {
      color: '#24cca7',
      fontFamily: 'Circe-regular, sans-serif',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#24cca7',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#bdbdbd',
    },
    '& .MuiInput-underline.Mui-error:after': {
      borderBottomColor: 'red',
    },
    '& .MuiFormHelperText-root.Mui-error': {
      fontFamily: 'Circe-regular, sans-serif',
      fontSize: '15px',
    },
  },
})(TextField);
const CssDate = withStyles({
  root: {
    border: 'none',
    '& .MuiInputBase-input': {
      fontFamily: 'Circe-regular, sans-serif',
      fontSize: '18px',
      lineHeight: '1.5',
      width: '220px',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#24cca7',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#bdbdbd',
    },
    '& .MuiInput-underline.Mui-error:after': {
      borderBottomColor: 'red',
    },
    '@media screen and (min-width: 768px) ': {
      '& .data': {
        width: '200px',
      },
    },
    '@media screen and (max-width: 767px) ': {
      '& .MuiInputBase-input': {
        width: '100%',
      },
    },
  },
})(TextField);
const CssSelect = withStyles({
  root: {
    marginBottom: '40px',
    '& label': {
      fontFamily: 'Circe-regular, sans-serif',
      fontSize: '18px',
      color: '#BDBDBD',
    },
    '& label.Mui-focused': {
      color: '#24cca7',
      fontFamily: 'Circe-regular, sans-serif',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#24cca7',
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: '#bdbdbd',
    },
    '& .MuiInput-underline.Mui-error:after': {
      borderBottomColor: 'red',
    },
    '& .MuiFormHelperText-root.Mui-error': {
      fontFamily: 'Circe-regular, sans-serif',
      fontSize: '15px',
    },
  },
})(TextField);

export default function ModalAddTransaction() {
  const dispatch = useDispatch();

  const closeModal = e => {
    dispatch(modalTrancactionIsOpen(false));
  };

  const {
    handleSubmit,
    handleChange,
    values,
    handleBlur,
    touched,
    errors,
    resetForm,
  } = useFormik({
    initialValues: {
      checkBox: false,
      transaction: '',
      category: 'main',
      date: getCurrentDate(),
      comment: '',
    },
    validationSchema: Yup.object({
      checkBox: Yup.boolean(),
      transaction: Yup.number()
        .typeError('Это должны быть цифры')
        .required('Это поле обязательно'),
      category: Yup.string().optional(),
      date: Yup.string().optional(),
      comment: Yup.string().max(400, 'Максимум 400 символов').optional(),
    }),
    onSubmit: ({ checkBox, category, transaction, date, comment }) => {
      category = checkBox ? 'income' : category;
      dispatch(
        addTrancaction({ checkBox, category, transaction, date, comment }),
      );
      resetForm();
      closeModal();
    },
  });

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function getCurrentDate() {
    const date = pad(new Date().getDate());
    const month = pad(new Date().getMonth());
    const fullYear = pad(new Date().getFullYear());
    return `${fullYear}-${month}-${date}`;
  }

  return (
    <Modal className={style.modal} open={useSelector(IsModalTrasaction)}>
      <form onSubmit={handleSubmit}>
        <FormControl className={style.form}>
          <button
            onClick={closeModal}
            type="button"
            className={style.clouseButton}
          ></button>
          <span className={style.text}>Добавить транзакцию</span>
          <div className={style.changesContainer}>
            <label className={style.customCheckbox}>
              <input
                onChange={handleChange}
                className={style.checkbox}
                name="checkBox"
                type="checkbox"
                id="checkBox"
              ></input>
              <ul className={style.changeList}>
                <li className={values.checkBox ? 'addText' : ''} id="addText">
                  <span
                    className={
                      !values.checkBox ? style.plusText : style.plusTextActive
                    }
                  >
                    Доходы
                  </span>
                </li>
                <li className={values.checkBox ? '' : 'addСosts'} id="addСosts">
                  <span
                    className={
                      values.checkBox ? style.minusText : style.minusTextActive
                    }
                  >
                    Расходы
                  </span>
                </li>
              </ul>
            </label>
          </div>
          {values.checkBox ? null : (
            <CssSelect
              className={style.select}
              id="select"
              name="category"
              label="Выберите категорию"
              select
              value={values.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category && Boolean(errors.category)}
              helperText={touched.category && errors.category}
            >
              <MenuItem value="main">Основной</MenuItem>
              <MenuItem value="eat">Еда</MenuItem>
              <MenuItem value="car">Авто</MenuItem>
              <MenuItem value="growth">Развитие</MenuItem>
              <MenuItem value="children">Дети</MenuItem>
              <MenuItem value="house">Дом</MenuItem>
              <MenuItem value="education">Образование</MenuItem>
              <MenuItem value="other">Остальные</MenuItem>
            </CssSelect>
          )}
          <div className={style.quantityAndDate}>
            <CssTextField
              className={style.inputQuantity}
              id="transaction"
              name="transaction"
              type="text"
              placeholder="0.00"
              value={values.transaction}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.transaction && Boolean(errors.transaction)}
              helperText={touched.transaction && errors.transaction}
            />
            <CssDate
              onChange={handleChange}
              className={style.data}
              id="date"
              type="date"
              defaultValue={values.date}
            />
          </div>
          <CssTextField
            fullWidth
            className={style.comment}
            id="coment"
            name="comment"
            type="text"
            placeholder="Коментарий"
            value={values.comment}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.comment && Boolean(errors.comment)}
            helperText={touched.comment && errors.comment}
          />
          <button
            type="submit"
            className={`${style.button} ${style.buttonAdd}`}
          >
            Добавить
          </button>
          <button
            type="button"
            className={`${style.button} ${style.undo}`}
            onClick={closeModal}
          >
            Отменить
          </button>
        </FormControl>
      </form>
    </Modal>
  );
}
