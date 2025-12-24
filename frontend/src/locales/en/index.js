import { common } from './common';
import { validate } from './validate';
import { nav } from './nav';
import { auth } from './auth';
import { novel } from './novel';
import { author } from './author';
import { profile } from './profile';
import { admin } from './admin';

const en = {
    translation: {
        ...common,
        ...validate,
        ...nav,
        ...auth,
        ...novel,
        ...author,
        ...profile,
        ...admin
    }
};

export default en;
