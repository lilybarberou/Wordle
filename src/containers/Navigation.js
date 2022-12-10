import { createUseStyles } from 'react-jss';
import { NavLink } from 'react-router-dom';

const useStyle = createUseStyles({
    container: {
        height: '55px',
        background: '#1c4995',
        position: 'sticky',
        top: '0',
        left: '0',
        right: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxSizing: 'border-box',
    },
    title: {
        width: 150,

        '& > h1': {
            color: '#e4e4e4',
            width: 'fit-content',
            background: '#11113f',
            borderRadius: 5,
            padding: '0 10px',
            display: 'flex',
            fontSize: 20,
            alignItems: 'center',
            gap: 10,

            '& > span': {
                fontSize: 13,
                lineHeight: 1,
                fontWeight: 'lighter',

                '& > a': {
                    color: '#fff',
                },
            },
        },
    },
    middle: {
        display: 'flex',
        gap: 20,

        '& a': {
            color: '#fff',
            textDecoration: 'none',
            textTransform: 'uppercase',
            fontSize: 15,
            position: 'relative',

            '&::after': {
                position: 'absolute',
                content: "''",
                width: '100%',
                height: 4,
                background: '#11113f',
                left: 0,
                bottom: '-3px',
                transform: 'scale(0)',
                transition: '.3s',
            },
            '&.active': {
                '&::after': {
                    transform: 'scale(1)',
                },
            },
        },
    },
    right: {
        width: 150,
    },
});

const Navigation = () => {
    const classes = useStyle();

    return (
        <div className={classes.container}>
            <div className={classes.title}>
                <h1>
                    WORDLE
                    <span>
                        by{' '}
                        <a href='https://lilybarberou.fr' target='_blank' rel='noopener noreferrer'>
                            Lily
                        </a>
                    </span>
                </h1>
            </div>
            <div className={classes.middle}>
                <NavLink activeclassname='active' to='/'>
                    Partie normale
                </NavLink>
                <NavLink to='/anime'>Anime</NavLink>
                <NavLink to='/jeux-videos'>Jeux vidéos</NavLink>
            </div>
            <div className={classes.right}></div>
        </div>
    );
};

export default Navigation;
