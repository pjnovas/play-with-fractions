import React from 'react';
import { prop } from 'lodash/fp';
import { useSelector } from 'react-redux';
import styles from './RoomLink.module.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

const qsRoomId = process.env.REACT_APP_QS_ROOM;

const RoomLink = () => {
  const id = useSelector(prop('room.settings.id'));
  const href = `${window.location.origin}?${qsRoomId}=${id}`;

  if (!id) return null;

  return (
    <div className={styles.RoomLink}>
      <div>
        <h4>Link para jugadores</h4>
        <span>{href}</span>
      </div>
      <CopyToClipboard text={href}>
        <button type="button" title="Copiar Link">
          <FaCopy />
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default RoomLink;
