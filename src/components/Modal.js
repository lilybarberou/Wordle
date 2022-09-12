import { createUseStyles } from 'react-jss';
import { ReactComponent as Close } from '../assets/close.svg';

const useStyle = createUseStyles({
    container: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '-1',
    },
    bg: {
        width: '100%',
        height: '100%',
        background: '#1f1f1fd9',
        opacity: '0',
    },
    content: {
        width: '300px',
        height: '250px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transition: '.5s',
        background: '#fff',
        borderRadius: '10px',
        padding: '20px',
        opacity: '0',
        transform: 'translate(-50%,-50%) scale(0)',
        transformOrigin: '50% 50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyItems: 'center',

        '& svg': {
            alignSelf: 'flex-end',
            cursor: 'pointer',
        },

        '& h3': {
            justifySelf: 'flex-start',
            fontSize: '20px',
        },

        '& span': {
            fontSize: '36px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1c4995',
        },
    },
    open: {
        zIndex: '1',

        '& .bg': {
            opacity: '1',
        },
        '& .content': {
            opacity: '1',
            transform: 'translate(-50%,-50%) scale(1)',
            transformOrigin: 'center',
        },
    },
});

const Modal = ({ opt }) => {
    const classes = useStyle();
    const { open, word, win, closeModal } = opt;
    console.log(open);

    return (
        <div className={`${classes.container} ${open ? classes.open : ''}`}>
            <div className={`${classes.bg} bg`} onClick={closeModal}></div>
            <div className={`${classes.content} content`}>
                {open && (
                    <>
                        <Close width="15" height="15" onClick={closeModal} />
                        {win ? (
                            <>
                                <h3>Félicitations !</h3>
                                <p>Vous avez trouvé le mot :</p>
                                <span>{word}</span>
                            </>
                        ) : (
                            <>
                                <p>Perdu !</p>
                                <p>Le mot était :</p>
                                <span>{word}</span>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Modal;
