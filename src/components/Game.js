import { useEffect, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { createUseStyles } from 'react-jss';
import { toast } from 'react-toastify';

import db from '../assets/db.json';
import Word from './Word';
import Modal from './Modal';
import { ReactComponent as Reload } from '../assets/reload.svg';

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
        transition: '.5s',
    },
    words: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
    },
    keyboard: {
        width: '100%',

        '& .simple-keyboard.dark': {
            backgroundColor: 'transparent',
            borderRadius: '0',
            borderBottomRightRadius: '5px',
            borderBottomLeftRadius: '5px',
            padding: '0',
        },
        '& .simple-keyboard.dark .hg-button': {
            height: '50px',
            padding: '20px',
            border: 'none',
        },
        '& .simple-keyboard.dark .hg-button:active': {
            background: '#1c4995',
            color: 'white',
        },
        '& #root .simple-keyboard.dark + .simple-keyboard-preview': {
            background: '#1c4995',
        },
    },
    open: {
        transform: 'scale(0.9)',
    },
    reload: {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        background: '#1f1f1fd9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        '& svg *': {
            fill: '#fff',
        },

        '& svg': {
            padding: '20px',
            background: '#452727',
            borderRadius: '10px',
            cursor: 'pointer',
        },
    },
});

const Game = () => {
    const classes = useStyle();
    const tryNumber = 6;
    const WordLength = 5;

    // init array for the result
    const initArray = () => {
        const array = [];
        for (let i = 0; i < tryNumber; i++) {
            let row = [];
            for (let i = 0; i < WordLength; i++) {
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
    const [gameEnded, setGameEnded] = useState(false);

    // modal
    const closeModal = () => {
        setModalStuff({ ...modalStuff, open: false });
    };

    const [modalStuff, setModalStuff] = useState({
        open: false,
        word,
        win: false,
        closeModal,
    });

    useEffect(() => {
        setModalStuff({ ...modalStuff, word });
    }, [word]);

    const handleKeyPress = (e) => {
        // block keyboard if game is ended
        if (gameEnded) return;

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
        // if all letters are typed
        if (cursor[1] === WordLength) {
            if (!wordExists()) {
                return toast.error("Ce mot n'existe pas");
            }

            const win = checkLetters();

            if (win) {
                setModalStuff({ ...modalStuff, open: true, win: true });
                setGameEnded(true);
            }

            // game over
            if (cursor[0] === tryNumber - 1) {
                setModalStuff({ ...modalStuff, open: true, win: false });
                setGameEnded(true);
            }
            // set cursor to next step
            setCursor([cursor[0] + 1, 0]);
        }
    };

    // check if word exists in db
    const wordExists = () => {
        return db.words.includes(result[cursor[0]].map((e) => e.letter).join(''));
    };

    // check if letters are right
    const checkLetters = () => {
        let res = [...result];
        let counter = 0;
        result[cursor[0]].forEach((e, i) => {
            // letter is true
            if (e.letter === word[i]) {
                res[cursor[0]][i].res = 2;
                counter++;
            }
            // letter is in the word at the wrong place
            else if (word.includes(e.letter)) {
                res[cursor[0]][i].res = 1;
            }
            // letter is not in the word
            else res[cursor[0]][i].res = 0;
        });

        setResult([...res]);
        return counter === WordLength;
    };

    const writeNewLetter = (e) => {
        // if all letters are not typed yet
        if (cursor[1] !== WordLength) {
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

    // reset states
    const restart = () => {
        setGameEnded(false);
        setWord(genWord());
        setResult(initArray());
        setCursor([0, 0]);
    };

    return (
        <div className={`${classes.container}`}>
            <Modal opt={modalStuff} />
            <div className={`${classes.content} ${modalStuff.open ? classes.open : ''}`}>
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
                        theme="hg-theme-default dark"
                    />
                </div>
            </div>
            {gameEnded && (
                <div className={classes.reload}>
                    <Reload width="50" height="50" onClick={restart} />
                </div>
            )}
        </div>
    );
};

export default Game;
