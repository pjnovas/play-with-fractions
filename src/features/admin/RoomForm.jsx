import React from 'react';
import styles from './RoomForm.module.css';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { compact } from 'lodash';

import { create } from 'app/reducer/room/settings';
import { getTablesConfig } from 'app/utils/room';
import { isOnline } from 'reducer/websocket';
import CardList from './CardList';

const cards = [
  '1',
  '3/2',
  '1/3',
  '4/3',
  '1/4',
  '3/4',
  '5/4',
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
  const online = useSelector(isOnline);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      maxPlayers: 20,
      maxPerTable: 4,
      waitTimeout: 5,
      roundTimeout: 15,
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
        waitTimeout: Number(room.waitTimeout),
        roundTimeout: Number(room.roundTimeout),
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
        <div className={[styles.row, styles.underline].join(' ')}>
          <label>Nombre de Partida</label>
          <input ref={register} name="name" />
        </div>
        <div className={styles.row}>
          <div>
            <label>Total de jugadores</label>
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
        </div>
        <div className={[styles.helpTables, styles.underline].join(' ')}>
          <label>{getHelpTable(maxPlayers, maxPerTable)}</label>
        </div>
        <div className={[styles.row, styles.underline].join(' ')}>
          <div>
            <label>Tiempo de espera (seg)</label>
            <input
              ref={register}
              name="waitTimeout"
              type="number"
              min="2"
              max="20"
            />
          </div>
          <div>
            <label>Tiempo por Ronda (seg)</label>
            <input
              ref={register}
              name="roundTimeout"
              type="number"
              min="5"
              max="30"
            />
          </div>
        </div>
        <div>
          <div className={styles.cards}>
            <label>{`Mazo de cartas (${currentCards.length})`}</label>
            <CardList cards={currentCards} />
            <div className={styles.roundCards}>
              <label>Cartas por ronda</label>
              <input
                ref={register}
                name="cardsPerRound"
                type="number"
                min="2"
                max="5"
              />
            </div>
            <span>{getHelpCards(currentCards.length, cardsPerRound)}</span>
          </div>
          <textarea ref={register} name="cards" />
        </div>
        <div className={styles.footer}>
          {online ? (
            <button type="submit">Crear</button>
          ) : (
            <p>Conectando con el servidor ...</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RoomForm;
