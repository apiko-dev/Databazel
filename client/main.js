import { createApp } from 'mantra-core';
import initContext from './configs/context';
import workplace from './modules/workplace';
import accounts from './modules/accounts';
import home from './modules/home';
import core from './modules/core';
import admin from './modules/admin';
import publishing from './modules/publishing';

const context = initContext();
const app = createApp(context);

app.loadModule(workplace);
app.loadModule(home);
app.loadModule(accounts);
app.loadModule(admin);
app.loadModule(core);
app.loadModule(publishing);
app.init();
