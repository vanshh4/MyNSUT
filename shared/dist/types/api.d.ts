/** JSON-compatible primitives and structures accepted by API metadata. */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
    readonly [key: string]: JsonValue;
}
export interface ApiSuccessResponse<TData, TMeta = Record<string, unknown>> {
    success: true;
    message: string;
    data: TData;
    meta?: TMeta;
}
export interface ApiErrorDetails {
    code: string;
    requestId?: string;
    details?: unknown;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
    error: ApiErrorDetails;
}
export type ApiResponse<TData, TMeta = Record<string, unknown>> = ApiSuccessResponse<TData, TMeta> | ApiErrorResponse;
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export type PaginatedResponse<TItem> = ApiSuccessResponse<readonly TItem[], PaginationMeta>;
export interface HealthData {
    status: "ok";
    service: string;
    environment: "development" | "test" | "production";
    uptimeSeconds: number;
    timestamp: string;
}
//# sourceMappingURL=api.d.ts.map