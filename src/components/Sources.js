import { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { getFile } from '../contexts/Utils';

const useStyle = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        background: '#11113f',
        borderRadius: 5,
        padding: 10,
        color: '#fff',
        height: 'fit-content',
        position: 'absolute',
        right: '20px',
        maxHeight: 450,
        overflowY: 'auto',

        '& > p': {
            marginBottom: 10,
            fontSize: 15,
        },
        '& span': {
            fontSize: 12,
        },
    },
});

const Sources = ({ type }) => {
    const classes = useStyle();
    const [sources, setSources] = useState([]);

    useEffect(() => {
        async function getSources() {
            const sources = await getFile(`${type}/sources.txt`);
            const arr = sources.split('\n').sort((a, b) => (a > b ? 1 : b > a ? -1 : 0));
            setSources(arr);
        }

        getSources();
    }, [type]);

    return (
        <div className={classes.container}>
            <p>Sources de ce thème :</p>
            {sources.map((e) => (
                <span key={e}>{e}</span>
            ))}
        </div>
    );
};

export default Sources;
