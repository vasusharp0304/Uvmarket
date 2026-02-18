import { NextRequest } from 'next/server';

export interface NextApiRequestWithBody extends NextRequest {
    json(): Promise<unknown>;
}
