import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
    container: {
        width: '300px',
        height: '250px',
    },
    open: {
        transform: 'scale(1)',
    },
});

const Modal = ({ text, open }) => {
    const classes = useStyle();

    return (
        <div className={`${classes.container} ${open ? classes.open : ''}`}>
            <p>{text}</p>
        </div>
    );
};

export default Modal;
