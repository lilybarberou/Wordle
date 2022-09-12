import { useEffect, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { createUseStyles } from 'react-jss';

import db from '../assets/db.json';
import Word from './Word';
import { toast } from 'react-toastify';

const useStyle = createUseStyles({
    container: {
        width: '100%',
        padding: '20px 0',
        height: 'calc(100vh - 95px)',
        display: 'flex',
        justifyContent: 'center',
    },
    content: {
        width: 'fit-content',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
    },
    words: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
    },
    keyboard: {
        width: '100%',
    },
});

const Game = () => {
    const classes = useStyle();

    // init array for the result
    const initArray = () => {
        const array = [];
        for (let i = 0; i < 6; i++) {
            let row = [];
            for (let i = 0; i < 5; i++) {
                row.push({ letter: '', res: '' });
            }
            array.push(row);
        }

        return array;
    };

    // return a random word from db
    const genWord = () => {
        const i = Math.floor(Math.random() * db.words.length);
        return db.words[i];
    };

    const [result, setResult] = useState(initArray());
    const [cursor, setCursor] = useState([0, 0]);
    const [word, setWord] = useState(genWord());

    const handleKeyPress = (e) => {
        switch (e) {
            case '{bksp}':
                deleteCurrentLetter();
                break;

            case '{enter}':
                updateResult();
                break;

            default:
                writeNewLetter(e);
        }
    };

    const updateResult = () => {
        if (cursor[1] === 5) {
            if (checkIfWordExists()) {
                checkLetters();
            } else toast.error("Ce mot n'existe pas");
        }
    };

    // check if word exists in db
    const checkIfWordExists = () => {
        return db.words.includes(result[cursor[0]].map((e) => e.letter).join(''));
    };

    // check if letters are right
    const checkLetters = () => {
        let res = [...result];
        result[cursor[0]].forEach((e, i) => {
            // letter is true
            if (e.letter === word[i]) {
                res[cursor[0]][i].res = 2;
            }
            // letter is in the word at the wrong place
            else if (word.includes(e.letter)) {
                res[cursor[0]][i].res = 1;
            }
            // letter is not in the word
            else res[cursor[0]][i].res = 0;
        });

        setResult([...res]);
        // set cursor to next step
        if (cursor[0] !== 5) setCursor([cursor[0] + 1, 0]);
        else toast.error('Jeu terminé');
    };

    const writeNewLetter = (e) => {
        // if last letters to type
        if (cursor[1] !== 5) {
            // put letter to current cursor
            const res = [...result];
            res[cursor[0]][cursor[1]].letter = e;
            setResult([...res]);

            // add 1 to current cursor
            setCursor([cursor[0], cursor[1] + 1]);
        }
    };

    const deleteCurrentLetter = () => {
        if (cursor[1] !== 0) {
            // delete last letter
            const res = [...result];
            res[cursor[0]][cursor[1] - 1].letter = '';
            setResult([...res]);

            // put current cursor back
            cursor[1] !== 0 && setCursor([cursor[0], cursor[1] - 1]);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <div className={classes.words}>
                    {result.map((e, i) => (
                        <Word key={i} letters={e} />
                    ))}
                </div>
                <div className={classes.keyboard}>
                    <Keyboard
                        layout={{
                            default: ['a z e r t y u i o p', 'q s d f g h j k l m', '{bksp} w x c v b n {enter}'],
                        }}
                        display={{
                            '{bksp}': 'Retour',
                            '{enter}': 'Entrer',
                        }}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            </div>
        </div>
    );
};

export default Game;
