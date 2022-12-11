import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Navigation from '../containers/Navigation';
import Game from './Game';

const Router = () => {
    const routes = [
        { path: '/', element: <Game /> },
        { path: '/:n', element: <Game /> },
        { path: '/anime/:n', element: <Game type='anime' /> },
        { path: '/jeux-videos/:n', element: <Game type='jv' /> },
    ];

    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                {routes.map((e, i) => (
                    <Route key={i} path={e.path} element={e.element} />
                ))}
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
