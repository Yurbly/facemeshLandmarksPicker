import {App} from './App';
import ReactDom from 'react-dom/client';

const root = document.getElementById('root');
const rootEl = ReactDom.createRoot(root);

rootEl.render(<App />);     