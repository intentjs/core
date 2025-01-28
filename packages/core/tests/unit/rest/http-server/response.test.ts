import { Response } from '../../../../lib/rest/http-server/response';
import { HttpStatus } from '../../../../lib/rest/http-server/status-codes';
import { StreamableFile } from '../../../../lib/rest/http-server/streamable-file';

describe('Response', () => {
    let response: Response;

    beforeEach(() => {
        response = new Response();
    });

    describe('status', () => {
        it('should set status code and return response instance', () => {
            const result = response.status(HttpStatus.CREATED);
            expect(result).toBe(response);
            expect((response as any).statusCode).toBe(HttpStatus.CREATED);
        });
    });

    describe('header', () => {
        it('should set header and return response instance', () => {
            const result = response.header('Content-Type', 'application/json');
            expect(result).toBe(response);
            expect((response as any).responseHeaders.get('Content-Type')).toBe('application/json');
        });
    });

    describe('type', () => {
        it('should set content type header for json', () => {
            const result = response.type('json');
            expect(result).toBe(response);
            expect((response as any).responseHeaders.get('Content-Type')).toBe('application/json');
        });

        it('should set content type header for text', () => {
            response.type('text');
            expect((response as any).responseHeaders.get('Content-Type')).toBe('text/plain');
        });
    });

    describe('body', () => {
        it('should set json body and content type', () => {
            const data = { message: 'test' };
            response.body(data);
            expect((response as any).bodyData).toBe(JSON.stringify(data));
            expect((response as any).responseHeaders.get('Content-Type')).toBe('application/json');
        });

        it('should set plain body without transformation', () => {
            response.body('plain text');
            expect((response as any).bodyData).toBe('plain text');
        });
    });

    describe('text', () => {
        it('should set text body with correct content type', () => {
            response.text('hello world');
            expect((response as any).bodyData).toBe('hello world');
            expect((response as any).responseHeaders.get('Content-Type')).toBe('text/plain');
        });
    });

    describe('json', () => {
        it('should set json body with correct content type', () => {
            const data = { message: 'test' };
            response.json(data);
            expect((response as any).bodyData).toBe(JSON.stringify(data));
            expect((response as any).responseHeaders.get('Content-Type')).toBe('application/json');
        });
    });

    describe('html', () => {
        it('should set html body with correct content type', () => {
            response.html('<p>unit test</p>');
            expect((response as any).bodyData).toBe('<p>unit test</p>');
            expect((response as any).responseHeaders.get('Content-Type')).toBe('text/html');
        });
    });

    describe('notFound', () => {
        it('should set 404 status code', () => {
            response.notFound();
            expect((response as any).statusCode).toBe(HttpStatus.NOT_FOUND);
        });
    });

    describe('redirect', () => {
        it('should set redirect status and location header', () => {
            const redirectUrl = '/unit-test';
            response.redirect(redirectUrl);
            expect((response as any).statusCode).toBe(HttpStatus.FOUND);
            expect((response as any).responseHeaders.get('location')).toBe(redirectUrl);
        });
    });

    describe('reply', () => {
        it('should properly set status, headers and body', () => {
            const mockReq = { method: 'GET' };
            
            response
                .status(HttpStatus.OK)
                .header('Content-Type', 'application/json')
                .json({ message: 'success' });

            expect((response as any).statusCode).toBe(HttpStatus.OK);
            expect((response as any).responseHeaders.get('Content-Type')).toBe('application/json');
            expect((response as any).bodyData).toBe(JSON.stringify({ message: 'success' }));
        });
    });
}); 