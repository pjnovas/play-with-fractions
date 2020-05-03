import React from 'react';
import styles from './RoomForm.module.css';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { compact } from 'lodash';

import { create } from 'app/reducer/room/settings';
import { getTablesConfig, getFraction } from 'app/utils/room';

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

const getHelpTable = (maxPlayers, maxPerTable) => {
  if (maxPerTable > maxPlayers) {
    return 'La cantidad de jugadores debe ser mayor a la cantidad por mesa';
  }

  const { tables, plus } = getTablesConfig(maxPlayers, maxPerTable);
  const rest = plus === 0 ? '' : `y una mesa de ${plus}`;
  return `Serán ${tables} Mesas de ${maxPerTable} jugadores ${rest}`;
};

const getHelpCards = (cards, cardsPerRound) => {
  if (cardsPerRound > cards) {
    return 'Cantidad de cartas insuficientes';
  }

  return `Serán ${
    cards / cardsPerRound
  } rondas con selección entre ${cardsPerRound} cartas por ronda`;
};

const RoomForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      maxPlayers: 5, // 24,
      maxPerTable: 3,
      cardsPerRound: 3,
      cards: cards.join('\n')
    }
  });

  const onSubmit = room => {
    dispatch({
      type: 'WS:SEND',
      payload: create({
        ...room,
        maxPlayers: Number(room.maxPlayers),
        maxPerTable: Number(room.maxPerTable),
        cardsPerRound: Number(room.cardsPerRound),
        cards: compact(room.cards.split('\n'))
      })
    });
  };

  const maxPlayers = Number(watch('maxPlayers'));
  const maxPerTable = Number(watch('maxPerTable'));
  const cardsPerRound = Number(watch('cardsPerRound'));
  const currentCards = compact(watch('cards').split('\n'));

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
        <div>
          <label>Cartas por ronda</label>
          <input
            ref={register}
            name="cardsPerRound"
            type="number"
            min="2"
            max="5"
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
            <span>{getHelpCards(currentCards.length, cardsPerRound)}</span>
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
