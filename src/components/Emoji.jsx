import React from 'react';

// https://unicode.org/emoji/charts/full-emoji-list.html

const Emoji = ({ className, style, text, name, code }) =>
  text ? (
    <div role="img" aria-label={name} style={style} className={className}>
      {text}
    </div>
  ) : (
    <span
      role="img"
      aria-label={name}
      style={style}
      className={className}
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );

export default Emoji;
