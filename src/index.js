import {App} from './App';
import ReactDom from 'react-dom/client';

const root = document.getElementById('root');
if (!root) throw new Error('Root element is not found')
const rootEl = ReactDom.createRoot(root);

rootEl.render(<App />);     