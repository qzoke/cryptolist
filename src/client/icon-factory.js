import fontawesome from '@fortawesome/fontawesome';
import sortUp from '@fortawesome/fontawesome-free-solid/faSortUp';
import sortDown from '@fortawesome/fontawesome-free-solid/faSortDown';


export const createIconFactory = () => {
  fontawesome.library.add(sortUp, sortDown);
};
