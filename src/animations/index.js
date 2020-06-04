function widthZero(node, {
  delay = 0,
  duration = 400,
}) {
  const [w, wo] = getPropertyValueByStyle(getComputedStyle(node).width);
  const [pl, plo] = getPropertyValueByStyle(getComputedStyle(node).paddingLeft);
  const [pr, pro] = getPropertyValueByStyle(getComputedStyle(node).paddingRight);
  const [ml, mlo] = getPropertyValueByStyle(getComputedStyle(node).marginLeft);
  const [mr, mro] = getPropertyValueByStyle(getComputedStyle(node).marginRight);

  

  return {
    delay,
    duration,
    css: t => `max-width: ${t * w}${wo};
      width: ${t * w}${wo};
      padding-left: ${t * pl}${plo};
      padding-right: ${t * pr}${pro};
      margin-left: ${t * ml}${mlo};
      margin-right: ${t * mr}${mro};
    `,
  }
};

function heightZero(node, {
  delay = 0,
  duration = 400,
}) {
  const [h, ho] = getPropertyValueByStyle(getComputedStyle(node).height);
  const [pt, pto] = getPropertyValueByStyle(getComputedStyle(node).paddingTop);
  const [pb, pbo] = getPropertyValueByStyle(getComputedStyle(node).paddingBottom);
  const [mt, mto] = getPropertyValueByStyle(getComputedStyle(node).marginTop);
  const [mb, mbo] = getPropertyValueByStyle(getComputedStyle(node).marginBottom);

  

  return {
    delay,
    duration,
    css: t => `max-height: ${t * h}${ho};
      height: ${t * h}${ho};
      padding-top: ${t * pt}${pto};
      padding-bottom: ${t * pb}${pbo};
      margin-top: ${t * mt}${mto};
      margin-bottom: ${t * mb}${mbo};
    `,
  }
};

function getPropertyValueByStyle(style = '') {
  const regex = /px|%|em|vw/;
  const width = parseInt(style, 10);
  if (!width) {
    return ['', ''];
  }

  const output = style.match(regex)[0] || 'px';

  return [width, output];
}

export { widthZero, heightZero };