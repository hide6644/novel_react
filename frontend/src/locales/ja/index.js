import { common } from './common';
import { nav } from './nav';
import { auth } from './auth';
import { novel } from './novel';
import { author } from './author';
import { profile } from './profile';
import { admin } from './admin';

const ja = {
    translation: {
        ...common,
        ...nav,
        ...auth,
        ...novel,
        ...author,
        ...profile,
        ...admin
    }
};

export default ja;
