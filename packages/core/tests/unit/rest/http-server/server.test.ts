import { MiddlewareNext } from 'hyper-express';
import { IntentMiddleware } from '../../../../lib/rest';
import { HyperServer } from '../../../../lib/rest/http-server/server';
import { Request, Response } from '@intentjs/hyper-express';
import { ConfigService } from '../../../../lib/config';

jest.mock('../../../../lib/config', () => ({
    ConfigService: {
        get: (key: string) => ({})
    }
}));

describe('HyperServer', () => {
    let server: HyperServer;

    beforeEach(() => {
        server = new HyperServer();
    });

    describe('useGlobalMiddlewares', () => {
        it('should register global middleware', async () => {
            const mockMiddleware = async (req: Request, res: Response, next: MiddlewareNext) => {};
            
            server.useGlobalMiddlewares([mockMiddleware as unknown as IntentMiddleware]);
            
            expect(server.globalMiddlewares).toHaveLength(1);
            expect(server.globalMiddlewares[0]).toBe(mockMiddleware);
        });
    });

    describe('build', () => {
        it('should register GET route', async () => {
            const mockRoute = {
                method: 'GET',
                path: '/test',
                httpHandler: jest.fn()
            };

            const routeMiddlewares = new Map();
            routeMiddlewares.set('GET:/test', []);
            
            server.useRouteMiddlewares(routeMiddlewares);
            await server.build([mockRoute], {});

            const routes = ((server as any).hyper).routes;

            expect(routes).toMatchObject({
                get: {
                    '/test': expect.objectContaining({
                        path: '/test',
                        method: 'GET',
                    })
                },
                post: {},
                put: {},
                del: {}
            });
        });

        it('should register different HTTP method routes', async () => {
            const mockRoutes = [
                {
                    method: 'GET',
                    path: '/test',
                    httpHandler: jest.fn()
                },
                {
                    method: 'POST',
                    path: '/test',
                    httpHandler: jest.fn()
                },
                {
                    method: 'PUT',
                    path: '/test',
                    httpHandler: jest.fn()
                },
                {
                    method: 'DELETE',
                    path: '/test',
                    httpHandler: jest.fn()
                }
            ];

            const routeMiddlewares = new Map();
            routeMiddlewares.set('GET:/test', []);
            routeMiddlewares.set('POST:/test', []);
            routeMiddlewares.set('PUT:/test', []);
            routeMiddlewares.set('DELETE:/test', []);
            
            server.useRouteMiddlewares(routeMiddlewares);
            await server.build(mockRoutes, {});

            const routes = ((server as any).hyper).routes;
            expect(routes).toMatchObject({
                get: {
                    '/test': expect.objectContaining({
                        path: '/test',
                        method: 'GET',
                    })
                },
                post: {
                    '/test': expect.objectContaining({
                        path: '/test',
                        method: 'POST',
                    })
                },
                put: {
                    '/test': expect.objectContaining({
                        path: '/test',
                        method: 'PUT',
                    })
                },
                del: {
                    '/test': expect.objectContaining({
                        path: '/test',
                        method: 'DELETE',
                    })
                }
            });
        });
    });
}); 