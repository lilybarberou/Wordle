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
    },
    right: {
        width: 150,
    },
    submenu: {
        display: 'flex',
        position: 'relative',
        color: '#fff',
        textTransform: 'uppercase',
        fontSize: 15,

        '& > span': {
            pointerEvents: 'none',
        },
        '&:hover > div': {
            display: 'flex',
        },
        '& > div': {
            position: 'absolute',
            flexDirection: 'column',
            top: '100%',
            gap: 10,
            left: 0,
            display: 'none',
            background: '#11113f',
            padding: 10,
            borderRadius: 5,
            minWidth: '100%',
            boxSizing: 'border-box',

            '& > a': {
                whiteSpace: 'nowrap',
                fontSize: 14,
                color: '#fff',
                textDecoration: 'none',
            },
        },
    },
});

const Navigation = () => {
    const classes = useStyle();

    const SubMenu = ({ title, base = '', nb = [] }) => {
        return (
            <div className={classes.submenu}>
                <span>{title}</span>
                <div>
                    {nb.map((n) => (
                        <NavLink key={n} to={`${base}/${n}`}>
                            {n} lettres
                        </NavLink>
                    ))}
                </div>
            </div>
        );
    };

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
                <SubMenu title='Partie normale' nb={[4, 5, 6, 7]} />
                <SubMenu title='Anime' base='/anime' nb={[4, 5, 6, 7]} />
                <SubMenu title='Jeux vidéos' base='/jeux-videos' nb={[4, 5, 6, 7]} />
            </div>
            <div className={classes.right}></div>
        </div>
    );
};

export default Navigation;
