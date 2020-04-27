import React from 'react';
import styles from './RoomForm.module.css';
import { useForm } from 'react-hook-form';

const cards = [
  '1',
  '3/2',
  '1/3',
  '4/3',
  '1/4',
  '5/4',
  '3/4',
  '2/5',
  '3/5',
  '4/5',
  '1/8',
  '2/8',
  '3/8',
  '5/8',
  '7/8',
  '9/8',
  '1/6',
  '2/6',
  '3/6',
  '5/6',
  '9/6',
  '8/9',
  '6/10',
  '6/12'
];

const getFraction = number =>
  number.includes('/')
    ? `${number.split('/')[0]}&frasl;${number.split('/')[1]}`
    : number;

const getHelpTable = (maxPlayers, maxPerTable) => {
  if (maxPerTable > maxPlayers) {
    return 'La cantidad de jugadores debe ser mayor a la cantidad por mesa';
  }

  const mod = maxPlayers % maxPerTable;
  const div = maxPlayers / maxPerTable;

  const rest = mod === 0 ? '' : `y una mesa de ${mod}`;
  return `Serán ${Math.floor(div)} Mesas de ${maxPerTable} jugadores ${rest}`;
};

const getHelpCards = (cards, maxPerTable) => {
  if (maxPerTable > cards) {
    return 'Cantidad de cartas insuficientes';
  }

  return `Serán ${
    cards / maxPerTable
  } rondas con selección entre ${maxPerTable} cartas por ronda`;
};

const RoomForm = ({ onSubmit }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      maxPlayers: 24,
      maxPerTable: 3,
      cards: cards.join('\n')
    }
  });

  const maxPlayers = Number(watch('maxPlayers'));
  const maxPerTable = Number(watch('maxPerTable'));
  const currentCards = watch('cards').split('\n');

  return (
    <div className={styles.content}>
      <h1>Nueva Partida</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nombre</label>
          <input ref={register} name="name" />
        </div>
        <div>
          <label>Cantidad de Jugadores</label>
          <input
            ref={register}
            name="maxPlayers"
            type="number"
            min="2"
            max="50"
          />
        </div>
        <div>
          <label>Jugadores por mesa</label>
          <input
            ref={register}
            name="maxPerTable"
            type="number"
            min="2"
            max="10"
          />
        </div>
        <div className={styles.helpTables}>
          <label>{getHelpTable(maxPlayers, maxPerTable)}</label>
        </div>
        <div>
          <div className={styles.cards}>
            <label>{`Mazo de cartas (${currentCards.length})`}</label>
            <ul>
              {currentCards.map((card, i) => (
                <li
                  key={`${card}-${i}`}
                  dangerouslySetInnerHTML={{ __html: getFraction(card) }}
                ></li>
              ))}
            </ul>
            <span>{getHelpCards(currentCards.length, maxPerTable)}</span>
          </div>
          <textarea ref={register} name="cards" />
        </div>
        <div className={styles.footer}>
          <button type="submit">Crear</button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
