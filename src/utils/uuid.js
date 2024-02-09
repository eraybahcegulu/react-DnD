import { v4 as uuidv4 } from 'uuid';

const id = () => {
    const id = uuidv4();
    return id;
};

export { id };