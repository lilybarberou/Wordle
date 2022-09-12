import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
    word: {
        display: 'flex',
        gap: '8px',
    },
    green: {
        border: '3px solid green !important',
    },
    yellow: { border: '3px solid yellow !important' },
    darkgrey: { border: '3px solid darkgrey !important' },
    letter: (letters) => ({
        width: '60px',
        height: '60px',
        border: '3px solid grey',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '40px',
        color: 'white',
        textTransform: 'uppercase',
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
