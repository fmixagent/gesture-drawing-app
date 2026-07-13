export const getMinutesFromSeconds = (seconds: number) => {
  return seconds / 60;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
