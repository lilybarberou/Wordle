import { useCallback, useRef, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { createUseStyles } from 'react-jss';
import { toast } from 'react-toastify';
import { getFile } from '../contexts/Utils';
import { ReactComponent as Reload } from '../assets/reload.svg';
import Sources from './Sources';
import Modal from './Modal';
import Word from './Word';

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
        width: 'fit-content',

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

const Game = ({ type = 'default' }) => {
    const classes = useStyle();
    const tryNumber = 6;

    //
    // ──── N MANAGEMENT ─────────────────────────────────────────────
    //
    let { n = 5 } = useParams();

    const allowedNb = {
        default: [4, 5, 6, 7],
        anime: [4, 5, 6, 7],
        jv: [4, 5, 6, 7],
    };

    // if n does not exists for specific type, set it to 5
    if (!allowedNb[type].includes(parseInt(n))) n = 5;

    //
    // ──── RESET VALUES WHEN TYPES CHANGES ─────────────────────────────────────────────
    //
    const firstRender = useRef(true);
    const [words, setWords] = useState([]);
    const [word, setWord] = useState('');

    const genWord = useCallback(async (wordsArray) => {
        const i = Math.floor(Math.random() * wordsArray.length);
        return wordsArray[i];
    }, []);

    // reset states
    const restart = async (wordsArray) => {
        setGameEnded(false);

        const newWord = await genWord(wordsArray);
        setWord(newWord);
        initArray(newWord);

        setCursor([0, 0]);
    };

    useEffect(() => {
        async function initRender() {
            // get words list
            const text = await getFile(`${type}/${n}.txt`);
            const arr = text.split(' ');
            setWords(arr);

            // get the word
            const newWord = await genWord(arr);
            setWord(newWord);

            // gen array render from this word
            initArray(newWord);

            // if first render, no need to restart
            if (firstRender.current) return (firstRender.current = false);
            restart(arr);
        }

        initRender();
    }, [type, n]);

    // init array for the result
    const initArray = (word) => {
        const array = [];
        for (let i = 0; i < tryNumber; i++) {
            let row = [];
            for (let i = 0; i < word.length; i++) {
                row.push({ letter: '', res: '' });
            }
            array.push(row);
        }

        setResult(array);
    };

    const [result, setResult] = useState([]);
    const [cursor, setCursor] = useState([0, 0]);
    const [gameEnded, setGameEnded] = useState(false);

    //
    // ──── MODAL MANAGEMENT ─────────────────────────────────────────────
    //
    const closeModal = () => {
        setModalStuff((prev) => ({ ...prev, open: false }));
    };

    const [modalStuff, setModalStuff] = useState({
        open: false,
        word,
        win: false,
        closeModal,
    });

    useEffect(() => {
        setModalStuff((prev) => ({ ...prev, word }));
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
        if (cursor[1] === word.length) {
            if (!wordExists()) {
                return toast.error("Ce mot n'existe pas");
            }

            const win = checkLetters();

            if (win) {
                setModalStuff((prev) => ({ ...prev, open: true, win: true }));
                setGameEnded(true);
            }

            // game over
            if (cursor[0] === tryNumber - 1) {
                setModalStuff((prev) => ({ ...prev, open: true, win: false }));
                setGameEnded(true);
            }
            // set cursor to next step
            setCursor([cursor[0] + 1, 0]);
        }
    };

    // check if word exists in db
    const wordExists = () => {
        const wordToCheck = result[cursor[0]].map((e) => e.letter).join('');
        return words.includes(wordToCheck);
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
        return counter === word.length;
    };

    const writeNewLetter = (e) => {
        // if all letters are not typed yet
        if (cursor[1] !== word.length) {
            // put letter to current cursor
            const res = [...result];
            res[cursor[0]][cursor[1]].letter = e.toUpperCase();
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
                            '{bksp}': '⌫',
                            '{enter}': '↩',
                        }}
                        onKeyPress={handleKeyPress}
                        theme='hg-theme-default dark'
                    />
                </div>
            </div>
            {type !== 'default' && <Sources type={type} />}
            {gameEnded && (
                <div className={classes.reload}>
                    <Reload width='50' height='50' onClick={(e) => restart(words)} />
                </div>
            )}
        </div>
    );
};

export default Game;
