
import 'reflect-metadata';

import { Server } from './framework/server/server.js';


//=============//
// CONTROLLERS //
//=============//

import './framework/health-check/health-check.controller.js';
import './greeter/hello.controller.js';


//========//
// SERVER //
//========//

const server = new Server();

await server.start();
