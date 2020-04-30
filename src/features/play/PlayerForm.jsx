import React from 'react';
import styles from './PlayerForm.module.css';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { join } from 'app/reducer/room/players';
import Emoji from 'components/Emoji';

const PlayerForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      nickname: '',
      email: ''
    }
  });

  const onSubmit = player => {
    console.log(player);
    dispatch({
      type: 'WS:SEND',
      payload: join({
        ...player
      })
    });
  };

  return (
    <div className={styles.content}>
      <h2>
        Hola! <Emoji text="🖐" className="animated infinite wobble" />
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>
          Ingresá tus datos para jugar{' '}
          <Emoji text="👇" className="animated infinite bounce" />
        </h3>
        <div>
          <label>Nombre</label>
          <input
            ref={register}
            placeholder="Tu nombre completo"
            name="nickname"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            ref={register}
            placeholder="Tu email del colegio"
            name="email"
          />
        </div>
        <div className={styles.footer}>
          <button type="submit" className="animated infinite pulse">
            Jugar!
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;
