import { createUseStyles } from 'react-jss';

const useStyle = createUseStyles({
    container: {
        height: '55px',
        background: '#271f26',
        position: 'sticky',
        top: '0',
        left: '0',
        right: '0',
    },
});

const Navigation = () => {
    const classes = useStyle();

    return <div className={classes.container}></div>;
};

export default Navigation;
