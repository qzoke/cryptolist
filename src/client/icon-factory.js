import fontawesome from '@fortawesome/fontawesome';
import freeSolid from '@fortawesome/fontawesome-free-solid';


export const createIconFactory = () => {
  fontawesome.library.add(freeSolid);
};
