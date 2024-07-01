import { Response } from "express";

interface ApiResponse extends Response {
    code?: number;
}

export { ApiResponse }