const rowCenterBetween = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
} as const;

const rowCenter = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
} as const;

const row = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
} as const;

const column = {
  display: 'flex',
  flexDirection: 'column',
} as const;

const rowSpaceAround = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-around',
} as const;

const columnCenter = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
} as const;

export const flex = {
  row,
  column,
  rowCenter,
  rowCenterBetween,
  columnCenter,
  rowSpaceAround,
};
