export interface AIReviewResponse {
    summary?: string;
    category?: string;
    severity?: string;
    location?: string;
    description?: string;
    recommendation?: string;
    NewCodeVersion?: {
        code?: string;
    };
}
export interface HistoryItem {
    id?:string;
    createdAt:string,
    language:string,
    status:string
}