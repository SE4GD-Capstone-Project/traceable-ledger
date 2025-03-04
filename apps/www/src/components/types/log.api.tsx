export interface LogType {
    transaction_log_id: number;
    buyer_id: string;
    buyer_url: string;
    seller_id: string;
    product_id: string;
    subpart_id: string;
    amount: number;
    date: string;
    log_hash: string;
}
