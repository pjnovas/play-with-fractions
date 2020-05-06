import React from 'react';
import styles from './PlayerForm.module.css';
import { prop } from 'lodash/fp';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Emoji from 'components/Emoji';
import * as yup from 'yup';

import { join } from 'app/reducer/room/players';
import { isOnline } from 'reducer/websocket';
import { setLoading, setData } from 'reducer/player';

const PlayerSchema = yup.object().shape({
  nickname: yup.string().trim().required('Poné tu nombre'),
  email: yup
    .string()
    .email('Mmm está bien escrito ese email?')
    .required('Poné tu email del cole')
});

const PlayerForm = () => {
  const dispatch = useDispatch();
  const online = useSelector(isOnline);
  const roomNotFound = useSelector(prop('room.settings.notFound'));

  const { register, handleSubmit, errors } = useForm({
    validationSchema: PlayerSchema,
    defaultValues: {
      nickname: '',
      email: ''
    }
  });

  const onSubmit = player => {
    dispatch({
      type: 'WS:SEND',
      payload: join(player)
    });

    dispatch(setLoading(true));
    dispatch(setData(player));
  };

  return (
    <div className={styles.content}>
      {roomNotFound ? (
        <h2>La partida ha finalizado</h2>
      ) : (
        <>
          <h2>
            <Emoji text="🖐" className="animated infinite wobble" /> Hola!
          </h2>
          <form
            onSubmit={online ? handleSubmit(onSubmit) : e => e.preventDefault()}
          >
            <h3>
              Ingresá tus datos{' '}
              <Emoji text="👇" className="animated infinite bounce" />
            </h3>
            <div>
              <label>Nombre</label>
              <input ref={register} placeholder="Tu nombre" name="nickname" />
              {errors?.nickname && (
                <div className={styles.error}>
                  <Emoji text="👆" /> {errors.nickname.message}
                </div>
              )}
            </div>
            <div>
              <label>Email</label>
              <input
                ref={register}
                placeholder="Tu email del colegio"
                name="email"
              />
              {errors?.email && (
                <div className={styles.error}>
                  <Emoji text="👆" /> {errors.email.message}
                </div>
              )}
            </div>
            <div className={styles.footer}>
              <button
                type="submit"
                title={`${online ? '' : 'conectando con servidor ...'}`}
                className={`${
                  online ? 'animated infinite pulse' : styles.disabled
                }`}
              >
                Jugar!
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default PlayerForm;
