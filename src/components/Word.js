import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
    word: {
        display: 'flex',
        gap: '10px',
    },
    green: {
        border: '4px solid green !important',
    },
    yellow: { border: '4px solid yellow !important' },
    darkgrey: { border: '4px solid darkgrey !important' },
    letter: (letters) => ({
        width: '60px',
        height: '60px',
        border: '4px solid grey',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '40px',
        color: 'white',
        textTransform: 'uppercase',

        // '&:nth-child(1)': {
        //     borderColor: getBorderColor(letters[0]),
        // },
    }),
});

const Word = ({ letters = [] }) => {
    const classes = useStyle(letters);

    const getBorderColor = (status) => {
        switch (status) {
            case 2:
                return classes.green;
            case 1:
                return classes.yellow;
            case 0:
                return classes.darkgrey;
            default:
                return '';
        }
    };

    return (
        <div className={classes.word}>
            {letters.map((e, i) => {
                return (
                    <div key={i} className={`${classes.letter} ${getBorderColor(e.res)}`}>
                        <p>{e.letter}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Word;
