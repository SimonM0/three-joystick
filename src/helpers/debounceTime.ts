/**
 * This is used to determine whether a user has tapped/clicked or
 * swiped/dragged
 *
 * @param startTimeStamp
 * @param debounceInMs
 * @returns {boolean}
 */
const debounceTime = (
  startTimeStamp: number,
  debounceInMs = 150,
): boolean => (
  (Date.now() - startTimeStamp) < debounceInMs
);

export default debounceTime;
